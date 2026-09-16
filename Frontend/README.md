# 🔎 CodeLens — Frontend

> The frontend interface for **CodeLens**, an autonomous AI-powered code review platform.

CodeLens helps developers analyze GitHub repositories and identify **bugs, security vulnerabilities, and code-quality issues** using a multi-agent AI system.

The frontend provides the interface for authentication, repository submission, AI review results, user profiles, review history, and usage information.

---

## ✨ Features

* 🔐 **Authentication** — Login and signup interface
* 🏠 **Landing Page** — Introduction to the CodeLens platform
* 📖 **About Page** — Overview of how CodeLens works
* 📩 **Contact Page** — Contact interface
* 🔍 **Repository Review** — Submit a GitHub repository for analysis
* 📊 **Review Results** — Display structured AI-generated findings
* 👤 **User Profile** — Manage and view user information
* 📜 **Review History** — Access previous repository reviews
* 📈 **Usage Information** — Track available reviews
* 💳 **Upgrade Interface** — Pro upgrade experience
* ⚡ **Smooth Animations** — Interactive UI animations and transitions
* 📱 **Responsive UI** — Designed for different screen sizes

---

## 🛠️ Tech Stack

| Technology             | Purpose                       |
| ---------------------- | ----------------------------- |
| **React**              | User interface                |
| **Vite**               | Development and build tooling |
| **Tailwind CSS**       | Styling                       |
| **JavaScript**         | Application logic             |
| **React Router**       | Client-side routing           |
| **Axios**              | API communication             |
| **GSAP**               | Animations                    |
| **GSAP ScrollTrigger** | Scroll-based animations       |
| **Motion**             | UI animations                 |

---

## 📁 Project Structure

```text
frontend/
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
    ┌─────┼─────┐
    ▼     ▼     ▼
   Bug  Security Quality
  Agent   Agent   Agent
    │     │     │
    └─────┼─────┘
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

* Clean visual hierarchy
* Smooth page transitions
* Interactive animations
* Responsive layouts
* Clear review information
* Simple navigation
* Focused developer workflows

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd CodeLens/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API

Create a `.env` file if required by the project:

```env
VITE_API_URL=http://localhost:5000
```

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

## 🔌 Backend

The frontend is designed to work with the CodeLens application backend.

The backend handles:

* Authentication
* User accounts
* Review history
* GitHub repository processing
* Communication with the Python AI backend

The frontend communicates with these services through HTTP API requests.

---

## ⭐ Support

If you find **CodeLens** interesting or useful, consider giving the repository a **⭐ Star** on GitHub.

Your support helps the project gain visibility and motivates further development.

---

<p align="center">
  Built with ❤️ for developers who want better code.
</p>
