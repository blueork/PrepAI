from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import sessions_router, answers_router
import models
from database import engine

app = FastAPI(title="AI Mock Interviewer API")

models.Base.metadata.create_all(bind=engine)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(sessions_router.router)
app.include_router(answers_router.router)
