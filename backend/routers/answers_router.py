from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from auth import get_current_user
from database import get_db
from openai_service import evaluate_answer

router = APIRouter(prefix="/answers", tags=["answers"])

@router.post("", response_model=schemas.AnswerResponse)
def submit_answer(answer: schemas.AnswerCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # 1. Verify question belongs to the user
    question = db.query(models.Question).filter(models.Question.id == answer.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    session = db.query(models.Session).filter(models.Session.id == question.session_id).first()
    if session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to answer this question")

    # 2. Check if already answered
    existing_ans = db.query(models.Answer).filter(models.Answer.question_id == answer.question_id).first()
    if existing_ans:
        raise HTTPException(status_code=400, detail="Answer already submitted for this question")

    # 3. Request evaluation from OpenAI
    try:
        evaluation = evaluate_answer(question.content, answer.user_answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate answer: {str(e)}")

    # 4. Save answer and evaluation
    new_answer = models.Answer(
        question_id=answer.question_id,
        user_answer=answer.user_answer,
        ai_feedback=evaluation.get("feedback", "No feedback provided by AI."),
        ai_score=evaluation.get("score", 0)
    )
    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)

    # 5. Update session overall score if all 5 questions are answered
    session_questions = db.query(models.Question).filter(models.Question.session_id == session.id).all()
    answered_questions = db.query(models.Answer).join(models.Question).filter(models.Question.session_id == session.id).all()
    
    if len(answered_questions) == 5:
        total_score = sum(ans.ai_score for ans in answered_questions if ans.ai_score is not None)
        # Assuming maximum score is 5*10 = 50, standardizing over 100
        overall_percentage = (total_score / 50.0) * 100
        session.overall_score = int(overall_percentage)
        db.commit()

    return schemas.AnswerResponse(
        user_answer=new_answer.user_answer,
        ai_feedback=new_answer.ai_feedback,
        ai_score=new_answer.ai_score
    )
