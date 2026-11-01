# 🔐 CodeLens — Auth Backend

> The Node.js and Express backend responsible for authentication, user management, and application-level API operations for CodeLens.

The Auth service acts as the application backend between the React frontend and the Python AI review engine. It manages user accounts, authentication, review-related operations, and communication with the AI backend.

---

## ✨ Features

- 🔐 **User Authentication** — Signup and login functionality
- 🔑 **JWT Authorization** — Token-based authentication for protected routes
- 👤 **User Management** — Handles user account information
- 🗄️ **MongoDB Integration** — Stores application and user data
- 🔍 **Repository Review Integration** — Connects frontend review requests with the AI backend
- 📜 **Review History** — Supports application review-history operations
- 💳 **Razorpay Integration** — Supports the Pro upgrade and payment workflow
- 🐙 **GitHub Integration** — Supports GitHub-related repository operations
- 🔗 **Service Communication** — Communicates with the Python FastAPI AI backend
- 🌐 **REST API** — Exposes endpoints for the React frontend

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | Backend framework |
| **MongoDB** | Database |
| **JWT** | Authentication and authorization |
| **Axios / HTTP** | Service communication |
| **Razorpay** | Payment integration |
| **GitHub API** | Repository integration |
| **Docker** | Containerization |
| **Render** | Backend deployment |

---

## 📁 Project Structure

```text
Auth/
│
├── app.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── .env
└── README.md
```

*Add your actual route, controller, model, and middleware directories here if they exist in your current project structure.*

---

## 🔄 Application Architecture

The Auth service connects the frontend with the application's backend services.

```text
              React Frontend
                    │
                    ▼
             Node.js / Express
                    │
          ┌─────────┼─────────┐
          │         │         │
          ▼         ▼         ▼
       MongoDB    GitHub    Razorpay
          │       API       API
          │
          ▼
     Application Data
                    │
                    ▼
             Python / FastAPI
                    │
                    ▼
              LangGraph AI
```

The Auth backend handles application-level operations, while the Python service performs AI-powered repository analysis.

---

## 🔐 Authentication

CodeLens uses JSON Web Tokens (JWT) for authentication.

### Signup

The frontend sends user registration information to the Auth backend. The backend processes the request and creates the user account.

### Login

The backend verifies the submitted credentials and provides an authentication token.

### Protected Routes

JWT authentication allows the backend to verify requests to protected application endpoints.

```text
User
 │
 ▼
Login / Signup
 │
 ▼
Express API
 │
 ▼
Credential Verification
 │
 ▼
JWT Authentication
 │
 ▼
Authorized Application Access
```

---

## 🗄️ Database

CodeLens uses MongoDB to persist application data.

The Auth service uses the MongoDB connection configured through an environment variable.

```env
MONGO_URI=your_mongodb_connection_string
```

The database connection string must be stored securely and must not be committed to GitHub.

---

## 🔗 AI Backend Integration

The Auth service communicates with the Python FastAPI service to process AI-powered code reviews.

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
LangGraph
      │
      ▼
Bug / Security / Quality Agents
      │
      ▼
Structured Review Report
      │
      ▼
React Frontend
```

The AI service URL is configured using:

```env
AI_SERVICE_URL=http://localhost:8000
```

For Docker Compose, the service communicates through the internal Docker network:

```env
AI_SERVICE_URL=http://ai-backend:8000
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd CodeLens/Auth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `Auth` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
GITHUB_TOKEN=your_github_token
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Use the actual variable names expected by your application. Never commit real credentials or secret values.

### 4. Start the server

```bash
npm start
```

The Auth backend runs at:

```text
http://localhost:5000
```

---

## 🧑‍💻 Development

### Install dependencies

```bash
npm install
```

### Start the backend

```bash
npm start
```

### Check JavaScript syntax

```bash
node --check app.js
```

---

## 🐳 Docker

The Auth service is containerized using Docker.

The Dockerfile uses Node.js 22 Alpine and installs production dependencies before starting the Express application.

### Build the image

Run this command from the project root:

```bash
docker build -t codelens-auth ./Auth
```

### Run the container

```bash
docker run -p 5000:5000 --env-file Auth/.env codelens-auth
```

The service will be available at:

```text
http://localhost:5000
```

### Docker Compose

The Auth service can also run as part of the complete CodeLens application using Docker Compose.

From the project root:

```bash
docker compose --env-file Frontend/.env up --build -d
```

The Auth container communicates with the AI backend using the internal service address:

```text
http://ai-backend:8000
```

---

## ⚙️ CI/CD

CodeLens uses **GitHub Actions** for continuous integration.

The workflow is located at:

```text
.github/workflows/codelens-ci.yml
```

### Auth CI Checks

| Check | Purpose |
|---|---|
| Dependency Installation | Installs dependencies using `npm ci` |
| JavaScript Syntax Check | Runs `node --check app.js` |
| Docker Image Build | Builds the Auth Docker image |

The Auth CI job checks that dependencies install successfully and that the main application file passes Node.js syntax validation.

The Docker build job verifies that the Auth service can be containerized.

### Deployment

The Auth backend is deployed on Render.

**Live Service:** https://codelens-auth.onrender.com

Render configuration:

| Setting | Value |
|---|---|
| Root Directory | `Auth` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Deployment | After CI checks pass |

Render injects the `PORT` environment variable at runtime.

The service uses environment variables for database credentials, JWT configuration, external API credentials, and communication with other CodeLens services.

---

## 🔑 Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the Express server; supplied by Render in production |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `FRONTEND_URL` | Frontend origin used for CORS configuration |
| `AI_SERVICE_URL` | Python AI backend URL |
| `GITHUB_TOKEN` | GitHub API authentication |
| `RAZORPAY_KEY_ID` | Razorpay public key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |

> Never commit `.env` files, API keys, database credentials, JWT secrets, or payment credentials to GitHub.

---

## 🔄 Complete CodeLens Architecture

```text
             React / Vite Frontend
                      │
                      ▼
              Node.js / Express
                 Auth Service
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
       MongoDB     GitHub      Razorpay
          │
          ▼
       Python / FastAPI
          │
          ▼
        LangGraph
          │
     ┌────┼────┐
     ▼    ▼    ▼
    Bug Security Quality
   Agent  Agent  Agent
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

## 🎯 Purpose

The Auth service provides the application infrastructure that connects users, data, and AI-powered functionality.

Its responsibilities include:

- Managing authentication and user access
- Connecting the application to MongoDB
- Handling application-level API operations
- Integrating external services
- Communicating with the Python AI backend

Together, these services power CodeLens as an integrated AI-powered code review platform.