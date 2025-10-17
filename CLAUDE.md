# CLAUDE.md

AI agent guidance for developing the Imakita Industries project.

## Project Overview

**今北産業株式会社 (Imakita Industries Inc.)** - An AI-powered Japanese text summarization service that condenses any text into exactly 3 lines, inspired by the internet slang "今北産業" (meaning "I just got here, explain in 3 lines").

### Key Features
- 3-line AI summarization with customizable tones (普通, ニュース風, ツンデレ, 関西弁, ホラー調)
- Text-to-speech output with tone-specific voices
- Simple SPA with no build step
- Audio playback at 1.25x speed

### Tech Stack
- **Backend**: Node.js 22.x (ESM), Express.js, OpenAI GPT-4o-mini + TTS
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Deployment**: Docker (node:22-alpine)
- **Environment**: dotenv

## Development Commands

### Local Development
```bash
npm install
npm run dev     # Development with nodemon
npm start       # Production
# Server runs on http://localhost:8080
```

### Docker
```bash
# Using Docker Compose (recommended)
docker-compose up -d
docker-compose logs -f
docker-compose down

# Using Docker directly
docker build -t imakita-industries .
docker run -p 8080:8080 --env-file .env imakita-industries
```

## Project Structure

```
imakita-industries/
├── src/                  # Backend source
│   ├── server.js        # Express app, serves /public, API endpoints
│   ├── summarizer.js    # GPT-4o-mini summarization logic
│   └── tts.js           # TTS with tone-based voice selection
├── public/              # Frontend static files (served by Express)
│   ├── index.html       # SPA UI
│   ├── script.js        # Client logic, API calls, loading states
│   └── style.css        # Styling
├── package.json
├── .env                 # OPENAI_API_KEY
├── Dockerfile
└── docker-compose.yaml
```

## Architecture

### Request Flow
1. User submits text + tone via `public/index.html`
2. `public/script.js` → POST `/api/imakita` `{input, tone, output_type: "audio"}`
3. `src/server.js` → `summarizer.js` → `tts.js`
4. Response: `{summary, audio_url}`

### Key Modules

**src/server.js**
- Serves `public/` static files
- `POST /api/imakita`: Orchestrates summarization + TTS
- `GET /audio/*`: Serves MP3 files from `/tmp`

**src/summarizer.js**
- `summarize(text, tone)`: Returns 3-line summary with "・" bullets
- Uses GPT-4o-mini with tone-specific prompts

**src/tts.js**
- `textToSpeech(text, tone)`: Generates MP3 with tone-matched voice
- Voice mapping: ツンデレ→shimmer, 普通→nova, ニュース風→onyx, etc.
- Saves to `/tmp/imakita_{timestamp}.mp3`

**public/script.js**
- Loading state: "要約中..." button text + disabled
- Clears previous results before new request
- Sets audio playback rate to 1.25x

## Environment Setup

Required in `.env`:
```bash
OPENAI_API_KEY=sk-...
```

⚠️ Never commit `.env` - it's in `.gitignore`

## Important Implementation Details

### Core Constraints
- ✅ Summaries are **exactly 3 lines**, each starting with "・"
- ✅ Backend uses **ES modules** (`"type": "module"`)
- ✅ Audio files in `/tmp` are **not persistent** across restarts
- ✅ Requires **Node.js >= 20**

### API Behavior
- No authentication or rate limiting
- Frontend uses relative paths (same-origin assumption)
- Audio playback defaults to 1.25x speed
- Error handling with try-catch and user alerts

### Tone System
| Tone | Voice | Characteristics |
|------|-------|----------------|
| 普通 | nova | Bright, active female |
| ツンデレ | shimmer | Soft, gentle female |
| ニュース風 | onyx | Deep, calm male |
| 関西弁 | nova | Energetic female |
| ホラー調 | echo | Eerie male |

### Design Philosophy
- Humor and playfulness are core to UX
- Simple, no-build frontend
- Minimal dependencies

## Related Documentation

- **README.md**: User guide (Japanese) with setup, API specs, usage
- **CLAUDE.md**: This file - AI agent development guide
