# """
# main.py

# Main FastAPI application entry point.
# Defines routes and initializes the API server.
# """

# from fastapi import FastAPI
# from dotenv import load_dotenv
# from fastapi.middleware.cors import CORSMiddleware

# # loads .env for OPENAI_API_KEY, etc.
# load_dotenv()                         

# from app.api import user_profile, prompt_routes

# app = FastAPI(title="Promptability API")


# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # For development - restrict this in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(user_profile.router, prefix="/api")
# app.include_router(prompt_routes.router, prefix="/api")

# @app.get("/")
# def root():
#     return {"message": "Promptability backend running"}


"""
main.py ─ Promptability API entry-point
(with structured request/response logging)
"""
from __future__ import annotations

import logging
import time
from typing import Callable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# ──────────────────────────────────────────────────────────────────────────────
#  Logging setup
# ──────────────────────────────────────────────────────────────────────────────
LOG_FORMAT = (
    "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
)  # 2025-05-01 19:08:11,312 | INFO     | api | ...

logging.basicConfig(
    level=logging.INFO,
    format=LOG_FORMAT,
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("api")

# ──────────────────────────────────────────────────────────────────────────────
#  FastAPI app
# ──────────────────────────────────────────────────────────────────────────────
load_dotenv()  # e.g. OPENAI_API_KEY …

app = FastAPI(title="Promptability API")

# ---------- CORS (dev-wide) ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # tighten in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- request/response logger ----------
@app.middleware("http")
async def log_requests(request: Request, call_next: Callable[[Request], Response]):
    start = time.time()
    log.info("↘︎  %s %s", request.method, request.url.path)

    try:
        response: Response = await call_next(request)
    except Exception as exc:
        # still measure timing even for unhandled exceptions
        duration = (time.time() - start) * 1000
        log.exception("‼️  %s %s -> EXCEPTION after %.1f ms", request.method,
                      request.url.path, duration)
        raise exc

    duration = (time.time() - start) * 1000
    log.info("↗︎  %s %s -> %s (%.1f ms)",
             request.method, request.url.path, response.status_code, duration)
    return response

# ──────────────────────────────────────────────────────────────────────────────
#  Routers
# ──────────────────────────────────────────────────────────────────────────────
from app.api import user_profile, prompt_routes  # noqa: E402

app.include_router(user_profile.router, prefix="/api", tags=["user"])
app.include_router(prompt_routes.router, prefix="/api", tags=["prompt"])

# ---------- health ----------
@app.get("/", tags=["meta"])
def root():
    return {"message": "Promptability backend running"}
