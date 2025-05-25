import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import orderRouter from './routes/orderRoute.js';
import userRouter from './routes/userRoute.js';
import foodRouter from './routes/foodRoute.js';
import webhookRouter from './routes/webhookRoute.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Both main app and admin app
  credentials: true
}));

// Regular routes middleware
app.use(express.json());

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Webhook route needs raw body
app.use('/api/webhook', webhookRouter);

// API routes
app.use('/api/order', orderRouter);
app.use('/api/user', userRouter);
app.use('/api/food', foodRouter);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 