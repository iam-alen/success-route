# Success Route — Backend (FastAPI)

Implements the three AI/NLP modules described in the project report:

| Report module | Endpoint | What it does |
|---|---|---|
| Career Recommendation + Skill Mapping (6.2.1 / 6.2.3) | `POST /api/recommendations` | Scores every role in the database against the skills you send it, returning matched vs. missing skills. |
| Roadmap Generator (6.2.4) | `POST /api/roadmap` | Given a target role, returns the full reverse-methodology path: stages, courses, certifications, milestones, salary bands. Unknown roles still get a generated generic roadmap. |
| Resume Evaluation (6.2.2) | `POST /api/resume/analyze` | Extracts text from an uploaded PDF/DOCX resume and scores it (keywords, formatting, content, structure) using keyword extraction and pattern recognition, à la the report's NLP approach. |

The frontend already calls exactly these three endpoints and falls back to
its own built-in demo data if it can't reach the backend — so running this
backend doesn't change how the site looks, it just makes the results
"real" instead of simulated.

## 1. Install

Requires **Python 3.10+**.

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt
```

## 2. Run

```bash
uvicorn main:app --reload --port 8000
```

You should see:

```
Uvicorn running on http://127.0.0.1:8000
```

Leave this running in its own terminal.

## 3. Run the frontend alongside it

In a **second** terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite's dev server proxies `/api/*` to `http://127.0.0.1:8000` (see
`frontend/vite.config.js`), so as long as both servers are running, the
site's Career Advice, Roadmap and Resume Analyzer pages will use this
backend automatically — no code changes needed.

## Quick manual test

With the server running, visit `http://127.0.0.1:8000/docs` — FastAPI's
auto-generated Swagger UI lets you try every endpoint directly from the
browser without the frontend at all.

```bash
curl http://127.0.0.1:8000/api/health
# {"status":"ok"}

curl -X POST http://127.0.0.1:8000/api/roadmap \
  -H "Content-Type: application/json" \
  -d '{"role": "Machine Learning Engineer"}'
```

## Folder structure

```
backend/
├── requirements.txt
├── main.py              # FastAPI app + the 3 routes
└── app/
    ├── data.py           # career "database" (title, skills, stages, salary)
    ├── schemas.py         # pydantic request models
    ├── recommend.py       # skill-overlap scoring (Skill Mapping Module)
    └── resume.py          # PDF/DOCX text extraction + ATS scoring (Resume Evaluation Module)
```

## Swapping in a real database

Right now `app/data.py` is a plain Python list standing in for the
MongoDB database the report describes (section 4.4). To use a real
database, replace the `CAREERS` list and the `find_career` /
`build_generic_career` functions with queries against your collection —
every route in `main.py` stays the same, since they only call those
functions.
