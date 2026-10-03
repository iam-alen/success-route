# Success Route — Frontend

A reverse-methodology career guidance system: pick a target job, get a
step-by-step roadmap back to where you are now, get AI-style career
recommendations, and score your resume against ATS keywords.

Rebuilt from scratch to match the project report (Chapters 6 & 8) and to
run with **zero setup errors** — it works fully standalone with built-in
demo data, and will automatically switch to a real backend if one is
running at `http://127.0.0.1:8000`.

## 1. Install

```bash
cd frontend
npm install
```

## 2. Run

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## 3. Build for production

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

## Connecting a real backend (optional)

Every AI-ish feature (career recommendations, roadmap generation, resume
scoring) first tries `POST /api/...`, which Vite proxies to
`http://127.0.0.1:8000` in development (see `vite.config.js`). If that
request fails or times out, the page falls back to realistic built-in
demo data — so the UI is always usable, backend or not.

To point at a deployed backend instead of localhost, create a `.env`
file:

```
VITE_API_URL=https://your-api.example.com/api
```

## Folder structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # app bootstrap: router + auth provider
    ├── App.jsx                # route table (public + protected)
    ├── index.css              # Tailwind v4 import + design tokens
    ├── context/
    │   └── AuthContext.jsx    # sign up / sign in / guest mode (localStorage)
    ├── lib/
    │   └── api.js             # fetch wrapper with graceful fallback
    ├── data/
    │   └── careers.js         # demo career dataset + recommendation logic
    ├── components/
    │   ├── ui.jsx             # Logo, Chip, ProgressBar, PageHeader
    │   ├── Navbar.jsx
    │   ├── Layout.jsx         # navbar + page container + footer
    │   └── RequireAuth.jsx    # route guard
    └── pages/
        ├── LandingPage.jsx
        ├── SignIn.jsx
        ├── SignUp.jsx
        ├── HomePage.jsx           # dashboard
        ├── CareerAdvice.jsx       # "AI Career Recommendations"
        ├── RoadmapGenerator.jsx   # "Career Roadmap Generator"
        ├── ResumeAnalyzer.jsx     # ATS score, tabs: Score/Improve/Keywords/Optimized
        └── Profile.jsx
```

## Notes

- Auth is a lightweight **local-only** demo (accounts stored in
  `localStorage`) so the app is usable without a backend. Swap
  `AuthContext.jsx` for real API calls when your backend is ready.
- Tailwind v4 is wired via `@tailwindcss/vite` — no `postcss.config.js`
  or `tailwind.config.js` needed.
- Every page is fully responsive and keyboard/focus accessible.
