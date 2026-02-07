# Backend API Setup - Gemini Integration

## Overview

The Gemini API integration has been refactored to run exclusively on the backend for security. The frontend now calls the backend endpoint instead of making direct API calls.

## Backend Setup

### 1. Add GEMINI_API_KEY to Backend .env

Edit `backend/.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 2. New Backend Endpoint

**POST `/api/generate`**

Generates content using Google Gemini API (gemini-2.5-flash model).

**Request Body:**
```json
{
  "prompt": "string",
  "level": "Kids|Teens|Novice|College|Expert",
  "language": "en|es|fr|de|ja|zh|pt|ru"
}
```

**Success Response (200):**
```json
{
  "error": false,
  "text": "generated content here...",
  "level": "Novice",
  "language": "en"
}
```

**Error Response (400/500):**
```json
{
  "error": true,
  "message": "Error description"
}
```

## Frontend Changes

The Angular `explore.component.ts` now:

1. **Constructs a detailed prompt** based on the selected depth level and language
2. **Makes an HTTP POST request** to `https://depthly-backend.onrender.com/api/generate`
3. **Displays the response** directly in the UI
4. **Saves history** with the generated content

### Key Methods

- `generate(level)` - Initiates content generation
- `constructPrompt()` - Builds the prompt with level-specific instructions
- `stopGeneration()` - Cancels ongoing request

## Security

✅ **No API keys in frontend code**
✅ **No Google SDK in frontend**
✅ **All secrets in backend .env only**
✅ **CORS properly configured**

## Testing the Endpoint

Using cURL:

```bash
curl -X POST https://depthly-backend.onrender.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain photosynthesis for a 5-year-old in English.",
    "level": "Kids",
    "language": "en"
  }'
```

Using Postman:
1. Method: POST
2. URL: `https://depthly-backend.onrender.com/api/generate`
3. Body (JSON):
   ```json
   {
     "prompt": "Explain quantum computing for an expert in English.",
     "level": "Expert",
     "language": "en"
   }
   ```

## Flow Diagram

```
User Input (Frontend)
    ↓
    ├─ Select Level + Enter Topic
    ├─ Construct Prompt with Level Instructions
    ├─ POST to Backend /api/generate
    ↓
Backend Processing
    ├─ Validate Input
    ├─ Check GEMINI_API_KEY
    ├─ Call Google Gemini API
    ├─ Extract Generated Text
    ↓
Response (Frontend)
    ├─ Display Generated Content
    ├─ Save to History
    └─ Show Copy/Stop Buttons
```

## Environment Variables

**Backend (.env)**
- `GEMINI_API_KEY` - Google Generative AI API key (required for /api/generate)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5000)

**Frontend**
- No secrets required!

## Troubleshooting

1. **"Gemini API key not configured on server"**
   - Add `GEMINI_API_KEY` to `backend/.env`

2. **CORS errors**
   - Check that your frontend origin is in `allowedOrigins` in `server.js`
   - Currently allows:
     - `http://localhost:4200`
     - `https://depthly.vercel.app`
     - `https://depthly-puce.vercel.app`

3. **Generation fails silently**
   - Check backend logs for error details
   - Verify API key is valid
   - Check backend is running on port 5000

## Next Steps

1. Get a Gemini API key from https://ai.google.dev
2. Add it to `backend/.env`
3. Start backend: `npm run dev` in `/backend`
4. Start frontend: `npm run dev` in root directory
5. Test by entering a topic and selecting a depth level
