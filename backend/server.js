require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/analysisRoutes');
const { connectDB } = require('./config/db');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', routes);

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ error: status >= 500 ? 'An unexpected server error occurred' : error.message });
});

const port = Number(process.env.PORT) || 5000;
connectDB().catch((error) => console.error('MongoDB connection failed:', error.message));
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
