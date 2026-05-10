import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';

// Import Route files
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (falls back to mock store if offline)
connectDB();

// Trust proxy for production environments (Render, Railway, Heroku, etc.)
app.set('trust proxy', 1);

// Rate Limiting Security Configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 authentication attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login or registration attempts, please try again after 15 minutes.' }
});

// Middlewares
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://amore-shop-official-frontend.vercel.app', // Placeholder or standard deployment URL
    /\.vercel\.app$/ // Allows subdomains of Vercel for testing preview deployments
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply Rate Limiters
app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// Custom Request Logger
app.use((req, res, next) => {
  const dbStatus = getDBStatus();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - (DB: ${dbStatus.useMockData ? 'MOCK MEM' : 'MONGO ACTIVE'})`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Base Route
app.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    success: true,
    message: 'Welcome to SweetCrave API Gateway!',
    systemStatus: {
      status: 'online',
      port: PORT,
      database: dbStatus.useMockData ? 'Mock Memory DB Mode (Online/Connected)' : 'MongoDB Connected',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date()
    }
  });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SweetCrave backend server running on http://localhost:${PORT}`);
  const dbStatus = getDBStatus();
  if (dbStatus.useMockData) {
    console.log('💡 Note: Running with Mock Database fallback. No external setup required!');
  }
});
