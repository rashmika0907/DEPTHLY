import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/gemini', geminiRoutes);

app.get('/', (req, res) => res.send('Depthly API running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
