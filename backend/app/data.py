"""
Reference "database" of job roles, required skills and reverse-roadmap stages.
Mirrors frontend/src/data/careers.js so the UI looks identical whether the
backend is running or not. In a production system this would live in a real
database (MongoDB, as the report proposes) instead of a Python module.
"""

def _course(name, provider, meta):
    return {"name": name, "provider": provider, "meta": meta}


def _cert(name, issuer, meta):
    return {"name": name, "issuer": issuer, "meta": meta}


def _stage(title, duration, description, courses, certs, skills, milestones):
    return {
        "title": title,
        "duration": duration,
        "description": description,
        "courses": courses,
        "certs": certs,
        "skills": skills,
        "milestones": milestones,
    }


CAREERS = [
    {
        "id": "ml-engineer",
        "title": "Machine Learning Engineer",
        "category": "Technology / Artificial Intelligence",
        "keywords": ["machine learning", "ml engineer", "ai engineer", "data scientist", "deep learning"],
        "description": "Designs, builds and deploys AI/ML models and systems to solve problems and automate decision-making at scale.",
        "demand": "Demand: Very High",
        "duration": "10-16 Months",
        "salary": {"entry": "$80,000 - $120,000", "mid": "$130,000 - $175,000", "senior": "$180,000 - $250,000"},
        "skills": ["Python", "Scikit-learn", "TensorFlow", "PyTorch", "SQL", "Docker", "MLOps", "Statistics"],
        "stages": [
            _stage(
                "Mathematical Foundations & Python Mastery", "2-3 Months",
                "Build the linear algebra, statistics and Python skills every ML model depends on.",
                [_course("Mathematics for Machine Learning", "Coursera", "Imperial College London, 3 courses"),
                 _course("Python for Data Science and ML Bootcamp", "Udemy", "Beginner friendly, 25 hours")],
                [_cert("PCEP - Certified Entry-Level Python Programmer", "Python Institute", "1 month, low cost")],
                ["Python", "NumPy", "Pandas", "Linear Algebra", "Probability", "Statistics"],
                ["Build a data analysis project using Pandas", "Implement linear regression from scratch in Python"],
            ),
            _stage(
                "Core Machine Learning & Scikit-learn", "3 Months",
                "Learn supervised and unsupervised learning, model evaluation and feature engineering.",
                [_course("Machine Learning Specialization", "Coursera", "Andrew Ng, 3 courses"),
                 _course("Hands-On Machine Learning with Scikit-Learn", "Book + code labs", "Self-paced")],
                [_cert("IBM Machine Learning Professional Certificate", "IBM", "3-4 months")],
                ["Scikit-learn", "Feature Engineering", "Model Evaluation", "XGBoost"],
                ["Train and tune a classifier on a Kaggle dataset", "Publish a notebook with clear evaluation metrics"],
            ),
            _stage(
                "Deep Learning & Neural Networks", "4 Months",
                "Go deep with CNNs, RNNs and transformers using PyTorch or TensorFlow.",
                [_course("Deep Learning Specialization", "Coursera", "DeepLearning.AI, 5 courses"),
                 _course("Practical Deep Learning for Coders", "fast.ai", "Free, project driven")],
                [_cert("TensorFlow Developer Certificate", "Google", "2-3 months prep")],
                ["PyTorch", "TensorFlow", "CNNs", "Transformers"],
                ["Build an image classifier", "Fine-tune a pretrained language model"],
            ),
            _stage(
                "MLOps & Cloud Deployment", "4+ Months",
                "Ship models to production with APIs, containers, CI/CD and monitoring.",
                [_course("MLOps Specialization", "Coursera", "DeepLearning.AI"),
                 _course("Docker & Kubernetes: The Practical Guide", "Udemy", "23 hours")],
                [_cert("AWS Certified Machine Learning - Specialty", "Amazon Web Services", "3 months prep")],
                ["FastAPI", "Docker", "CI/CD", "AWS / GCP", "Model Monitoring"],
                ["Deploy a model behind a REST API", "Automate training and deployment with a pipeline"],
            ),
        ],
    },
    {
        "id": "fullstack",
        "title": "Full-Stack Developer",
        "category": "Technology / Web Engineering",
        "keywords": ["full stack", "full-stack", "web developer", "software engineer", "frontend", "backend", "react developer"],
        "description": "Builds end-to-end web applications, from responsive React interfaces to secure REST APIs and databases.",
        "demand": "Demand: Very High",
        "duration": "8-12 Months",
        "salary": {"entry": "$65,000 - $95,000", "mid": "$100,000 - $145,000", "senior": "$150,000 - $210,000"},
        "skills": ["JavaScript", "React", "Node.js", "SQL", "REST APIs", "Git", "TypeScript", "Docker"],
        "stages": [
            _stage(
                "Web Foundations", "2 Months",
                "HTML, CSS and modern JavaScript, plus Git-based workflows.",
                [_course("The Odin Project: Foundations", "The Odin Project", "Free, project based"),
                 _course("JavaScript: Understanding the Weird Parts", "Udemy", "12 hours")],
                [_cert("Responsive Web Design", "freeCodeCamp", "Free, 300 hours")],
                ["HTML5", "CSS3", "JavaScript ES6+", "Git"],
                ["Ship a responsive portfolio site", "Build a small app using a public API"],
            ),
            _stage(
                "Frontend with React", "3 Months",
                "Component architecture, state management, routing and styling systems.",
                [_course("React - The Complete Guide", "Udemy", "68 hours"),
                 _course("Tailwind CSS from Scratch", "Scrimba", "6 hours")],
                [_cert("Meta Front-End Developer Certificate", "Meta / Coursera", "7 months at a light pace")],
                ["React", "React Router", "Tailwind CSS", "TypeScript"],
                ["Build a multi-page React app with routing", "Add form validation and accessible UI"],
            ),
            _stage(
                "Backend, APIs & Databases", "3 Months",
                "Design REST APIs, authenticate users and model relational data.",
                [_course("Node.js, Express & MongoDB Bootcamp", "Udemy", "42 hours"),
                 _course("SQL for Data Analysis", "Udacity", "Free")],
                [_cert("MongoDB Associate Developer", "MongoDB", "1-2 months prep")],
                ["Node.js", "Express", "SQL", "JWT Auth", "REST APIs"],
                ["Build a CRUD API with authentication", "Connect it to your React frontend"],
            ),
            _stage(
                "Deployment & System Design", "2+ Months",
                "Containerise, deploy and scale applications with confidence.",
                [_course("Docker for Developers", "Pluralsight", "8 hours"),
                 _course("Grokking the System Design Interview", "Educative", "Self-paced")],
                [_cert("AWS Certified Cloud Practitioner", "Amazon Web Services", "1-2 months prep")],
                ["Docker", "CI/CD", "Cloud Hosting", "System Design"],
                ["Deploy a full-stack app with CI/CD", "Write an architecture document for it"],
            ),
        ],
    },
    {
        "id": "data-analyst",
        "title": "Data Analyst",
        "category": "Technology / Data",
        "keywords": ["data analyst", "business analyst", "analytics", "bi analyst", "data analysis"],
        "description": "Turns raw data into insight using SQL, spreadsheets and dashboards that guide business decisions.",
        "demand": "Demand: High",
        "duration": "6-9 Months",
        "salary": {"entry": "$55,000 - $80,000", "mid": "$80,000 - $110,000", "senior": "$110,000 - $150,000"},
        "skills": ["SQL", "Excel", "Python", "Tableau", "Power BI", "Statistics", "Data Analysis", "Pandas"],
        "stages": [
            _stage(
                "Spreadsheets & SQL", "2 Months",
                "Clean, query and summarise data using Excel and SQL.",
                [_course("Google Data Analytics Certificate", "Coursera", "Beginner, 6 months at light pace"),
                 _course("SQL for Data Science", "Coursera", "UC Davis")],
                [_cert("Microsoft Excel Associate (MO-200)", "Microsoft", "1 month prep")],
                ["Excel", "SQL", "Data Cleaning"],
                ["Analyse a public dataset in SQL", "Build a pivot-table report"],
            ),
            _stage(
                "Python for Analysis", "2 Months",
                "Automate analysis with Pandas and visualise with Matplotlib.",
                [_course("Data Analysis with Python", "freeCodeCamp", "Free"),
                 _course("Python for Data Analysis", "Book", "Wes McKinney")],
                [_cert("IBM Data Analyst Professional Certificate", "IBM", "4 months")],
                ["Python", "Pandas", "Matplotlib", "Statistics"],
                ["Write a reusable cleaning script", "Publish an exploratory analysis notebook"],
            ),
            _stage(
                "Visualisation & BI", "2 Months",
                "Tell clear stories with interactive dashboards.",
                [_course("Tableau A-Z", "Udemy", "9 hours"),
                 _course("Microsoft Power BI Desktop", "Udemy", "15 hours")],
                [_cert("Microsoft Power BI Data Analyst (PL-300)", "Microsoft", "2 months prep")],
                ["Tableau", "Power BI", "Dashboard Design"],
                ["Build an executive dashboard", "Present findings to a non-technical audience"],
            ),
            _stage(
                "Portfolio & Job Readiness", "1-2 Months",
                "Assemble case studies and practise interview scenarios.",
                [_course("Case Study Interview Prep", "DataLemur", "Self-paced"),
                 _course("Storytelling with Data", "Book", "Cole Nussbaumer Knaflic")],
                [_cert("Tableau Desktop Specialist", "Salesforce", "1 month prep")],
                ["Storytelling", "Communication", "A/B Testing"],
                ["Publish three portfolio case studies", "Complete two mock interviews"],
            ),
        ],
    },
]


