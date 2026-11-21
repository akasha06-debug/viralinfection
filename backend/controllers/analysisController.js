const fs = require('fs');
const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Analysis = require('../models/Analysis');
const { extractReport } = require('../services/reportService');
const { transcribeAudio } = require('../services/audioService');
const { analyzeCombined } = require('../services/llmService');

function removeFile(file) {
  if (file?.path) fs.unlink(file.path, () => {});
}

async function createAnalysis(req, res, next) {
  try {
    if (!req.body.consent) throw Object.assign(new Error('Consent is required to process health information'), { status: 400 });

    let symptoms;
    try {
      symptoms = typeof req.body.symptoms === 'string' ? JSON.parse(req.body.symptoms) : (req.body.symptoms || {});
    } catch {
      throw Object.assign(new Error('Symptoms data is invalid'), { status: 400 });
    }

    const patientId = req.body.patientId?.trim() || `patient-${Date.now()}`;
    const bloodReport = await extractReport(req.files?.bloodReport?.[0]);
    let audioTranscript = '';
    if (req.files?.audio?.[0]) audioTranscript = await transcribeAudio(req.files.audio[0]);

    const payload = {
      patient: {
        patientId,
        age: req.body.age ? Number(req.body.age) : null,
        relevantInformation: req.body.relevantInfo || ''
      },
      symptoms,
      bloodReport,
      audioTranscript
    };
    const assessment = await analyzeCombined(payload);
    const analysisStatus = assessment.analysisStatus || 'completed';
    delete assessment.analysisStatus;

    let saved = null;
    if (mongoose.connection.readyState === 1) {
      await Patient.findOneAndUpdate(
        { patientId },
        { patientId, age: payload.patient.age, relevantInfo: payload.patient.relevantInformation, consentToStore: true },
        { upsert: true, new: true }
      );
      saved = await Analysis.create({
        patientId,
        symptoms,
        bloodReport,
        audioTranscript,
        combinedAnalysis: assessment.combined_analysis,
        possibleConditions: assessment.possible_conditions,
        riskAssessment: assessment.risk_assessment,
        recommendations: assessment.recommendations,
        followUpQuestions: assessment.follow_up_questions,
        analysisStatus
      });
    }

    res.status(201).json({
      id: saved?._id?.toString(),
      patientId,
      analysisStatus,
      ...assessment
    });
  } catch (error) {
    next(error);
  } finally {
    req.files?.bloodReport?.forEach(removeFile);
    req.files?.audio?.forEach(removeFile);
  }
}

async function getAnalysis(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Database is unavailable' });
    const result = await Analysis.findById(req.params.id).lean();
    if (!result) return res.status(404).json({ error: 'Analysis not found' });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Database is unavailable' });
    const patientId = req.params.patientId;
    const requestedPatientId = req.headers['x-patient-id'];
    if (!requestedPatientId || requestedPatientId !== patientId) {
      return res.status(403).json({ error: 'Patient history is restricted to the consenting patient' });
    }
    const history = await Analysis.find({ patientId }).sort({ createdAt: -1 }).lean();
    res.json(history);
  } catch (error) {
    next(error);
  }
}

module.exports = { createAnalysis, getAnalysis, getHistory };
