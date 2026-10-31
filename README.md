# CodeLens

### Autonomous AI-Powered Code Review Platform

CodeLens is an AI-powered code intelligence platform that analyzes software repositories and identifies **bugs, security vulnerabilities, and code-quality issues**.

Instead of relying on a single AI reviewer, CodeLens uses multiple specialized AI agents to analyze code from different perspectives and combines their findings into a structured code-review report.

---

## ✨ What is CodeLens?

CodeLens helps developers understand what is wrong with their code, why it matters, and how it can be improved.

A developer can provide a **GitHub repository URL**, and CodeLens:

1. Connects to the GitHub repository.
2. Retrieves the repository files.
3. Filters unnecessary files.
4. Selects the most important source files.
5. Splits large files into manageable code chunks.
6. Sends the code to the AI review system.
7. Runs multiple specialized AI agents.
8. Combines their findings.
9. Generates a structured review report.

### AI Review Agents

| Agent             | Responsibility                                              |
| ----------------- | ----------------------------------------------------------- |
| 🐞 Bug Agent      | Detects logical errors, runtime problems and potential bugs |
| 🔐 Security Agent | Detects security vulnerabilities and unsafe practices       |
| ✨ Quality Agent   | Evaluates readability, maintainability and code quality     |
| 🧠 Final Agent    | Combines all findings into one structured report            |

---

# 🏗️ Project Architecture

CodeLens is divided into three major parts:

```text
                         ┌──────────────────────┐
                         │      CodeLens        │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
          │  Frontend   │    │    Auth     │    │   Backend   │
          │ React       │    │ Node/Express│    │ Python/AI   │
          │ Tailwind    │    │ MongoDB     │    │ LangGraph   │
          └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
                 │                  │                  │
                 │                  │                  │
                 └──────────────────┼──────────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │ GitHub API    │
                            └───────────────┘
```

### Request Flow

```text
User
 │
 ▼
React Frontend
 │
 │ HTTP Request
 ▼
Node.js / Express
 │
 ├── Authentication
 │
 ├── MongoDB
 │
 ├── GitHub Repository
 │
 └── Repository Processing
        │
        ▼
Python AI Backend
        │
        ▼
     LangGraph
        │
   ┌────┼────┐
   ▼    ▼    ▼
 Bug  Security Quality
   │    │    │
   └────┼────┘
        ▼
   Final Agent
        │
        ▼
 Structured Report
        │
        ▼
 React Frontend
```

---

# 📁 Project Structure

```text
CodeLens/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── about/
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Review.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
│
├── auth/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── reviewController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Review.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── reviewRoutes.js
│   │
│   ├── Services/
│   │   ├── codeReviewService.js
│   │   ├── githubService.js
│   │   ├── fileChunker.js
│   │   ├── fileFilter.js
│   │   ├── fileSelector.js
│   │   └── reviewService.js
│   │
│   ├── .env
│   ├── app.js
│   ├── package.json
│   └── README.md
│
│
├── backend/
│   │
│   ├── agents/
│   │   ├── bug_agent.py
│   │   ├── security_agent.py
│   │   ├── quality_agent.py
│   │   └── final_agent.py
│   │
│   ├── graph/
│   │   └── review_graph.py
│   │
│   ├── main.py
│   │
│   ├── requirements.txt
│   └── README.md
│
│
└── README.md
```

> Folder and file names can be adjusted to match the exact implementation.

---

# 🎨 Frontend

The frontend provides the user interface for CodeLens.

### Technologies

* React
* Vite
* Tailwind CSS
* JavaScript
* React Router
* Axios
* GSAP
* GSAP ScrollTrigger
* Motion

### Responsibilities

The frontend handles:

* Landing page
* About page
* Contact page
* Login
* Signup
* Repository review interface
* Review results
* User profile
* Review history
* Usage information
* Upgrade interface
* Animations
* Responsive UI

### Frontend Flow

