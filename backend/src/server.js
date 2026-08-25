import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/bookings', bookingRoutes);

app.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(error.errors).map((item) => item.message).join(', '),
    });
  }
  console.error(error);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/room_booking')
  .then(() => {
    app.listen(port, () => console.log(`API listening on port ${port}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
