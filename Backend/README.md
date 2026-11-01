# 🐍 CodeLens — AI Backend

> The Python-based AI engine powering CodeLens's autonomous multi-agent code review system.

The CodeLens backend analyzes source-code chunks and uses specialized AI agents to detect **bugs, security vulnerabilities, and code-quality issues**. The agents are orchestrated using **LangGraph**, and their findings are combined into a structured review report.

---

## ✨ Features

- 🤖 **Multi-Agent Code Review** — Specialized agents analyze code from different perspectives
- 🐞 **Bug Detection** — Identifies logical errors, runtime problems, and edge cases
- 🔐 **Security Analysis** — Detects vulnerabilities and unsafe coding practices
- ✨ **Code Quality Analysis** — Evaluates readability, maintainability, and structure
- 🧠 **Final AI Analysis** — Combines findings from all specialized agents
- 🔄 **LangGraph Orchestration** — Manages the AI review workflow
- 📦 **Structured Output** — Returns consistent review results for the application backend
- ⚡ **FastAPI Service** — Provides an API interface for communication with the Node.js backend
- 🎯 **Issue Prioritization** — Selects and prioritizes critical findings for further processing
- 🧪 **Offline Tests** — Tests core backend logic without making live Gemini API calls

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Python** | AI backend |
| **FastAPI** | API server |
| **LangChain** | LLM integration and framework |
| **LangGraph** | Agent orchestration |
| **Google Gemini** | AI model |
| **Pydantic** | Data validation |
| **Pytest** | Automated testing |
| **Uvicorn** | ASGI server |

---

## 📁 Project Structure

```text
Backend/
│
├── agents/
│   ├── bug_agent.py
│   ├── security_agent.py
│   ├── quality_agent.py
│   └── final_agent.py
│
├── graph/
│   ├── review_graph.py
│   └── prioritizer.py
│
├── tests/
│   └── test_prioritizer.py
│
├── main.py
├── requirements.txt
├── requirements-dev.txt
├── pyproject.toml
├── Dockerfile
├── .dockerignore
└── README.md
```

---

## 🤖 Multi-Agent Architecture

CodeLens divides code review into specialized AI agents.

```text
                 Code Chunks
                      │
                      ▼
             ┌────────────────┐
             │   LangGraph    │
             │  Review Graph  │
             └───────┬────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
      🐞 Bug     🔐 Security  ✨ Quality
       Agent       Agent       Agent
         │           │           │
         └───────────┼───────────┘
                     ▼
               🧠 Final Agent
                     │
                     ▼
              Structured Report
```

---

## 🐞 Bug Agent

The Bug Agent focuses on functional correctness.

It analyzes code for:

- Logical errors
- Incorrect conditions
- Runtime problems
- Incorrect state handling
- Edge cases
- Potential crashes
- Incorrect calculations

---

## 🔐 Security Agent

The Security Agent focuses on identifying security risks.

It analyzes code for:

- Authentication issues
- Authorization problems
- Unsafe input handling
- Hardcoded secrets
- Injection vulnerabilities
- Insecure API usage
- Sensitive information exposure

---

## ✨ Quality Agent

The Quality Agent evaluates code maintainability and readability.

It analyzes:

- Naming
- Duplicate code
- Complex functions
- Code structure
- Maintainability
- Readability
- Unnecessary complexity

---

## 🧠 Final Agent

The Final Agent receives the findings from the specialized agents and combines them into a single structured report.

A review can contain:

```json
{
  "score": 75,
  "summary": "The repository is generally healthy but contains several issues.",
  "issueCounts": {
    "critical": 0,
    "high": 1,
    "medium": 3,
    "low": 2
  },
  "issues": [
    {
      "file": "src/example.py",
      "line": 10,
      "category": "Bug",
      "severity": "High",
      "title": "Potential runtime error",
      "description": "The code may access an invalid index.",
      "suggestedFix": "Validate the index before accessing the array."
    }
  ],
  "recommendations": [
    "Improve input validation",
    "Add edge-case tests"
  ]
}
```

---

## 🔄 Review Pipeline

The AI backend receives code chunks from the Node.js application backend.

```text
Repository
    │
    ▼
Node.js Backend
    │
    ▼
Code Chunks
    │
    ▼
Python / FastAPI
    │
    ▼
LangGraph
    │
    ├── Bug Agent
    │
    ├── Security Agent
    │
    └── Quality Agent
            │
            ▼
        Final Agent
            │
            ▼
      Structured Report
```

---

## 🎯 Issue Prioritization

The backend includes a prioritization function for selecting critical findings from the generated review report.

The prioritization logic:

- Filters issues based on critical severity.
- Sorts selected issues by priority score in descending order.
- Limits the selected results to a maximum of four critical issues.
- Handles invalid report structures safely.

