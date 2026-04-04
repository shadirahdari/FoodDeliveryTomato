import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import orderRouter from './routes/orderRoute.js';
import userRouter from './routes/userRoute.js';
import foodRouter from './routes/foodRoute.js';
import webhookRouter from './routes/webhookRoute.js';
import driverRouter from './routes/driverRoute.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create HTTP server for Socket.io
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// CORS configuration
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

// Regular routes middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Webhook route needs raw body
app.use('/api/webhook', webhookRouter);

// API routes
app.use('/api/order', orderRouter);
app.use('/api/user', userRouter);
app.use('/api/food', foodRouter);
app.use('/api/driver', driverRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 Driver connected:', socket.id);

  // Driver joins their room for location updates
  socket.on('join-driver-room', (driverId) => {
    socket.join(`driver-${driverId}`);
    console.log(`Driver ${driverId} joined room`);
  });

  // Handle location updates from drivers
  socket.on('update-location', async (data) => {
    const { driverId, latitude, longitude } = data;

    try {
      // Update driver location in database
      await mongoose.model('Driver').findByIdAndUpdate(driverId, {
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: new Date()
        }
      });

      // Broadcast location to customers tracking this driver
      socket.to(`driver-${driverId}`).emit('driver-location-update', {
        driverId,
        latitude,
        longitude,
        timestamp: new Date()
      });

      console.log(`📍 Location updated for driver ${driverId}: ${latitude}, ${longitude}`);
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  });

  // Customer joins order tracking room
  socket.on('join-order-tracking', (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`Customer joined tracking for order ${orderId}`);
  });

  // Handle order status updates
  socket.on('order-status-update', (data) => {
    const { orderId, status, message } = data;
    socket.to(`order-${orderId}`).emit('order-status-changed', {
      orderId,
      status,
      message,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Driver disconnected:', socket.id);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.io enabled for real-time tracking`);
}); 