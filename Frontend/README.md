# 🔎 CodeLens — Frontend

> The frontend interface for **CodeLens**, an autonomous AI-powered code review platform.

CodeLens helps developers analyze GitHub repositories and identify **bugs, security vulnerabilities, and code-quality issues** using a multi-agent AI system.

The frontend provides the interface for authentication, repository submission, AI review results, user profiles, review history, and usage information.

---

## ✨ Features

- 🔐 **Authentication** — Login and signup interface
- 🏠 **Landing Page** — Introduction to the CodeLens platform
- 📖 **About Page** — Overview of how CodeLens works
- 📩 **Contact Page** — Contact interface
- 🔍 **Repository Review** — Submit a GitHub repository for analysis
- 📊 **Review Results** — Display structured AI-generated findings
- 👤 **User Profile** — Manage and view user information
- 📜 **Review History** — Access previous repository reviews
- 📈 **Usage Information** — Track available reviews
- 💳 **Upgrade Interface** — Pro upgrade experience
- ⚡ **Smooth Animations** — Interactive UI animations and transitions
- 📱 **Responsive UI** — Designed for different screen sizes

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React** | User interface |
| **Vite** | Development and build tooling |
| **Tailwind CSS** | Styling |
| **JavaScript** | Application logic |
| **React Router** | Client-side routing |
| **Axios** | API communication |
| **GSAP** | Animations |
| **GSAP ScrollTrigger** | Scroll-based animations |
| **Motion** | UI animations |

---

## 📁 Project Structure

```text
Frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── about/
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Review.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── Dockerfile
├── .dockerignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🔄 Frontend Flow

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
      Axios Request
          │
          ▼
     Auth / API Server
```

The frontend communicates with the backend through API requests and displays the processed review results to the user.

---

## 🔗 Code Review Flow

```text
GitHub Repository URL
          │
          ▼
       Review Page
          │
          ▼
      Axios Request
          │
          ▼
    Node.js / Express
          │
          ▼
   Python AI Backend
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
     Review Results
```

---

## 🎨 Design

CodeLens follows a modern **developer-focused interface** designed to make AI-powered code review feel like a dedicated developer tool.

The frontend focuses on:

- Clean visual hierarchy
- Smooth page transitions
- Interactive animations
- Responsive layouts
- Clear review information
- Simple navigation
- Focused developer workflows

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd CodeLens/Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API

Create a `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

For production, configure `VITE_API_URL` with the deployed Auth API URL in your Vercel project environment variables.

### 4. Start the development server

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🧑‍💻 Development

### Start development server

```bash
npm run dev
```

### Create production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 🐳 Docker

The frontend uses a multi-stage Docker build:

- **Build stage:** Uses Node.js to install dependencies and generate the Vite production build.
- **Production stage:** Uses Nginx to serve the generated static files.

Build the frontend image from the project root:

```bash
docker build -t codelens-frontend ./Frontend
```

Run the container:

```bash
docker run -p 8080:80 codelens-frontend
```

Open:

```text
http://localhost:8080
```

The frontend Docker build accepts these build arguments:

| Argument | Purpose |
|---|---|
| `VITE_API_URL` | Backend API URL |
| `VITE_RAZORPAY_KEY_ID` | Public Razorpay key ID |

Example:

```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:5000 \
  --build-arg VITE_RAZORPAY_KEY_ID=your_public_key_id \
  -t codelens-frontend ./Frontend
```

---

## ⚙️ CI/CD

CodeLens uses **GitHub Actions** for continuous integration and **Vercel** for frontend deployment.

The GitHub Actions workflow is located at:

```text
.github/workflows/codelens-ci.yml
```

### CI checks

| Job | Purpose |
|---|---|
| Frontend Build | Installs dependencies and verifies the Vite production build |
| Auth Backend Check | Checks the Node.js Auth backend |
| Python AI Backend Check | Compiles Python files and runs offline tests |
| Docker Image Build | Builds Docker images for all three services |
| Notify Vercel | Publishes a GitHub commit status after all required CI jobs pass |

### Deployment flow

1. Changes are pushed to the `main` branch.
2. GitHub Actions runs the configured CI checks.
3. The Vercel notification job runs after the required CI jobs succeed.
4. Vercel uses the configured `Notify Vercel` deployment check before promoting the deployment to production.

The frontend is deployed through Vercel:

**Live Application:** https://code-lens-rose.vercel.app/

The Vercel project uses the `Frontend` directory as its root directory and builds the application using:

```bash
npm install
npm run build
```

The production output directory is:

```text
dist
```

---

## 🔌 Backend

The frontend is designed to work with the CodeLens application backend.

The backend handles:

- Authentication
- User accounts
- Review history
- GitHub repository processing
- Communication with the Python AI backend

The frontend communicates with these services through HTTP API requests.



