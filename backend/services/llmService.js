const OpenAI = require('openai');
const systemPrompt = require('../prompts/systemPrompt');

function demoAssessment(payload) {
  const symptomNames = payload.symptoms?.selectedSymptoms || [];
  const duration = payload.symptoms?.duration || 'Unknown';
  return {
    project: 'Viral Infection Early Predictor',
    assessment_status: 'completed',
    patient_summary: {
      symptoms_identified: symptomNames,
      additional_symptoms_from_audio: [],
      symptom_duration: duration,
      severity: payload.symptoms?.severity || 'Unknown'
    },
    blood_report_analysis: {
      overall_status: payload.bloodReport?.incomplete ? 'incomplete' : 'normal_or_abnormal_or_incomplete',
      abnormal_parameters: [],
      important_observations: [],
      limitations: payload.bloodReport?.limitations || ['No laboratory report was uploaded or analyzed']
    },
    combined_analysis: {
      symptom_and_audio_comparison: payload.audioTranscript ? 'The supplied transcript has not been analyzed because the LLM credential is unavailable.' : '',
      blood_report_and_symptom_correlation: 'No combined clinical interpretation is available in demo mode.',
      important_findings: [],
      conflicting_information: []
    },
    possible_conditions: [],
    risk_assessment: {
      risk_level: 'undetermined',
      warning_signs: [],
      reason: 'This is a development demo; configure OPENAI_API_KEY for an integrated assessment.'
    },
    recommendations: {
      immediate_actions: ['Monitor symptoms and seek professional advice if they worsen.'],
      doctor_consultation: 'Consult a qualified healthcare professional for persistent, worsening or concerning symptoms.',
      possible_medical_tests: [],
      medication_safety: ['Do not self-medicate or change prescribed medicines without professional advice.'],
      things_to_avoid: ['Delaying medical care for severe or worsening symptoms'],
      home_care: ['Rest and maintain adequate hydration when tolerated.']
    },
    follow_up_questions: ['Which symptoms are most concerning today?', 'Are the symptoms improving, stable or worsening?'],
    disclaimer: 'This demo assessment is not medical advice or a diagnosis. Consult a qualified healthcare professional.'
  };
}

async function analyzeCombined(payload) {
  if (!process.env.OPENAI_API_KEY) return { ...demoAssessment(payload), analysisStatus: 'demo' };

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(payload) }
    ]
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('The LLM returned an empty response');
  const result = JSON.parse(content);
  if (!result.project || !result.risk_assessment || !result.recommendations) {
    throw new Error('The LLM returned an invalid assessment structure');
  }
  return { ...result, analysisStatus: 'completed' };
}

module.exports = { analyzeCombined };
