# Viral Infection Early Predictor

A full-stack React, Express and MongoDB application for combined symptom, blood-report and audio health assessments.

## Requirements

- Node.js 20+
- MongoDB local instance or MongoDB Atlas
- Optional OpenAI API key for text assessment and Whisper transcription

## Setup

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm start
```

In another terminal:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. The backend runs at `http://localhost:5000`.

## Configuration

Set `MONGODB_URI` to enable secure result persistence. Set `OPENAI_API_KEY` to enable real LLM analysis and Whisper audio transcription. Set `OPENAI_MODEL` and `OPENAI_AUDIO_MODEL` when overriding defaults.

Without `OPENAI_API_KEY`, the backend explicitly returns a demo result. It does not fabricate an unconfigured clinical assessment.

## Privacy behavior

- Uploaded report and audio files are deleted after processing.
- MongoDB persistence is disabled unless `MONGODB_URI` is configured.
- History access requires matching `X-Patient-ID` and patient ID values.
- Production deployments should add authenticated user accounts, encryption and a complete retention/deletion policy.
