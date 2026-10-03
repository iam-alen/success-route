from typing import List, Optional
from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    skills: List[str] = []


class RoadmapRequest(BaseModel):
    role: str


class ResumeAnalysisResponse(BaseModel):
    score: int
    breakdown: List[dict]
    strengths: List[str]
    improve: List[str]
    missingKeywords: List[str]
    suggestedSkills: List[str]
    tips: List[str]
