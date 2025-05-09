from fastapi import APIRouter, Depends, HTTPException
from app.models.promptability import Prompt, PromptAction
from app.services.firebase_service import db   # re-use Firestore client
from uuid import uuid4

router = APIRouter()


@router.post("/prompts", response_model=Prompt)
def save_prompt(prompt: Prompt):
    """Create or update a prompt in Firestore."""
    if not prompt.id:
        prompt.id = uuid4().hex
    db.collection("users").document(prompt.userId) \
      .collection("prompts").document(prompt.id).set(prompt.dict())
    return prompt


@router.post("/prompts/{prompt_id}/actions")
def log_prompt_action(prompt_id: str, action: PromptAction):
    """Write a usage action as a sub-collection doc."""
    action.id = uuid4().hex
    db.collection("users").document(action.userId) \
      .collection("prompts").document(prompt_id) \
      .collection("actions").document(action.id).set(action.dict())
    return {"ok": True}
