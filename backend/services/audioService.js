const fs = require('fs');
const OpenAI = require('openai');

async function transcribeAudio(file) {
  if (!file) return '';
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for audio transcription');
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(file.path),
    model: process.env.OPENAI_AUDIO_MODEL || 'whisper-1'
  });
  return transcription.text || '';
}

module.exports = { transcribeAudio };
