from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, sessions_router, answers_router

app = FastAPI(title="AI Mock Interviewer API")

# Update origins for production
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(auth_router.router)
app.include_router(sessions_router.router)
app.include_router(answers_router.router)
