# PrepAI - AI Mock Interviewer

A sleek, full-stack AI-powered mock interview platform. PrepAI allows users to practice role-specific technical interviews, receive instant AI-generated feedback, and visually track their progress over time across different difficulties.

Built with a modern stack featuring Next.js 14, Framer Motion, FastAPI, PostgreSQL, and OpenAI's GPT-4o.

---

## Features

- **AI-Powered Sessions:** Dynamically generates technical, behavioral, and practical questions based on the user's requested job role and difficulty (Easy/Medium/Hard).
- **Instant Feedback:** Evaluates user answers in real-time, providing immediate score out of 10 and constructive feedback on missing elements.
- **Progress Tracking:** Beautiful dashboard with historical interview tracking and automated overall performance metrics (Great / Okay / Needs Work).
- **Premium UI/UX:** Built with Tailwind CSS and Framer Motion. Features a deep navy and indigo-violet aesthetic, smooth micro-interactions, responsive glowing gradients, and floating authenticated states.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, Lucide React |
| **Backend** | FastAPI (Python 3.11), SQLAlchemy |
| **Database** | PostgreSQL 15 |
| **AI Integration**| OpenAI GPT-4o API |
| **Auth** | Custom JWT + `bcrypt` implementation |

---

## Project Structure

```
PrepAI/
│
├── frontend/                        ← Next.js 14 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js              ← Modern Landing page
│   │   │   ├── login/page.js        ← Split-screen Login via Framer Motion
│   │   │   ├── signup/page.js       ← Split-screen Signup via Framer Motion
│   │   │   ├── dashboard/page.js    ← Protected user portal (Past sessions + New)
│   │   │   ├── interview/
│   │   │   │   └── [id]/page.js     ← Active real-time interview answering screen
│   │   │   └── results/
│   │   │       └── [id]/page.js     ← Comprehensive post-interview score breakdown
│   │   ├── components/
│   │   │   ├── Navbar.js            ← Global dynamic navigation (Deep Navy)
│   │   └── lib/
│   │       └── api.js               ← Axios interception and backend API bindings
│
├── backend/                         ← FastAPI Application
│   ├── main.py                      ← App entry point & main mounting
│   ├── database.py                  ← PostgreSQL engine connection 
│   ├── models.py                    ← SQLAlchemy ORM (Users, Sessions, Questions, Answers)
│   ├── schemas.py                   ← Pydantic validation bindings
│   ├── auth.py                      ← JWT generation & Password Hashing
│   ├── openai_service.py            ← OpenAI System Prompts & Structured JSON interactions
│   └── routers/
│       ├── auth_router.py           
│       ├── sessions_router.py       
│       └── answers_router.py        
```

---

## Local Development Setup

To run this application locally, you will need Node.js, Python 3.11+, and a running Postgres database.

### 1. Environment Variables

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mockinterview
OPENAI_API_KEY=sk-your-openai-api-key-here
SECRET_KEY=your-secure-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Start the Backend

Navigate to the `backend` folder, create a virtual environment, install dependencies, and launch FastAPI:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Start the Frontend

Navigate to the `frontend` folder, install the packages, and run the Next.js development server:

```bash
cd frontend
npm install
npm run dev
```

### 4. Visit the Application
- Application: `http://localhost:3000`
- Backend API Docs (Swagger / OpenAPI): `http://localhost:8000/docs`
