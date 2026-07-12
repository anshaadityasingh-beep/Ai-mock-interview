# AI-Driven Mock Interview Simulator

An interactive, full-stack MERN application that allows users to practice technical interviews (DSA & CS Fundamentals) using Gemini AI. The AI acts as a professional technical interviewer, asking custom questions, reacting to candidate answers, posing natural follow-ups, and evaluating responses across a 5-dimension rubric post-session.

## Tech Stack
- **Frontend**: React (Vite), Axios, React Router DOM, Recharts, Firebase Auth
- **Backend**: Node.js, Express, Mongoose (MongoDB), Firebase Admin SDK, Google Generative AI (Gemini 1.5 Flash SDK)
- **Database**: MongoDB

---

## Folder Structure Overview

```text
mock-interview-app/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/        # Login/Signup forms
│   │   │   ├── Dashboard/   # Chart, History, Problem Logging
│   │   │   ├── Interview/   # Category Selector, Chat Window, Scoring Result
│   │   │   └── Common/      # Navbar, ProtectedRoute, LoadingSpinner
│   │   ├── context/         # AuthContext provider
│   │   ├── pages/           # Page routes (Home, Login, Dashboard, InterviewSession)
│   │   ├── services/        # Firebase client configuration & Axios client instance
│   │   └── index.css        # Global CSS stylesheet & design token system
│   └── vercel.json          # SPA routing rules for Vercel deployment
│
├── server/                  # Node.js + Express Backend
│   ├── config/              # MongoDB connection & Firebase Admin setup
│   ├── controllers/         # API business logic handlers (auth, interview, scoring, dashboard, problems)
│   ├── models/              # Mongoose database models (User, QuestionBank, Session, ProblemLog)
│   ├── prompts/             # System prompt builders (Interviewer prompts, Scoring rubrics)
│   ├── routes/              # Express API routers
│   ├── scripts/             # Seeding script for questions database
│   └── server.js            # Express server entry point
│
└── .gitignore               # Root gitignore rules
```

---

## Local Setup & Development

### 1. Prerequisite Environments

Create a `.env` file inside `server/` with the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside `client/` with the following:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_API_BASE_URL=http://localhost:5000
```

### 2. Run the Backend

```bash
cd server
npm install
# Seed the CS Fundamentals questions (do this once)
npm run seed
# Start backend server in development mode
npm run dev
```

### 3. Run the Frontend

```bash
cd client
npm install
# Start development server
npm run dev
```

---

## Deployment & Free-Tier Server Waking

This application is configured to run on a zero-cost stack:
- **Frontend**: Vercel
- **Backend**: Render (free instance)
- **Database**: MongoDB Atlas

> **Note on Cold Starts**: Render's free tier automatically puts the backend service to sleep after 15 minutes of inactivity. When visiting the site after it has been asleep, the server may take up to **30 seconds** to boot back up. The UI is equipped with a warning spinner to alert the user during this period.
