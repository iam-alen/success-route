"""
Skill Mapping Module (report section 6.2.3): maps a user's current skills
against each role's required skills, scores the overlap, and returns the
matched vs. missing skills used for skill-gap analysis.
"""
from .data import CAREERS


def recommend(user_skills: list[str]):
    owned = {s.strip().lower() for s in user_skills if s and s.strip()}

    results = []
    for career in CAREERS:
        required = career["skills"]
        have = [s for s in required if s.lower() in owned]
        missing = [s for s in required if s.lower() not in owned]

        # Base score rewards overlap with required skills (career matching + skill gap analysis).
        overlap_ratio = len(have) / len(required) if required else 0
        score = min(97, round(35 + overlap_ratio * 62))

        results.append({
            "career": {
                "id": career["id"],
                "title": career["title"],
                "category": career["category"],
                "description": career["description"],
            },
            "score": score,
            "have": have,
            "missing": missing[:4],
        })

    results.sort(key=lambda r: r["score"], reverse=True)
    return results
