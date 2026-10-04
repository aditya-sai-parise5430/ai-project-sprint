# AI Project Sprint — Build. Ship. Prove.

A rapid project matching and registration platform designed for final-year engineering students. The application identifies a student's technical interests and goals, matching them deterministically with a 60-minute deployable AI project, and creates a personalised "AI Project Passport" to track progress and referrals.

## Problem
Many final-year engineering students understand AI theory but lack a tangible, deployed project in their portfolio. When placement season arrives, they struggle to demonstrate practical implementation skills. Most available tutorials are either too simplistic or impractically long.

## Solution
"AI Project Sprint" is a 60-minute workshop campaign. Students take a quick readiness check, register for free, and are deterministically assigned a personalised AI project (e.g., Computer Vision, NLP, or Data Science) matched exactly to their skill level and career goals. 

## Features
- **Deterministic Matcher**: Recommends 1 of 10 curated AI projects based on a student's domain interest, college year, and career goal.
- **Personalised Passport**: A persistent dashboard showing the recommended project's tech stack, 60-minute build plan, and sharing capabilities.
- **Viral Referral Loop**: Built-in referral generation (`?ref=XXXX`) and WhatsApp sharing. Students earn milestones as their friends register.
- **Admin Dashboard**: Real-time acquisition funnel, registration sources, and top referrers leaderboard.
- **Fully Asynchronous Analytics**: Background event tracking that never blocks the user journey.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Recharts (Analytics), React Router
- **Backend**: Python, FastAPI, Supabase Python Client
- **Database**: Supabase (PostgreSQL)

## Architecture
The application follows a decoupled client-server architecture:
- The React frontend manages the multi-step form state and referral persistence in `localStorage`.
- The FastAPI backend handles validation, project matching logic, and securely interfaces with Supabase using the Service Role Key (bypassing RLS for admin operations).
- Analytics are logged to an `events` table via FastAPI's `BackgroundTasks`.

## Local Development

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Supabase Project

### 1. Database Setup
Execute the contents of `docs/schema.sql` in your Supabase SQL Editor. 
Then, insert the 10 project definitions from `backend/app/data/projects.py` into the `projects` table.

### 2. Backend
```bash
cd backend
python -m venv .venv
# On Windows: .venv\Scripts\activate
# On Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```
Fill in `.env`, then run:
```bash
uvicorn app.main:app --reload
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (Required for backend DB operations)
- `ADMIN_KEY`: Custom secret key for accessing the admin dashboard (e.g., `supersecret123`)
- `APP_ENV`: `development` or `production`
- `CORS_ORIGINS`: Comma-separated list of allowed frontend URLs
- `FRONTEND_URL`: URL of the frontend for generating referral links

### Frontend (`frontend/.env.local`)
- `VITE_API_URL`: URL to the FastAPI backend (e.g., `http://localhost:8000/v1`)

## Deployment

### Frontend (Vercel / Netlify)
1. Set the Build Command: `npm run build`
2. Set the Publish Directory: `dist`
3. Add the `VITE_API_URL` environment variable pointing to your deployed backend.

### Backend (Render / Heroku)
1. Set the Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Add all environment variables from `.env.example` into the service's environment settings.
3. Ensure `CORS_ORIGINS` includes your production frontend URL.

## Growth Loop
1. **Acquisition**: User arrives at the Landing Page.
2. **Activation**: User completes the Readiness Check and registers.
3. **Value Realisation**: User receives a tailored AI project and build plan on their Passport.
4. **Referral**: User clicks "Share on WhatsApp", appending their unique `?ref=...` code.
5. **Loop**: A new user clicks the link, their `ref` code is extracted to `localStorage`, and the referrer is credited upon successful registration.

## Challenge Deliverables
- Fully functioning MVP with deterministic matching
- Complete PostgreSQL schema
- End-to-end referral and tracking system
- Mobile-responsive, conversion-optimized UI
