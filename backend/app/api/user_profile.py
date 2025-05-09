from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.deps.auth import get_current_uid
from app.services.firebase_service import (
    create_or_update_user_profile,
    get_user_profile,
)

router = APIRouter(tags=["user"])

# ---------- schema ----------
class UserProfileBody(BaseModel):
    full_name: str
    job_type: str            # engineering / marketing / …
    experience_level: str    # junior / mid / senior
    preferred_tone: str      # formal / casual / persuasive
    language: str            # en / es / he …
    custom_context: Optional[str] = ""

# ---------- endpoints ----------
@router.get("/profile", summary="Get authenticated user profile")
def fetch_profile(uid: str = Depends(get_current_uid)):
    data = get_user_profile(uid)
    if not data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return data

@router.post("/profile", summary="Create / update user profile")
def upsert_profile(body: UserProfileBody,
                   uid: str = Depends(get_current_uid)):
    create_or_update_user_profile(uid, body.dict())
    return {"ok": True}