```text
User
  │
  ▼
React Application
  │
  ├── Login / Signup
  │
  ├── Home
  │
  ├── Repository Review
  │
  └── Review Results
          │
          ▼
      Axios API Request
          │
          ▼
       Auth Server
```

---

# 🔐 Authentication Server

The `auth` folder contains the Node.js/Express backend responsible for authentication and application-level API operations.

### Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Axios
* CORS
* Cookie Parser
* dotenv

### Responsibilities

The authentication server handles:

* User registration
* User login
* JWT authentication
* User sessions
* Protected routes
* MongoDB user data
* Review usage
* Review history
* GitHub repository processing
* Communication with the Python AI backend

---

# 👤 Authentication Flow

### Signup

```text
User
 │
 ▼
Signup Form
 │
 ▼
Express API
 │
 ▼
Validate User
 │
 ▼
Hash Password
 │
 ▼
MongoDB
 │
 ▼
Create Account
```

### Login

```text
User
 │
 ▼
Login Form
 │
 ▼
Express API
 │
 ▼
Find User
 │
 ▼
Verify Password
 │
 ▼
Generate JWT
 │
 ▼
Authenticated User
```

JWT authentication is used to protect review-related operations.

---

# 🗄️ MongoDB

MongoDB stores application data such as:

### User

```text
User
├── name
├── email
├── password
├── plan
├── reviewsUsed
└── reviewHistory
```

### Review

```text
Review
├── user
├── repository
├── score
├── summary
├── issues
├── recommendations
└── createdAt
```

MongoDB allows CodeLens to maintain review history and enforce usage limits from the backend.

---

# 🐍 Python AI Backend

The `backend` folder contains the AI code-review system.

### Technologies

* Python
* FastAPI
* LangChain
* LangGraph
* Google Gemini
* Pydantic

The Python backend receives code chunks from the Node.js server and sends them through the AI review graph.

---

# 🤖 Multi-Agent AI System

CodeLens uses a multi-agent architecture.

```text
                  Code Chunks
                      │
                      ▼
               ┌──────────────┐
               │ LangGraph    │
               │ Review Graph │
               └──────┬───────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
      Bug Agent  Security Agent Quality Agent
          │           │           │
          └───────────┼───────────┘
                      ▼
                Final Agent
                      │
                      ▼
                Final Report
```

---

# 🐞 Bug Agent

The Bug Agent focuses on functional correctness.

It looks for:

* Logical errors
* Incorrect conditions
* Runtime problems
* Incorrect state handling
* Edge cases
* Potential crashes
* Incorrect calculations

Example:

```text
Potential bug detected:
The function accesses an array element without
checking whether the index exists.
```

---

# 🔐 Security Agent

The Security Agent focuses on security vulnerabilities.

It can look for:

* Authentication problems
* Authorization issues
* Unsafe input handling
* Hardcoded secrets
* Injection vulnerabilities
* Insecure API usage
* Sensitive information exposure

---

# ✨ Quality Agent

The Quality Agent evaluates the maintainability of the code.

It looks for:

* Poor naming
* Duplicate code
* Complex functions
* Poor structure
* Maintainability issues
* Readability problems
* Unnecessary complexity

---

# 🧠 Final Agent

The Final Agent combines the output of the three specialized agents.

It produces a structured report containing:

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

# 🔍 Repository Review Pipeline

When a user submits a GitHub repository:

### Step 1 — Repository URL

```text
https://github.com/user/project
```

The frontend sends the repository URL to the Node.js backend.

### Step 2 — GitHub API

The backend retrieves the repository tree using the GitHub API.

### Step 3 — File Filtering

Unnecessary files are removed.

Examples:

```text
node_modules/
.git/
dist/
build/
coverage/
tests/
package-lock.json
```

### Step 4 — File Selection

CodeLens prioritizes important source files such as:

```text
auth
controller
service
route
api
middleware
model
main
app
server
```

### Step 5 — Code Chunking

Large files are divided into smaller chunks.

Each chunk contains:

