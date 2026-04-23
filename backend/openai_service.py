import os
import json
from openai import OpenAI
from typing import List, Dict, Any

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_questions(role: str, difficulty: str) -> List[str]:
    prompt = f"""
    You are an expert technical interviewer. Generate exactly 5 {difficulty} level interview 
    questions for a {role} position. 

    Rules:
    - Questions should be practical and realistic
    - Mix conceptual and problem-solving questions  
    - Each question should be answerable in 3-5 sentences
    - Return ONLY a JSON array of 5 strings, no numbering, no extra text

    Example output format:
    ["Question 1 here", "Question 2 here", "Question 3 here", "Question 4 here", "Question 5 here"]
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=800
    )
    
    content = response.choices[0].message.content.strip()
    
    # Strip markdown logic (if any)
    if content.startswith("```json"):
        content = content.replace("```json", "", 1)
        if content.endswith("```"):
            content = content[:-3]
    elif content.startswith("```"):
        content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
            
    try:
        data = json.loads(content)
        if not isinstance(data, list) or len(data) != 5:
            # Fallback handling could go here. Let's raise an error for now
            raise ValueError(f"OpenAI did not return a valid list of 5 items. Got: {data}")
        return data
    except json.JSONDecodeError:
        raise ValueError(f"OpenAI returned improperly formatted JSON. Raw response: {content}")

def evaluate_answer(question: str, user_answer: str) -> Dict[str, Any]:
    prompt = f"""
    You are an expert technical interviewer evaluating a candidate's answer.

    Question: {question}
    Candidate's Answer: {user_answer}

    Evaluate the answer and respond with ONLY a JSON object in this exact format:
    {{
      "score": <integer 0-10>,
      "feedback": "<2-3 sentences: what was good, what was missing, how to improve>"
    }}

    Scoring guide:
    - 9-10: Excellent, comprehensive answer
    - 7-8: Good answer with minor gaps  
    - 5-6: Adequate but missing key concepts
    - 3-4: Partial understanding shown
    - 0-2: Incorrect or very incomplete
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3, # lower temp for reliability
        max_tokens=500
    )
    
    content = response.choices[0].message.content.strip()
    # Let's clean up formatting
    if content.startswith("```json"):
        content = content.replace("```json", "", 1)
        if content.endswith("```"):
            content = content[:-3]
    elif content.startswith("```"):
        content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
            
    try:
        data = json.loads(content)
        if "score" not in data or "feedback" not in data:
            raise ValueError(f"Evaluation missing keys. Response: {data}")
        return data
    except json.JSONDecodeError:
        raise ValueError(f"OpenAI returned improperly formatted JSON. Raw response: {content}")
