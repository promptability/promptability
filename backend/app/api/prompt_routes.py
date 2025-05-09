import logging
from fastapi import APIRouter, Depends, HTTPException
from uuid import uuid4
from datetime import datetime
from app.deps.auth import get_current_uid
from app.models.promptability import Prompt
from app.services.firebase_service import db, get_user_profile
from app.services.openai_service import generate_prompt_text
from app.models.prompt_request import PromptGenerationRequest

router = APIRouter(tags=["prompt"])
log = logging.getLogger("api.prompt")

# @router.post("/prompts/generate", response_model=Prompt)
# def generate_prompt(payload: PromptGenerationRequest, uid: str = Depends(get_current_uid)):
#     """
#     Expects a PromptGenerationRequest with minimal required fields.
#     We verify the user has a profile (required), generate the prompt,
#     and save the complete Prompt object to Firestore.
#     """
#     # Check if user has a profile - required to use the service
#     profile = get_user_profile(uid)
#     if not profile:
#         raise HTTPException(status_code=404, detail="User profile not found")

#     # Create a minimal Prompt object for the generation service
#     temp_prompt = Prompt(
#         id="",
#         userId=uid,
#         selectedText=payload.selectedText,
#         generatedPrompt="",
#         roleId=payload.roleId or "",
#         industryId=payload.industryId or "",
#         subcategoryId=payload.subcategoryId,
#         templateId=payload.templateId or "",
#         platformId=payload.platformId,
#         formattingOptions=payload.formattingOptions,
#         pageUrl=payload.pageUrl or "",
#         pageTitle=payload.pageTitle or "",
#         createdAt=datetime.utcnow()
#     )

#     # Build the prompt text - pass profile but it won't be used for content
#     prompt_text = generate_prompt_text(temp_prompt, profile)

#     # Fill out remaining fields
#     temp_prompt.id = uuid4().hex
#     temp_prompt.generatedPrompt = prompt_text

#     # Save to Firestore
#     db.collection("users").document(uid) \
#       .collection("prompts").document(temp_prompt.id).set(temp_prompt.dict())

#     return temp_prompt

@router.post("/prompts/generate", response_model=Prompt)
def generate_prompt(
    payload: PromptGenerationRequest,
    uid: str = Depends(get_current_uid),
):
    """Generate + save a prompt, then return it back to the extension."""

    # ▶──────────── LOG INCOMING PAYLOAD ────────────
    log.info("↘︎  /prompts/generate payload: %s", payload.dict())

    # make sure a profile exists
    profile = get_user_profile(uid)
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    # create a skeleton Prompt (no generatedPrompt yet)
    temp_prompt = Prompt(
        id="",
        userId=uid,
        selectedText=payload.selectedText,
        generatedPrompt="",
        roleId=payload.roleId or "",
        industryId=payload.industryId or "",
        subcategoryId=payload.subcategoryId,
        templateId=payload.templateId or "",
        platformId=payload.platformId,
        formattingOptions=payload.formattingOptions,
        pageUrl=payload.pageUrl or "",
        pageTitle=payload.pageTitle or "",
        createdAt=datetime.utcnow(),
    )

    # call OpenAI
    prompt_text = generate_prompt_text(temp_prompt, profile)
    temp_prompt.id = uuid4().hex
    temp_prompt.generatedPrompt = prompt_text

    # ▶──────────── LOG THE RESULT ────────────
    log.info(
        "↗︎  /prompts/generate result id=%s, generatedPrompt=%r",
        temp_prompt.id,
        prompt_text[:300],      # print first 300 chars (avoid huge logs)
    )

    # save it
    db.collection("users").document(uid) \
      .collection("prompts").document(temp_prompt.id) \
      .set(temp_prompt.dict())

    return temp_prompt

@router.post("/prompts/{prompt_id}/action/{action_type}")
def log_action(prompt_id: str, action_type: str,
               uid: str = Depends(get_current_uid)):
    action_id = uuid4().hex
    db.collection("users").document(uid)\
      .collection("prompts").document(prompt_id)\
      .collection("actions").document(action_id).set({
          "id": action_id,
          "promptId": prompt_id,
          "userId": uid,
          "actionType": action_type,
          "timestamp": datetime.utcnow(),
      })
    return {"ok": True}

@router.get("/prompts", response_model=list[Prompt], summary="List all saved prompts")
def list_prompts(uid: str = Depends(get_current_uid)):
    docs = db.collection("users").document(uid).collection("prompts").stream()
    return [Prompt(**doc.to_dict()) for doc in docs]

@router.get("/prompts/{prompt_id}", response_model=Prompt, summary="Get one prompt by ID")
def get_prompt(prompt_id: str, uid: str = Depends(get_current_uid)):
    snap = (
        db.collection("users")
          .document(uid)
          .collection("prompts")
          .document(prompt_id)
          .get()
    )
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return Prompt(**snap.to_dict())