```json
{
  "filePath": "src/auth/login.js",
  "startLine": 1,
  "endLine": 300,
  "code": "..."
}
```

### Step 6 — AI Review

The chunks are sent to the Python AI backend.

### Step 7 — Multi-Agent Analysis

The code is analyzed by:

```text
Bug Agent
Security Agent
Quality Agent
```

### Step 8 — Final Report

The Final Agent combines the findings.

### Step 9 — Frontend

The structured report is displayed to the user.

---

# 🔄 Complete System Flow

```text
                    USER
                      │
                      ▼
             ┌─────────────────┐
             │ React Frontend  │
             └────────┬────────┘
                      │
                      │ API
                      ▼
             ┌─────────────────┐
             │ Node / Express  │
             └────────┬────────┘
                      │
             ┌────────┼────────┐
             │        │        │
             ▼        ▼        ▼
          MongoDB  GitHub   Auth/JWT
                      │
                      ▼
              Repository Files
                      │
                      ▼
                File Filtering
                      │
                      ▼
                File Selection
                      │
                      ▼
                 Code Chunking
                      │
                      ▼
             ┌─────────────────┐
             │ Python FastAPI  │
             └────────┬────────┘
                      │
                      ▼
                 LangGraph
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
        BUG       SECURITY      QUALITY
       AGENT        AGENT        AGENT
          │           │           │
          └───────────┼───────────┘
                      ▼
                 FINAL AGENT
                      │
                      ▼
                JSON REPORT
                      │
                      ▼
             Node.js Backend
                      │
                      ▼
              React Frontend
                      │
                      ▼
                USER REPORT
```

---

# 🆓 Free Review System

CodeLens provides a limited number of free repository reviews.

The current application allows:

```text
4 Free Reviews
```

The review count is maintained on the backend.

Example:

```text
reviewsUsed = 0
       ↓
     Review
       ↓
reviewsUsed = 1
       ↓
     Review
       ↓
reviewsUsed = 2
       ↓
     Review
       ↓
reviewsUsed = 3
       ↓
     Review
       ↓
reviewsUsed = 4
       ↓
   Upgrade Required
```

The frontend should not be treated as the source of truth for usage limits. The authenticated backend user record should enforce the limit.

---

# 💳 Upgrade System

After the free review limit is reached, CodeLens can display an upgrade interface.

Current planned pricing:

```text
CodeLens Pro
$20
```
IT is now connected to Razorpay 

The payment interface can later be connected to:

* Stripe
* Razorpay

A production payment flow should verify payments on the backend using webhooks before upgrading the user's plan.

---

# ⚙️ Installation

Clone the repository:

```bash
git clone <repository-url>

cd CodeLens
```

The project contains three applications that need to be configured separately.

---

# 1. Frontend Setup

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

---

# 2. Auth / Node.js Setup

Open another terminal:

```bash
cd auth
npm install
```

Create:

```text
auth/.env
```

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

PYTHON_BACKEND_URL=http://127.0.0.1:8000
```

Start the server:

```bash
npm start
```

or, if the project uses nodemon:

```bash
npm run dev
```

---

# 3. Python Backend Setup

Open another terminal:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure environment variables if required by the AI service.

Start FastAPI:

```bash
uvicorn main:app --reload --port 8000
```

The Python service will run on:

```text
http://127.0.0.1:8000
```

---

# 🚀 Running the Complete Project

You need three services running.

### Terminal 1 — Frontend

```bash
cd frontend
npm run dev
```

### Terminal 2 — Auth / Node.js

```bash
cd auth
npm run dev
```

### Terminal 3 — Python AI Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The architecture becomes:

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
LangGraph AI Agents
```

---

# 🔑 Environment Variables

Never commit secrets to GitHub.

