"""
FastAPI dependency that checks the 'Authorization: Bearer <idToken>' header.
"""
from fastapi import Depends, Header, HTTPException, status
from app.services.firebase_service import verify_firebase_token

def get_current_uid(authorization: str = Header(...)) -> str:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid auth header")
    try:
        return verify_firebase_token(token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Token verification failed")