def find_career(query: str):
    q = (query or "").strip().lower()
    if not q:
        return None
    for c in CAREERS:
        if c["title"].lower() == q:
            return c
    for c in CAREERS:
        if c["title"].lower() in q or q in c["title"].lower():
            return c
    for c in CAREERS:
        if any(k in q or q in k for k in c["keywords"]):
            return c
    return None


def build_generic_career(role: str):
    title = (role or "").strip() or "Your Target Role"
    return {
        "id": "custom",
        "title": title,
        "category": "Custom role (AI generated)",
        "description": f"A generated reverse roadmap for {title}, built by working backward from the role's typical requirements.",
        "demand": "Demand: Varies",
        "duration": "8-12 Months",
        "salary": {"entry": "Varies", "mid": "Varies", "senior": "Varies"},
        "skills": [],
        "stages": [
            _stage("Core Foundations", "2-3 Months", f"Learn the fundamental concepts every {title} relies on.",
                   [_course(f"Introduction to {title}", "Coursera / edX", "Search current offerings")], [],
                   ["Fundamentals", "Tools of the trade"], ["Complete an introductory project"]),
            _stage("Essential Technical Skills", "3 Months", "Develop the hands-on skills listed in current job postings.",
                   [_course(f"{title} Skills Path", "LinkedIn Learning / Udemy", "Search current offerings")], [],
                   ["Role-specific tools", "Problem solving"], ["Build two practical projects"]),
            _stage("Applied Experience", "3 Months", "Gain proof of work through projects, internships or freelance tasks.",
                   [], [], ["Portfolio", "Collaboration"], ["Publish a portfolio piece", "Get feedback from a practitioner"]),
            _stage("Job Readiness", "1-2 Months", "Optimise your resume for ATS and rehearse interviews.",
                   [], [], ["Resume", "Interviewing"], ["Score 80%+ in the Resume Analyzer"]),
        ],
    }
