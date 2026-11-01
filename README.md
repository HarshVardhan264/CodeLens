# CodeLens

### Autonomous AI-Powered Code Review Platform

CodeLens is an AI-powered code intelligence platform that analyzes
GitHub repositories to identify potential bugs, security
vulnerabilities, and code-quality issues.

Instead of relying on a single AI reviewer, CodeLens uses multiple
specialized AI agents to analyze code from different perspectives and
combines their findings into a structured review report.

**Live Application:** https://code-lens-rose.vercel.app/

---

## ✨ What is CodeLens?

CodeLens helps developers understand what may be wrong with their code,
why it matters, and how it can be improved.

A developer submits a GitHub repository URL, and CodeLens:

1. Connects to the GitHub repository.

2. Retrieves repository files using the GitHub API.

3. Filters unnecessary files and directories.

4. Selects relevant source files.

5. Splits large files into manageable code chunks.

6. Sends the code to the Python AI backend.

7. Runs multiple specialized AI agents.

8. Combines their findings.

9. Generates a structured code-review report.

### AI Review Agents

| Agent | Responsibility |

|---|---|

| 🐞 Bug Agent | Detects logical errors, runtime problems, and
potential bugs |

| 🔐 Security Agent | Identifies security vulnerabilities and unsafe
practices |

| ✨ Quality Agent | Evaluates readability, maintainability, and code
quality |

| 🧠 Final Agent | Combines findings into a structured report |

---

## 🏗️ System Architecture

CodeLens consists of three main services:

| Service | Technology | Responsibility |

|---|---|---|

| Frontend | React, Vite, Tailwind CSS | User interface and review
results |

| Auth / Application API | Node.js, Express, MongoDB |
Authentication, repository processing, and application APIs |

| AI Backend | Python, FastAPI, LangGraph | Multi-agent AI code
analysis |

### Architecture Overview

```text

                    USER

                      |

                      v

             +------------------+

             |  React Frontend  |

             |   Vite + Nginx   |

             +--------+---------+

                      |

                      | HTTP API

                      v

             +------------------+

             |  Node.js /       |

             |  Express Auth    |

             +--------+---------+

                      |

          +-----------+-----------+

          |           |           |

          v           v           v

       MongoDB     GitHub API   JWT Auth

                      |

                      v

              Repository Files

                      |

                      v

              File Processing

          (Filtering, Selection,

                Chunking)

                      |

                      v

             +------------------+

             | Python FastAPI   |

             +--------+---------+

                      |

                      v

                 LangGraph

                      |

          +-----------+-----------+

          |           |           |

          v           v           v

        Bug       Security     Quality

       Agent       Agent        Agent

          |           |           |

          +-----------+-----------+

                      |

                      v

                 Final Agent

                      |

                      v

              Structured Report

                      |

                      v

              React Frontend

```

---

## 📁 Project Structure

The repository is organized as a monorepo containing three independent
applications.

```text

Code reviewer/

│

├── Frontend/

│   ├── public/

│   ├── src/

│   ├── package.json

│   ├── Dockerfile

│   └── .dockerignore

│

├── Auth/

│   ├── config/

│   ├── controllers/

│   ├── middleware/

│   ├── models/

│   ├── routes/

│   ├── Services/

│   ├── app.js

│   ├── package.json

│   ├── Dockerfile

│   └── .dockerignore

│

├── Backend/

│   ├── agents/

│   ├── graph/

│   ├── main.py

│   ├── requirements.txt

│   ├── Dockerfile

│   └── .dockerignore

│

├── docker-compose.yml

├── .gitignore

└── README.md

```

*The directory listing above highlights the main application
components and Docker configuration files.*

---

## 🎨 Frontend

The `Frontend` directory contains the user-facing React application.

### Technologies

- React

- Vite

- JavaScript

- Tailwind CSS

- React Router

- Axios

- GSAP

- GSAP ScrollTrigger

- Motion

### Responsibilities

- Landing page and application navigation

- User registration and login interfaces

- Repository submission

- Review results and issue visualization

- User profile and review history

- Usage information and upgrade interface

- Responsive UI and animations

The frontend communicates with the Node.js application API using Axios.

---

## 🔐 Authentication and Application Backend

The `Auth` directory contains the Node.js and Express application
server.

### Technologies

- Node.js

- Express.js

