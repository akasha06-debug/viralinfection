const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { createAnalysis, getAnalysis, getHistory } = require('../controllers/analysisController');

const router = express.Router();

router.post('/analysis', upload.fields([{ name: 'bloodReport', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), createAnalysis);
router.get('/analysis/:id', getAnalysis);
router.get('/analysis/history/:patientId', getHistory);
router.get('/health', (_req, res) => res.json({ status: 'ok', service: 'Viral Infection Early Predictor API' }));

module.exports = router;