This logic is covered by offline unit tests and does not require a live Gemini API request.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd CodeLens/Backend
```

### 2. Create a virtual environment

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

Install the production dependencies:

```bash
pip install -r requirements.txt
```

For development and testing, install the development dependencies:

```bash
pip install -r requirements-dev.txt
```

### 4. Configure environment variables

Add the required AI service credentials to your environment.

Create a `.env` file in the `Backend` directory:

```env
GOOGLE_API_KEY=your_api_key
```

Keep API keys and other secrets outside the source code.

### 5. Start the FastAPI server

```bash
uvicorn main:app --reload --port 8000
```

The backend will run at:

```text
http://127.0.0.1:8000
```

---

## 🧪 Testing

CodeLens includes offline tests for core backend logic.

Run the test suite from the `Backend` directory:

```bash
python -m pytest tests/ -v
```

The tests cover:

- Filtering critical issues
- Sorting issues by priority score
- Limiting selected issues to four
- Handling invalid report input
- Handling invalid issue collections

These tests do not make live Gemini API calls. They validate the tested application logic, not the quality or availability of the external AI model.

---

## 🐳 Docker

The AI backend is containerized using Docker.

The backend Dockerfile:

- Uses Python 3.13 slim as the base image.
- Installs dependencies from `requirements.txt`.
- Starts the FastAPI application using Uvicorn.
- Listens on `0.0.0.0` so the service can receive requests from outside the container.

Build the image from the project root:

```bash
docker build -t codelens-ai-backend ./Backend
```

Run the container:

```bash
docker run -p 8000:8000 \
  -e GOOGLE_API_KEY=your_api_key \
  codelens-ai-backend
```

The API will be available at:

```text
http://localhost:8000
```

The development-only dependencies in `requirements-dev.txt` are not installed in the production Docker image.

---

## 🔌 API Integration

The Python backend communicates with the CodeLens Node.js application backend.

```text
React Frontend
      │
      ▼
Node.js / Express
      │
      ▼
Python / FastAPI
      │
      ▼
LangGraph AI System
```

The Node.js backend handles repository processing and sends relevant code chunks to the AI backend.

The Python backend focuses on **AI-powered analysis and report generation**.

---

## 📊 Review Output

The AI system generates a structured report containing:

### Code Health Score

```text
87 / 100
```

### Issue Severity

```text
Critical
High
Medium
Low
```

### Issue Details

Each identified issue can contain:

```text
File
Line
Category
Severity
Title
Description
Suggested Fix
```

### Recommendations

The system also generates recommendations to help developers improve their codebase.

---

## ⚙️ Running the Complete CodeLens System

CodeLens consists of three main services.

### Frontend

```bash
cd Frontend
npm run dev
```

### Node.js Backend

```bash
cd Auth
npm install
npm start
```

### Python AI Backend

```bash
cd Backend
uvicorn main:app --reload --port 8000
```

Complete flow:

```text
Frontend
   │
   ▼
Node.js / Express
   │
   ▼
Python / FastAPI
   │
   ▼
LangGraph
   │
   ▼
AI Review Agents
   │
   ▼
Final Report
```

---

## ⚙️ CI/CD

CodeLens uses **GitHub Actions** for continuous integration.

The workflow is located at:

```text
.github/workflows/codelens-ci.yml
```

### AI Backend CI Checks

| Check | Purpose |
|---|---|
| Dependency Installation | Installs development dependencies from `requirements-dev.txt` |
| Python Compilation | Checks Python files using `compileall` |
| Automated Tests | Runs offline pytest tests |

The AI backend CI job validates application code without requiring live Gemini API requests.

The workflow also builds Docker images for the Auth, AI Backend, and Frontend services.

### Deployment

The AI backend is deployed on Render.

**Live API:** https://codelens-ai-backend-5jh1.onrender.com

Render uses the `Backend` directory as its root directory.

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

The `GOOGLE_API_KEY` is configured as a Render environment variable and should never be committed to GitHub.

The Render service is configured to deploy after CI checks pass.

---

## 🔑 Environment Variables

AI-related credentials should be stored securely in environment variables.

| Variable | Purpose |
|---|---|
| `GOOGLE_API_KEY` | Authenticates requests to the Google Gemini API |

Example:

```env
GOOGLE_API_KEY=your_api_key
```

> Never commit API keys, tokens, passwords, or other secrets to GitHub.

---

## 🎯 Purpose

The CodeLens AI backend is designed around three stages:

```text
UNDERSTAND
     ↓
DETECT
     ↓
IMPROVE
```

It doesn't simply identify problematic code. The goal is to provide developers with **structured findings and actionable recommendations** that help them understand and improve their code.