Example Node.js environment:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PYTHON_BACKEND_URL=http://127.0.0.1:8000
```

Example frontend:

```env
VITE_API_URL=http://localhost:5000
```

AI-related environment variables should be stored only in the Python backend environment.

Add environment files to `.gitignore`:

```gitignore
.env
.env.local
.env.production
venv/
__pycache__/
node_modules/
dist/
```

---

# 🛡️ Security

CodeLens should follow basic security practices:

* Passwords must be hashed.
* JWT secrets must remain private.
* API keys must never be exposed to the frontend.
* MongoDB credentials must remain in environment variables.
* Review limits must be enforced server-side.
* User-specific review history must require authentication.
* GitHub repository URLs should be validated.
* AI backend endpoints should not be publicly exposed without appropriate protection in production.

---

# 📊 Review Report

A CodeLens review contains:

### Code Health Score

```text
87 / 100
```

### Issue Categories

```text
Critical
High
Medium
Low
```

### Each Issue Contains

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

The system also generates general recommendations to improve the repository.

---

# 🎯 Main Features

* 🤖 Multi-agent AI code review
* 🐞 Bug detection
* 🔐 Security analysis
* ✨ Code-quality analysis
* 🧠 AI-generated recommendations
* 📂 GitHub repository analysis
* 🔎 Intelligent file selection
* ✂️ Code chunking
* 🔑 JWT authentication
* 👤 User accounts
* 🗄️ MongoDB persistence
* 📜 Review history
* 🆓 Free review allowance
* 💳 Upgrade system
* 🎨 Modern developer-focused UI
* ⚡ React frontend
* 🐍 Python AI backend
* 🔄 LangGraph agent orchestration

---

# 🧰 Technology Stack

## Frontend

| Technology   | Purpose           |
| ------------ | ----------------- |
| React        | UI                |
| Vite         | Development/build |
| Tailwind CSS | Styling           |
| React Router | Routing           |
| Axios        | API requests      |
| GSAP         | Animations        |
| Motion       | UI animations     |

## Authentication / Application Backend

| Technology | Purpose                    |
| ---------- | -------------------------- |
| Node.js    | Runtime                    |
| Express.js | API server                 |
| MongoDB    | Database                   |
| Mongoose   | MongoDB ODM                |
| JWT        | Authentication             |
| Axios      | Service communication      |
| CORS       | Cross-origin communication |
| dotenv     | Environment configuration  |

## AI Backend

| Technology | Purpose             |
| ---------- | ------------------- |
| Python     | AI backend          |
| FastAPI    | API server          |
| LangChain  | LLM framework       |
| LangGraph  | Agent orchestration |
| Gemini     | AI model            |
| Pydantic   | Data validation     |

---

# 📈 Future Improvements

Potential future improvements include:

* Pull Request reviews
* GitHub App integration
* Automatic PR comments
* Continuous code monitoring
* Repository-wide dependency analysis
* More specialized AI agents
* Custom organization rules
* Team dashboards
* CI/CD integration
* Slack/Discord notifications
* Detailed code explanations
* Automatic fix generation
* AI-generated unit tests
* Stripe/Razorpay payments
* Repository comparison
* Code-quality trends over time

---

# 🧠 Why CodeLens?

Traditional code review depends heavily on developers manually inspecting code.

CodeLens approaches the problem using specialized AI agents.

Instead of asking one model:

```text
"Review this code."
```

CodeLens separates the task:

```text
Is the code correct?
        ↓
     Bug Agent

Is the code secure?
        ↓
  Security Agent

Is the code maintainable?
        ↓
   Quality Agent

What is the final assessment?
        ↓
    Final Agent
```

This creates a more structured approach to AI-powered code review.

---

# 📜 Development Philosophy

CodeLens is built around three ideas:

### Understand

Help developers understand their code and its potential problems.

### Detect

Identify bugs, security vulnerabilities, and quality issues.

### Improve

Provide actionable recommendations rather than simply pointing out problems.

```text
UNDERSTAND → DETECT → IMPROVE
```

---

# 👨‍💻 Author

**Harsh Vardhan**

CodeLens — AI Code Intelligence Platform

