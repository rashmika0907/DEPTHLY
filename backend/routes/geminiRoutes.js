import express from 'express';
import { generateExplanation } from '../controllers/geminiController.js';

const router = express.Router();

router.post('/generate', generateExplanation);

export default router;
