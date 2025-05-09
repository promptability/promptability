# prompt_request.py - Pydantic models for request and response schemas

from typing import Dict, Optional
from pydantic import BaseModel

class PromptRequest(BaseModel):
    text: str
    context: str = ""

class PromptGenerationRequest(BaseModel):
    selectedText: str
    platformId:  str
    formattingOptions: dict[str, bool]  
    roleId:       str | None = ""
    industryId:   str | None = ""
    templateId:   str | None = ""
    pageUrl:      str | None = ""
    pageTitle:    str | None = ""
    subcategoryId:str | None = None
