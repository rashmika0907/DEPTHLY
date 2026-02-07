import { GoogleGenerativeAI } from '@google/generative-ai';
import jwt from 'jsonwebtoken';
import History from '../models/History.js';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateExplanation = async (req, res) => {
    const { topic, level, language, token } = req.body;
    console.log('Gemini Request:', { topic, level, language, tokenPresent: !!token });

    if (!topic || !level || !language || !token) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify Token (as per instructions to verify from body)
    let userId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Setup SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {

        // Note: Using gemini-2.0-flash as verified by API check.
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are an expert tutor. explain the topic "${topic}" at a "${level}" level.
        CRITICAL: The ENTIRE response must be in "${language}". Do NOT switch to English unless the requested language is English.
        Use Markdown formatting. 
        Make the explanation detailed, engaging, and suitable for the requested level.
        Structure the content clearly with headings and bullet points where appropriate.`;

        const result = await model.generateContentStream(prompt);

        let fullText = '';

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
        }

        // Save to History
        const historyItem = await History.create({
            user: userId,
            topic,
            level,
            content: fullText
        });
        console.log('History Item Saved:', historyItem._id);

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();



    } catch (error) {
        console.error('Gemini API Error:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
};
