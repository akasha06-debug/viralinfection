const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  patientId: { type: String, required: true, index: true },
  symptoms: mongoose.Schema.Types.Mixed,
  bloodReport: mongoose.Schema.Types.Mixed,
  audioTranscript: { type: String, default: '' },
  combinedAnalysis: mongoose.Schema.Types.Mixed,
  possibleConditions: mongoose.Schema.Types.Mixed,
  riskAssessment: mongoose.Schema.Types.Mixed,
  recommendations: mongoose.Schema.Types.Mixed,
  followUpQuestions: [String],
  analysisStatus: { type: String, enum: ['completed', 'failed', 'demo'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
