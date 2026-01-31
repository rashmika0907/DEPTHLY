import express from 'express';
import { config } from '../config.js';

const router = express.Router();

/**
 * POST /api/generate
 * Generate content using Google Gemini API
 * 
 * Request body:
 * {
 *   prompt: string,
 *   level: 'Kids' | 'Teens' | 'Novice' | 'College' | 'Expert',
 *   language: string (e.g., 'en', 'es', 'fr')
 * }
 */
router.post('/', async (req, res) => {
  const { prompt, level, language } = req.body;

  // Validate input
  if (!prompt || !level || !language) {
    return res.status(400).json({
      error: true,
      message: 'Missing required fields: prompt, level, language'
    });
  }

  // Check if GEMINI_API_KEY is configured
  if (!config.geminiApiKey) {
    return res.status(500).json({
      error: true,
      message: 'Gemini API key not configured on server'
    });
  }

  try {
    // Call Google Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.geminiApiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return res.status(response.status).json({
        error: true,
        message: `Gemini API error: ${errorData.error?.message || 'Unknown error'}`
      });
    }

    const data = await response.json();
    
    // Extract generated text from Gemini response
    let generatedText = '';
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const content = data.candidates[0].content;
      if (content.parts && content.parts[0]) {
        generatedText = content.parts[0].text || '';
      }
    }

    res.json({
      error: false,
      text: generatedText,
      level,
      language
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({
      error: true,
      message: `Server error: ${error.message}`
    });
  }
});

export default router;
