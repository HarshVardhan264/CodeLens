# 🐍 CodeLens — AI Backend

> The Python-based AI engine powering CodeLens's autonomous multi-agent code review system.

The CodeLens backend analyzes source-code chunks and uses specialized AI agents to detect **bugs, security vulnerabilities, and code-quality issues**. The agents are orchestrated using **LangGraph** and their findings are combined into a structured review report.

---

## ✨ Features

* 🤖 **Multi-Agent Code Review** — Specialized agents analyze code from different perspectives
* 🐞 **Bug Detection** — Identifies logical errors, runtime problems, and edge cases
* 🔐 **Security Analysis** — Detects vulnerabilities and unsafe coding practices
* ✨ **Code Quality Analysis** — Evaluates readability, maintainability, and structure
* 🧠 **Final AI Analysis** — Combines findings from all specialized agents
* 🔄 **LangGraph Orchestration** — Manages the AI review workflow
* 📦 **Structured Output** — Returns consistent review results for the application backend
* ⚡ **FastAPI Service** — Provides an API interface for communication with the Node.js backend

---

## 🛠️ Tech Stack

| Technology        | Purpose             |
| ----------------- | ------------------- |
| **Python**        | AI backend          |
| **FastAPI**       | API server          |
| **LangChain**     | LLM framework       |
| **LangGraph**     | Agent orchestration |
| **Google Gemini** | AI model            |
| **Pydantic**      | Data validation     |

---

## 📁 Project Structure

```text
backend/
│
├── agents/
│   ├── bug_agent.py
│   ├── security_agent.py
│   ├── quality_agent.py
│   └── final_agent.py
│
├── graph/
│   └── review_graph.py
│
├── main.py
├── requirements.txt
└── README.md
```

---

## 🤖 Multi-Agent Architecture

CodeLens divides code review into specialized AI agents.

```text
                 Code Chunks
                      │
                      ▼
              ┌───────────────┐
              │   LangGraph   │
              │ Review Graph  │
              └───────┬───────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
      🐞 Bug      🔐 Security   ✨ Quality
       Agent        Agent        Agent
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

* Logical errors
* Incorrect conditions
* Runtime problems
* Incorrect state handling
* Edge cases
* Potential crashes
* Incorrect calculations

---

## 🔐 Security Agent

The Security Agent focuses on identifying security risks.

It analyzes code for:

* Authentication issues
* Authorization problems
* Unsafe input handling
* Hardcoded secrets
* Injection vulnerabilities
* Insecure API usage
* Sensitive information exposure

---

## ✨ Quality Agent

The Quality Agent evaluates code maintainability and readability.

It analyzes:

* Naming
* Duplicate code
* Complex functions
* Code structure
* Maintainability
* Readability
* Unnecessary complexity

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

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd CodeLens/backend
```

### 2. Create a virtual environment

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

#### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Add the required AI service credentials to your environment.

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

CodeLens consists of multiple services.

### Frontend

```bash
cd frontend
npm run dev
```

### Node.js Backend

```bash
cd auth
npm run dev
```

### Python AI Backend

```bash
cd backend
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

## 🔑 Environment Variables

AI-related credentials should be stored securely in environment variables.

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
