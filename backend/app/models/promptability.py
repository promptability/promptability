"""
Pydantic models that mirror the TypeScript interfaces.
Only the most immediately-used entities are included;
add the rest as they become needed.
"""
from datetime import datetime
from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field


class Role(BaseModel):
    id: str
    name: str
    description: str
    prefix: str
    emoji: Optional[str] = None
    order: int
    isActive: bool
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class Industry(BaseModel):
    id: str
    name: str
    description: str
    emoji: Optional[str] = None
    order: int
    isActive: bool
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class PromptAction(BaseModel):
    id: str
    promptId: str
    userId: str
    actionType: Literal['copy', 'replace', 'send']
    platformId: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class Prompt(BaseModel):
    id: str
    userId: str
    selectedText: str
    generatedPrompt: str
    roleId: str
    industryId: str
    subcategoryId: Optional[str] = None
    templateId: str
    platformId: str
    platformFormatted: bool = False
    formattingOptions: Dict[str, bool]
    pageUrl: str
    pageTitle: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    favorite: bool = False
    tags: List[str] = []
    usageCount: int = 0
    lastUsedAt: Optional[datetime] = None
    actionHistory: List[PromptAction] = []