- MongoDB

- Mongoose

- JWT

- Axios

- CORS

- Cookie Parser

- dotenv

### Responsibilities

- User registration and login

- Password hashing and JWT authentication

- Protected API routes

- User and review data management

- Review usage limits

- Review history

- GitHub repository processing

- Communication with the Python AI backend

The Auth service handles application-level operations and forwards
code-review requests to the AI backend.

---

## 🗄️ MongoDB

MongoDB stores application data, including user information and review
history.

### User Data

```text

User

├── name

├── email

├── password

├── plan

├── reviewsUsed

└── reviewHistory

```

### Review Data

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

The backend maintains review history and enforces usage limits.

---

## 🐍 Python AI Backend

The `Backend` directory contains the AI-powered code-review engine.

### Technologies

- Python

- FastAPI

- LangChain

- LangGraph

- Google Gemini

- Pydantic

The Python service receives code chunks from the Node.js application
server and processes them through the multi-agent review workflow.

---

## 🤖 Multi-Agent AI System

CodeLens uses LangGraph to orchestrate specialized AI agents.

```text

                 Code Chunks

                      |

                      v

              +---------------+

              |   LangGraph   |

              |  Review Graph |

              +-------+-------+

                      |

          +-----------+-----------+

          |           |           |

          v           v           v

       Bug Agent  Security Agent  Quality Agent

          |           |           |

          +-----------+-----------+

                      |

                      v

                 Final Agent

                      |

                      v

                Final Report

```

### 🐞 Bug Agent

Analyzes functional correctness and identifies:

- Logical errors

- Incorrect conditions

- Runtime problems

- Edge cases

- Incorrect state handling

- Potential crashes

- Incorrect calculations

### 🔐 Security Agent

Analyzes potential security risks, including:

- Authentication and authorization issues

- Unsafe input handling

- Hardcoded secrets

- Injection vulnerabilities

- Insecure API usage

- Sensitive information exposure

### ✨ Quality Agent

Evaluates maintainability and code quality, including:

- Poor naming

- Duplicate code

- Complex functions

- Poor structure

- Readability problems

- Unnecessary complexity

### 🧠 Final Agent

Combines the findings from the specialized agents into a structured
report containing:

- Overall code-health score

- Summary

- Issue counts by severity

- File paths and line references

- Issue categories

- Descriptions and suggested fixes

- General recommendations

### Example Review Report

```json

{

  "score": 75,

  "summary": "The repository contains several issues that should be
addressed.",

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

## 🔍 Repository Review Pipeline

When a user submits a GitHub repository, CodeLens follows this workflow:

**1. Repository URL**

The frontend sends the submitted repository URL to the Node.js
application server.

**2. GitHub API**

The application server retrieves repository information and its file
tree using the GitHub API.

**3. File Filtering**

Unnecessary files and directories are excluded, such as:

```text

node_modules/

.git/

dist/

build/

coverage/

tests/

package-lock.json

```

**4. File Selection**

CodeLens prioritizes relevant source files, including authentication,
controllers, services, routes, APIs, middleware, models, and application
entry points.

**5. Code Chunking**

Large source files are divided into manageable chunks while retaining
file-path and line-number information.

Example:

```json

{

  "filePath": "src/auth/login.js",

  "startLine": 1,

  "endLine": 300,

  "code": "..."

}

```

**6. AI Review**

The chunks are sent to the Python FastAPI service.

**7. Multi-Agent Analysis**

Bug, Security, and Quality agents analyze the code.

**8. Final Report**

The Final Agent combines the findings into a structured report.

**9. Results**

The Node.js server returns the report to the React frontend for display.

---

## 🆓 Free Review System

CodeLens currently provides **4 free repository reviews**.

The review count is maintained on the backend.

```text

reviewsUsed = 0

      |

      v

    Review

      |

      v

reviewsUsed = 1

      |

      v

    Review

      |

      v

reviewsUsed = 2

      |

      v

    Review

      |

      v

reviewsUsed = 3

      |

      v

    Review

      |

      v

reviewsUsed = 4

      |

      v

 Upgrade Required

```

The frontend is not treated as the source of truth for usage limits. The
authenticated backend user record enforces the limit.

---

## 💳 Upgrade and Payment System

CodeLens includes a Pro upgrade interface and Razorpay integration.

Current displayed pricing:

```text

