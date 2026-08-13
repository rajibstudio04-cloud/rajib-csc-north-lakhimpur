// Express Node.js Production API Server for Rajib CSC BBPS Backend
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetchBillHandler from './api/bbps/fetch-bill.js';
import payBillHandler from './api/bbps/pay-bill.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.post('/api/bbps/fetch-bill', (req, res) => fetchBillHandler(req, res));
app.post('/api/bbps/pay-bill', (req, res) => payBillHandler(req, res));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Rajib CSC Live BBPS API Gateway', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Rajib CSC Live BBPS Backend Server running on port ${PORT}`);
});
