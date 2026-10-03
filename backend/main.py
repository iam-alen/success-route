"""
Success Route backend - FastAPI application.

Implements the three AI-ish modules described in the project report:
  - Career Recommendation / Skill Mapping Module -> POST /api/recommendations
  - Roadmap Generator Module                     -> POST /api/roadmap
  - Resume Evaluation Module                     -> POST /api/resume/analyze

Run with:  uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.data import build_generic_career, find_career
from app.recommend import recommend
from app.resume import analyze_resume
from app.schemas import RecommendationRequest, RoadmapRequest

app = FastAPI(title="Success Route API", version="1.0.0")

# The Vite dev server runs on 5173; a production build might be served from
# elsewhere, so allow it to be added to this list as needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/recommendations")
def api_recommendations(payload: RecommendationRequest):
    """Career Recommendation + Skill Mapping modules (report 6.2.1 / 6.2.3)."""
    return {"results": recommend(payload.skills)}


@app.post("/api/roadmap")
def api_roadmap(payload: RoadmapRequest):
    """Roadmap Generator Module (report 6.2.4): reverse-methodology path for a target role."""
    career = find_career(payload.role) or build_generic_career(payload.role)
    return {"career": career}


@app.post("/api/resume/analyze")
async def api_resume_analyze(file: UploadFile = File(...), target_role: str = Form("")):
    """Resume Evaluation Module (report 6.2.2): ATS score + keyword suggestions."""
    raw = await file.read()
    return analyze_resume(raw, file.filename, target_role)
