# InternAI – AI Internship Recommendation Platform 

[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61dafb.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Firebase-orange.svg)]()
[![Language](https://img.shields.io/badge/Language-TypeScript-blue.svg)]()
[![UI](https://img.shields.io/badge/UI-TailwindCSS-38bdf8.svg)]()
[![AI](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-purple.svg)]()

An AI-powered internship discovery and career intelligence platform designed to help students find the most relevant internship opportunities based on their **skills, interests, and career goals**.

InternAI replaces the traditional internship search process with an **intelligent recommendation engine that provides personalized opportunities, skill insights, and career guidance.**

---

## Features

###  AI Internship Recommendation Engine
- Personalized internship matching based on student profiles
- Multi-factor analysis including **skills, interests, and location preferences**
- Returns **top 3–5 relevant internship opportunities**
- Provides clear explanations for why each internship was recommended

---

###  Resume Parsing & Skill Extraction
- Upload resumes in **PDF or DOCX**
- Automatically extracts:
  - Skills
  - Education
  - Certifications
  - Projects
- Generates a student profile instantly without manual input

---

###  Skill Gap Analysis
- Compares student profiles with internship requirements
- Identifies missing skills required for desired roles
- Provides recommendations on **what skills to learn next**

---

### Internship Readiness Score
- Calculates a readiness score based on:
  - Skills
  - Projects
  - Certifications
  - Education relevance
- Helps students understand their **preparedness for internships**

---

###  Career Path Prediction
- Suggests possible career paths based on detected skills

**Example:**

`Python + SQL` →
- Data Analyst
- Machine Learning Engineer
- Data Scientist

---

###  Internship Scam Detection
- Identifies suspicious internship listings
- Flags:
  - Unrealistic stipends
  - Missing company details
  - Suspicious application links

Protects students from fraudulent opportunities.

---

###  AI Career Assistant
- Interactive chatbot powered by **Google Gemini 2.0 Flash**
- Students can ask:
  - Which internships suit me?
  - What skills should I learn next?
  - How can I improve my resume?

---

###  Personalized Dashboard
Students can view:
- Internship recommendations
- Skill gap insights
- Career readiness score
- Saved internships
- Profile analytics

---

## AI Matching Logic

| Component | Method | Purpose |
|-----------|--------|---------|
| Skill Matching | Weighted Matching | Identify compatibility with internships |
| Domain Matching | Interest Mapping | Align career interests |
| Location Preference | Filtering | Match preferred location |
| Ranking Algorithm | Score-based Ranking | Recommend top internships |

### Scoring Formula

```
Skill Match    +5
Domain Match   +3
Location Match +2
Experience Match +2
```

---

## System Architecture

```
User
│
▼
Student Profile Input
│
▼
Resume Parsing Engine
│
▼
Skill Extraction
│
▼
Recommendation Engine
│
├── Internship Database
│
▼
Top Internship Matches
│
▼
Skill Gap Analysis
│
▼
Career Intelligence Dashboard
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Vite + TypeScript | Fast SPA interface |
| UI Framework | Tailwind CSS | Responsive UI |
| Backend / Auth | Firebase | Authentication & Firestore database |
| AI / Chatbot | Google Gemini 2.0 Flash (upgraded) | AI career assistant & recommendations |
| Internship Data | Adzuna API | Live internship listings |
| UI Design | Google Stitch AI | Modern SaaS interface |

---

## UI & Design

- Modern SaaS-style interface
- Smooth animations and micro-interactions
- Clean AI dashboard layout
- Mobile-first responsive design
- Accessible UI for students with limited digital exposure

---

## Project Structure

```
InternAI/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level page components
│   ├── lib/              # Firebase, Gemini, Adzuna API clients
│   ├── context/          # App state & language context
│   ├── hooks/            # Custom React hooks
│   └── locales/          # i18n translation files (EN, HI, TE)
│
├── public/               # Static assets & favicon
├── firebase.json         # Firebase Hosting config
├── .firebaserc           # Firebase project config
├── package.json
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js v18+
- npm

---

### Install Dependencies

```bash
npm install
```

---

### Run Development Server

```bash
npm run dev
```

---

### Build Production Version

```bash
npm run build
```

---

### Deploy to Firebase Hosting

```bash
# Login to Firebase (first time only)
npx firebase login

# Build & deploy
npm run deploy
```

---

## Future Enhancements

- Machine learning recommendation models
- Resume improvement suggestions
- More internship API integrations
- Internship application tracking
- Career path visualization
- Industry skill demand analytics

---

## Security & Performance

- Secure authentication via Firebase (Google Sign-In)
- Optimized internship matching algorithm
- Efficient Firestore database queries
- Scalable architecture for large user bases

---

## Contributing

Contributions, suggestions, and improvements are welcome.

Open an issue or submit a pull request.

---

## License

MIT License

---

## Author

**Gilakathi Siddhartha Goud**  
B.Tech Information Technology

Developer | AI Tools | Data Systems

 GitHub: [github.com/siddharthg-7](https://github.com/siddharthg-7)  
 Email: [siddharthgoudgilakathi@gmail.com](mailto:siddharthgoudgilakathi@gmail.com)