CodeLens Pro

$20

```

Payment processing is integrated through Razorpay. Payment verification
and plan upgrades should be performed securely on the backend, with
appropriate payment verification and webhook handling.

---

# ⚙️ GitHub Actions CI/CD

CodeLens uses GitHub Actions to validate changes and coordinate
production deployments.

### Continuous Integration

The workflow is defined in .github/workflows/codelens-ci.yml and runs
on pushes to main and pull requests targeting main.
  Job                                 Checks performed
  Frontend Build                      Installs frontend dependencies with
npm ci and runs the Vite
production build

  Auth Backend Check                  Installs Auth dependencies and
checks app.js syntax with Node.js

  Python AI Backend Check             Installs Python development
dependencies, compiles Python
files, and runs offline pytest
tests

  Docker Image Build                  Builds the Auth, AI Backend, and
Frontend Docker images without
pushing them to a registry
Notify Vercel                       Runs after all four CI jobs succeed
on a push to main, then publishes
a GitHub commit status for Vercel
### Offline Backend Tests

Backend tests are stored in Backend/tests/.

The development dependency file Backend/requirements-dev.txt includes
the production requirements plus pytest. The production Docker image
continues to install only Backend/requirements.txt.

Run the tests locally from the Backend directory:
uv run python -m pytest tests/ -v
These tests validate backend logic without making live Gemini API calls
or consuming Gemini API quota. They do not test Gemini model quality or
live API availability.

### Continuous Deployment Configuration

Production deployment checks are configured as follows:
- Render Auth: Auto-Deploy is set to After CI checks pass.
- Render AI Backend: Auto-Deploy is set to After CI checks pass.
- Vercel Frontend: The Notify Vercel GitHub check is configured
  as a required Deployment Check before production promotion.
The Notify Vercel job depends on the Frontend Build, Auth Backend
Check, Python AI Backend Check, and Docker Image Build jobs. It runs
only for pushes to main, after those jobs succeed.

The GitHub commit SHA is used when importing the check into Vercel. The
check name is reused by the workflow for subsequent commits; a new SHA
does not need to be manually entered for every deployment.

Deployment verification: The CI workflow and deployment checks are
configured. Verify the end-to-end production deployment behavior with a
new successful push before treating the complete deployment flow as
production-validated.
# 🐳 Docker Setup

CodeLens supports containerized local development using Docker and
Docker Compose.

Each application has its own Dockerfile:

- `Frontend/Dockerfile`

- `Auth/Dockerfile`

- `Backend/Dockerfile`

Each service also has a `.dockerignore` file to prevent unnecessary
files, local dependencies, and environment files from being copied into
its image.

### Why Docker?

- Consistent environments across machines

- Isolated dependencies for each service

- Easier local setup

- Independent service containers

- Simplified multi-service orchestration

- Portability across deployment environments

### Docker Architecture

```text

                 Docker Compose

                       |

          +------------+------------+

          |            |            |

          v            v            v

      Frontend        Auth       AI Backend

       Nginx        Node.js       FastAPI

          |            |            |

          |            +------------+

          |               Internal

          |              communication

          |

          v

     localhost:8080

```

### Prerequisites

Install:

- \(Docker Desktop\)(https://www.docker.com/products/docker-desktop/)

- \(Git\)(https://git-scm.com/)

Make sure Docker Desktop is running before executing Docker commands.

### Environment Configuration

Create the required environment files locally.

**Frontend `.env`**

```env

VITE_API_URL=http://localhost:5000

VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

```

**Auth `.env`**

```env

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GITHUB_TOKEN=your_github_token

RAZORPAY_KEY_ID=your_razorpay_key_id

RAZORPAY_KEY_SECRET=your_razorpay_key_secret

AI_SERVICE_URL=http://ai-backend:8000

FRONTEND_URL=http://localhost:8080

```

**Backend `.env`**

```env

GOOGLE_API_KEY=your_google_api_key

```

Use the actual environment variables required by your application. Keep
all secret values private.

### Start All Services

Run the following command from the project root, where
`docker-compose.yml` is located:

```bash

docker compose --env-file Frontend/.env up --build -d

