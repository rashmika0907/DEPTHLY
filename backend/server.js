import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import generateRoutes from './routes/generate.js';
import { config } from './config.js';

const app = express();

/* -------------------- CORS -------------------- */
const allowedOrigins = [
  'http://localhost:4200',
  'https://depthly.vercel.app',
  'https://depthly-puce.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server & tools like Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Handle preflight requests
app.options('*', cors());

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.get('/', (req, res) => {
  res.send('Depthly backend is running 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* -------------------- DATABASE -------------------- */
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

/* -------------------- ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    message: err.message || 'Something went wrong'
  });
});

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || config.port || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
