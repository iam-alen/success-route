"""
Resume Evaluation Module (report sections 6.2.2 / 4.3.3): extracts text from
an uploaded PDF/DOCX resume, then uses lightweight NLP-style keyword
extraction and pattern recognition to produce an ATS compatibility score,
missing keywords, and improvement suggestions.
"""
import io
import re

import pdfplumber
from docx import Document

from .data import CAREERS, find_career

ATS_PROCESS_KEYWORDS = [
    "Agile Methodology", "Unit Testing", "CI/CD", "System Design",
    "Problem Solving", "Cross-functional Collaboration", "Code Review",
    "Scrum", "Stakeholder Management", "Communication",
]

SECTION_HEADERS = ["education", "experience", "work experience", "skills", "projects", "certifications", "summary"]

ACTION_VERBS = [
    "built", "led", "designed", "developed", "implemented", "launched",
    "improved", "reduced", "increased", "automated", "optimized", "managed",
    "created", "delivered", "deployed",
]

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_RE = re.compile(r"(\+?\d[\d\-\s()]{8,}\d)")
NUMBER_NEAR_VERB_RE = re.compile(
    r"\b(" + "|".join(ACTION_VERBS) + r")\b[^.\n]{0,40}?(\d+%?|\$\d+[kKmM]?)", re.IGNORECASE
)
BULLET_RE = re.compile(r"^[\s]*[•\-\*\u2022]", re.MULTILINE)


def extract_text(raw: bytes, filename: str) -> str:
    name = (filename or "").lower()
    try:
        if name.endswith(".pdf"):
            text = []
            with pdfplumber.open(io.BytesIO(raw)) as pdf:
                for page in pdf.pages:
                    text.append(page.extract_text() or "")
            return "\n".join(text)
        if name.endswith(".docx"):
            doc = Document(io.BytesIO(raw))
            return "\n".join(p.text for p in doc.paragraphs)
        # .doc (legacy binary) and anything else: best-effort decode
        return raw.decode("utf-8", errors="ignore")
    except Exception:
        return ""


def _role_skill_pool(target_role: str) -> list[str]:
    career = find_career(target_role) if target_role else None
    if career:
        return career["skills"]
    # No specific role matched: use the union of all known technical skills.
    pool, seen = [], set()
    for c in CAREERS:
        for s in c["skills"]:
            if s.lower() not in seen:
                seen.add(s.lower())
                pool.append(s)
    return pool


def analyze_resume(raw: bytes, filename: str, target_role: str = "") -> dict:
    text = extract_text(raw, filename)
    lower = text.lower()
    word_count = len(re.findall(r"\w+", text))

    skill_pool = _role_skill_pool(target_role)
    matched_skills = [s for s in skill_pool if s.lower() in lower]
    missing_skills = [s for s in skill_pool if s.lower() not in lower]

    missing_keywords = [k for k in ATS_PROCESS_KEYWORDS if k.lower() not in lower][:6]

    # --- sub-scores -------------------------------------------------------
    keyword_score = round(100 * len(matched_skills) / len(skill_pool)) if skill_pool else 50
    keyword_score = max(10, min(100, keyword_score))

    headers_found = sum(1 for h in SECTION_HEADERS if h in lower)
    has_bullets = bool(BULLET_RE.search(text))
    formatting_score = 40 + headers_found * 10 + (15 if has_bullets else 0)
    formatting_score = max(10, min(100, formatting_score))

    quantified_hits = len(NUMBER_NEAR_VERB_RE.findall(text))
    verb_hits = sum(1 for v in ACTION_VERBS if v in lower)
    content_score = 35 + min(quantified_hits, 5) * 8 + min(verb_hits, 6) * 4
    content_score = max(10, min(100, content_score))

    has_email = bool(EMAIL_RE.search(text))
    has_phone = bool(PHONE_RE.search(text))
    length_ok = 150 <= word_count <= 1200
    structure_score = 30 + (20 if has_email else 0) + (15 if has_phone else 0) + (20 if length_ok else 0) + min(headers_found, 4) * 4
    structure_score = max(10, min(100, structure_score))

    overall = round(0.35 * keyword_score + 0.2 * formatting_score + 0.25 * content_score + 0.2 * structure_score)

    # --- narrative feedback -------------------------------------------------
    strengths = []
    improve = []

    if quantified_hits >= 2:
        strengths.append("Quantifiable achievements found (numbers paired with action verbs).")
    else:
        improve.append("Add quantifiable results, e.g. \"reduced load time by 30%\".")

    if has_bullets:
        strengths.append("Clean, bullet-driven formatting that's easy for ATS parsers to read.")
    else:
        improve.append("Use bullet points for experience and project descriptions.")

    if headers_found >= 3:
        strengths.append("Standard section headers detected, which helps ATS parsing.")
    else:
        improve.append("Add clear section headers such as Education, Experience and Skills.")

    if not has_email or not has_phone:
        improve.append("Make sure your email and phone number are clearly visible at the top.")

    if len(matched_skills) >= max(1, len(skill_pool) // 3):
        strengths.append(f"Strong keyword overlap with {target_role or 'the target role'} requirements.")
    else:
        improve.append(f"Add more skills and tools relevant to {target_role or 'your target role'}.")

    if not length_ok:
        improve.append("Aim for roughly 1 page (400-800 words) for early/mid-career resumes.")

    tips = [
        f"Mirror the exact wording job postings use for \"{target_role or 'your target role'}\" skills.",
        "Quantify impact wherever possible - users, revenue, time saved, performance gained.",
        "List collaboration tools used day-to-day (e.g. Jira, Slack, Git) to match ATS keyword scans.",
    ]

    return {
        "score": overall,
        "breakdown": [
            {"label": "Keywords", "value": keyword_score},
            {"label": "Formatting", "value": formatting_score},
            {"label": "Content", "value": content_score},
            {"label": "Structure", "value": structure_score},
        ],
        "strengths": strengths[:4] or ["Resume parsed successfully."],
        "improve": improve[:4] or ["Looking solid - minor polish only."],
        "missingKeywords": missing_keywords,
        "suggestedSkills": missing_skills[:8],
        "tips": tips,
    }