```

This command:

- Builds the service images.

- Creates the containers.

- Starts the frontend, Auth, and AI backend.

- Runs the containers in detached mode.

### Access the Application

| Service | Local URL |

|---|---|

| Frontend | http://localhost:8080 |

| Auth API | http://localhost:5000 |

| Python AI Backend | http://localhost:8000 |

### Check Container Status

```bash

docker compose ps

```

### View Logs

```bash

docker compose logs -f

```

View logs for an individual service:

```bash

docker compose logs -f auth

docker compose logs -f ai-backend

docker compose logs -f frontend

```

### Stop All Services

```bash

docker compose down

```

To rebuild and restart after making changes:

```bash

docker compose --env-file Frontend/.env up --build -d

```

---

# 🚀 Production Deployment

CodeLens is deployed using **Vercel for the frontend** and
**Render for the backend services**.

### Deployment Architecture

```text

                 USERS

                   |

                   v

          +------------------+

          | Vercel           |

          | React Frontend   |

          +--------+---------+

                   |

                   v

          +------------------+

          | Render           |

          | Node.js / Express|

          +--------+---------+

                   |

             +-----+------+

             |            |

             v            v

          MongoDB      Render

          Atlas        Python AI

                       Backend

```

### Live Services

| Component | Platform | URL |

|---|---|---|

| Frontend | Vercel | https://code-lens-rose.vercel.app/ |

| Auth / Application API | Render |
https://codelens-auth.onrender.com |

| Python AI Backend | Render |
https://codelens-ai-backend-5jh1.onrender.com |

### Frontend Deployment --- Vercel

The React application is deployed on Vercel.

Configuration:

- Root directory: `Frontend`

- Build command: `npm run build`

- Output directory: `dist`

- Install command: `npm install`

Frontend environment variables:

```env

VITE_API_URL=https://codelens-auth.onrender.com

VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

```

### Auth Deployment --- Render

The Node.js application is deployed as a Render web service.

Configuration:

- Root directory: `Auth`

- Build command: `npm install`

- Start command: `npm start`

Important environment variables:

```env

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id

RAZORPAY_KEY_SECRET=your_razorpay_key_secret

GITHUB_TOKEN=your_github_token

AI_SERVICE_URL=https://codelens-ai-backend-5jh1.onrender.com

FRONTEND_URL=https://code-lens-rose.vercel.app

```

Render provides the service port through its `PORT` environment
variable.

### Python AI Backend Deployment --- Render

The FastAPI application is deployed as a separate Render web service.

Configuration:

- Root directory: `Backend`

- Build command: `pip install -r requirements.txt`

- Start command:

```bash

uvicorn main:app --host 0.0.0.0 --port $PORT

```

Environment variable:

```env

GOOGLE_API_KEY=your_google_api_key

```

The backend dependencies are maintained in `Backend/requirements.txt`.

### Deployment Notes

- The frontend communicates with the deployed Auth API.

- The Auth service communicates with the Python AI backend using its
deployed URL.

- MongoDB Atlas stores application data.

- Production environment variables are configured through the
respective hosting dashboards.

- Local `.env` files are not uploaded as part of deployment
configuration.

---

## ⚙️ Running Without Docker

Docker Compose is the recommended way to start all three services
locally. You can also run them individually for development.

### 1. Frontend

```bash

cd Frontend

npm install

npm run dev

```

### 2. Auth / Node.js

Open another terminal:

```bash

cd Auth

npm install

npm start

```

### 3. Python AI Backend

Open another terminal:

```bash

cd Backend

```

Create and activate a virtual environment.

**Windows:**

```powershell

python -m venv .venv

.venv`\Scripts`{=tex}`\activate`{=tex}

```

**macOS / Linux:**

```bash

python3 -m venv .venv

source .venv/bin/activate

```

Install dependencies:

```bash

pip install -r requirements.txt

```

Start FastAPI:

```bash

uvicorn main:app --reload --port 8000

```

Make sure the Auth service's `AI_SERVICE_URL` points to the locally
running Python backend when running services outside Docker:

```env

AI_SERVICE_URL=http://127.0.0.1:8000

