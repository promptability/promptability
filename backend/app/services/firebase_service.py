"""
Centralised Firebase Admin initialisation + helpers
"""
import os
import firebase_admin
from firebase_admin import credentials, firestore, auth

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/app/.. → backend/

# 1️⃣ initialise only once
if not firebase_admin._apps:
    cred_path = os.path.join(BASE_DIR, "firebase-admin-key.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# 2️⃣ user profile helpers -----------------------------------------------------
def create_or_update_user_profile(uid: str, data: dict) -> None:
    doc_ref = (
        db.collection("users")
        .document(uid)
        .collection("profile")
        .document("info")
    )
    doc_ref.set(data, merge=True)

def get_user_profile(uid: str) -> dict | None:
    snap = (
        db.collection("users")
        .document(uid)
        .collection("profile")
        .document("info")
        .get()
    )
    return snap.to_dict() if snap.exists else None

# 3️⃣ auth token verification --------------------------------------------------
def verify_firebase_token(id_token: str) -> str:
    """
    Returns the authenticated user's UID or raises ValueError.
    """
    try:
        decoded = auth.verify_id_token(id_token, check_revoked=True)
        return decoded["uid"]
    except Exception as exc:  # pylint: disable=broad-except
        raise ValueError("Invalid or expired Firebase token") from exc
