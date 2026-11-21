const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, _file, cb) => {
    const safeName = path.basename(_file.originalname).replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const allowedReports = ['application/pdf', 'image/jpeg', 'image/png'];
const allowedAudio = ['audio/webm', 'audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp4', 'video/webm'];

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isReport = file.fieldname === 'bloodReport' && allowedReports.includes(file.mimetype);
    const isAudio = file.fieldname === 'audio' && allowedAudio.includes(file.mimetype);
    if (isReport || isAudio) return cb(null, true);
    cb(new Error(`Unsupported file type for ${file.fieldname}`));
  }
});

module.exports = upload;