```

---

## 🔑 Environment Variables and Secret Management

CodeLens uses environment variables to configure database connections,
authentication, payment processing, GitHub access, and AI model access.

Important practices:

- Never commit `.env` files or API keys to GitHub.

- Keep `JWT_SECRET` private.

- Never expose `RAZORPAY_KEY_SECRET` to the frontend.

- Keep MongoDB credentials in backend environment variables.

- Store Google Gemini API keys only in the Python backend environment.

- Use `VITE_` variables only for values intended to be exposed to
the browser.

- Enforce authentication and usage limits on the server.

- Use separate environment configurations for local development and
production.

The project includes `.dockerignore` files for each service to keep
local dependencies and environment files out of Docker build contexts.

---

## 🛡️ Security Considerations

- Passwords should be securely hashed.

- JWT secrets must remain private.

- API keys must never be exposed to the frontend.

- MongoDB credentials must remain in environment variables.

- Review limits must be enforced server-side.

- User-specific review history must require authentication.

- GitHub repository URLs should be validated.

- AI backend endpoints should be protected appropriately in production.

- AI-generated findings should be reviewed by developers before being
treated as confirmed vulnerabilities.

---

## 📊 Review Report

Each review can include:

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

CodeLens also generates general recommendations to improve code quality,
reliability, and security.

---

## 🎯 Main Features

- 🤖 Multi-agent AI code review

- 🐞 Potential bug detection

- 🔐 Security analysis

- ✨ Code-quality analysis

- 🧠 AI-generated recommendations

- 📂 GitHub repository analysis

- 🔎 Intelligent file selection

- ✂️ Code chunking

- 🔑 JWT authentication

- 👤 User accounts

- 🗄️ MongoDB persistence

- 📜 Review history

- 🆓 Free review allowance

- 💳 Razorpay integration

- 🎨 Modern developer-focused UI

- ⚡ React frontend

- 🐍 Python AI backend

- 🔄 LangGraph agent orchestration

- 🐳 Dockerized services

- 🚀 Cloud deployment using Render and Vercel

---

## 🧰 Technology Stack

### Frontend

| Technology | Purpose |

|---|---|

| React | User interface |

| Vite | Development and build |

| Tailwind CSS | Styling |

| React Router | Routing |

| Axios | API requests |

| GSAP | Animations |

| Motion | UI animations |

### Authentication / Application Backend

| Technology | Purpose |

|---|---|

| Node.js | Runtime |

| Express.js | API server |

| MongoDB | Database |

| Mongoose | MongoDB ODM |

| JWT | Authentication |

| Axios | Service communication |

| CORS | Cross-origin communication |

| dotenv | Environment configuration |

### AI Backend

| Technology | Purpose |

|---|---|

| Python | AI backend |

| FastAPI | API server |

| LangChain | LLM framework |

| LangGraph | Agent orchestration |

| Google Gemini | Language model |

| Pydantic | Data validation |

### DevOps and Deployment

| Technology | Purpose |

|---|---|

| Docker | Containerization |

| Docker Compose | Multi-container orchestration |

| Nginx | Frontend production web server |

| Render | Backend hosting |

| Vercel | Frontend hosting |

| Git and GitHub | Version control and source hosting |

---

## 📈 Future Improvements

Potential future improvements include:

- Pull request reviews

- GitHub App integration

- Automatic PR comments

- Continuous code monitoring

- Repository-wide dependency analysis

- More specialized AI agents

- Custom organization rules

- Team dashboards

- Expand CI/CD deployment validation and release automation

- Slack and Discord notifications

- Detailed code explanations

- Automatic fix generation

- AI-generated unit tests

- Enhanced payment and subscription management

- Repository comparison

- Code-quality trends over time

---

## 🧠 Why CodeLens?

Traditional code review depends heavily on developers manually
inspecting source code.

CodeLens approaches the problem by separating code analysis into
specialized tasks.

```text

Is the code correct?

        |

        v

     Bug Agent

Is the code secure?

        |

        v

   Security Agent

Is the code maintainable?

        |

        v

   Quality Agent

What is the final assessment?

        |

        v

    Final Agent

```

This architecture provides a structured approach to AI-powered code
review, with findings consolidated into one report.

---

## 📜 Development Philosophy

CodeLens is built around three ideas:

**Understand** --- Help developers understand their code and
potential problems.

**Detect** --- Identify bugs, security vulnerabilities, and
code-quality issues.

**Improve** --- Provide actionable recommendations rather than
simply pointing out problems.

```text

UNDERSTAND → DETECT → IMPROVE

```

---

## 👨‍💻 Author

**Harsh Vardhan**

CodeLens --- AI Code Intelligence Platform