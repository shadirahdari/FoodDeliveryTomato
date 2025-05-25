import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import testTokenRouter from './routes/testTokenRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = 4001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/food', foodRouter);
app.use('/api/cart', cartRouter);
app.use('/api/test', testTokenRouter);
app.use('/api/order', orderRouter);

// Connect to DB
connectDB();

app.get('/', (req, res) => {
  res.send('API Working');
});

app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
});
