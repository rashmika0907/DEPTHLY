# Quick Reference - Backend Gemini Integration

## 📋 One-Page Overview

### The Problem
- Original: Frontend called Gemini API directly (exposed secrets)
- Solution: Backend calls Gemini API, frontend calls backend

### The Solution
```
Frontend (Angular)
    ↓ POST /api/generate
Backend (Express)
    ↓ Call Gemini API
Google Gemini
    ↓
Backend
    ↓ Return { text }
Frontend (Display)
```

## 🚀 Quick Start

### 1. Get API Key
```
Go to https://ai.google.dev → Create Key
```

### 2. Set Up Backend
```env
# backend/.env
GEMINI_API_KEY=sk_xxxxxxxxxxxx
```

### 3. Run Locally
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

### 4. Test
- Visit http://localhost:4200
- Enter a topic
- Select a depth level
- Should see generated content

## 📝 Frontend Code Changes

### Before (Removed)
```typescript
import { GeminiService } from '../../services/gemini.service';
private gemini = inject(GeminiService);
const response = await this.gemini.generateExplanationStream(topic, level, language);
```

### After (Current)
```typescript
import { HttpClient } from '@angular/common/http';
private http = inject(HttpClient);

const prompt = this.constructPrompt(topic, level, language);
const response = await fetch('https://depthly-backend.onrender.com/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, level, language })
});
const data = await response.json();
this.displayText.set(data.text);
```

## 🔧 Backend Code Details

### New File: `backend/routes/generate.js`
```javascript
POST /api/generate
Request:  { prompt, level, language }
Response: { error: false, text: "...", level, language }
Error:    { error: true, message: "..." }
```

### Key Points
- Uses native fetch (no axios needed)
- Google Gemini API endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- Auth via header: `x-goog-api-key`
- Extract text from: `data.candidates[0].content.parts[0].text`

## 🔐 Security Checklist

- ✅ API key in backend env only
- ✅ No Google SDK in frontend
- ✅ CORS restricted to known origins
- ✅ Input validation on backend
- ✅ Error messages don't leak secrets

## 🧪 Quick Test with cURL

```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain AI for kids",
    "level": "Kids",
    "language": "en"
  }'
```

## 📊 File Structure

```
depthly/
├── backend/
│   ├── routes/
│   │   ├── auth.js       (existing)
│   │   └── generate.js   (NEW - Gemini endpoint)
│   ├── config.js         (modified - added geminiApiKey)
│   ├── server.js         (modified - mounted generate route)
│   └── .env              (modified - added GEMINI_API_KEY)
├── src/
│   └── components/
│       └── explore/
│           └── explore.component.ts  (modified - calls backend)
├── BACKEND_GEMINI_SETUP.md           (NEW - detailed setup)
├── REFACTORING_SUMMARY.md            (NEW - architecture)
└── IMPLEMENTATION_CHECKLIST.md       (NEW - verification)
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Gemini API key not configured" | Add `GEMINI_API_KEY` to `backend/.env` |
| CORS error | Check origin is in `allowedOrigins` array in `server.js` |
| 500 error from backend | Check backend logs, verify API key is valid |
| No response in frontend | Verify backend URL is correct |
| Blank response | Check Gemini API response format extraction |

## 📦 Deployment

### Vercel Frontend
1. No changes needed (frontend is same)
2. Update backend URL if different

### Render/Railway Backend
1. Set `GEMINI_API_KEY` environment variable
2. Deploy
3. Update frontend if URL changes

### Environment Variables Needed
- Backend: `GEMINI_API_KEY`, `MONGODB_URI`, `JWT_SECRET`
- Frontend: None (all in backend)

## 📞 Support

### Check these files for details:
- `BACKEND_GEMINI_SETUP.md` - Complete setup guide
- `REFACTORING_SUMMARY.md` - Architecture and reasoning
- `backend/routes/generate.js` - Backend implementation
- `src/components/explore/explore.component.ts` - Frontend code

### Key Contacts:
- Google Generative AI: https://ai.google.dev/docs
- Express Docs: https://expressjs.com
- Angular Docs: https://angular.io

---

**Status**: ✅ Ready for Production

**Last Updated**: February 1, 2026

**Version**: 1.0 - Backend Gemini Integration
