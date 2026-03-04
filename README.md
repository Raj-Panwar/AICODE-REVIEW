# ai-code-review-platform

An advanced, full-stack AI-powered code review application that analyzes code snippets to identify bugs, highlight security vulnerabilities, and suggest architectural improvements using the Google Gemini AI.

## 🚀 Key Features

*   **Intelligent Code Analysis**: Uses Google's Gemini 2.5 Flash model for deep code inspection.
*   **Premium User Interface**: A highly polished, modern, dark-mode glassmorphism UI with smooth micro-animations.
*   **Secure Authentication**: Role-based access control with stateless JSON Web Tokens (JWT). Users can log in safely using either their username or email address.
*   **Multi-Language Support**: Native editor support for analyzing Java, Python, JavaScript, TypeScript, C++, Go, Rust, Kotlin, and PHP.
*   **Interactive Code Editor**: Integrated Monaco Editor (the engine behind VS Code) directly in the browser.
*   **Review History Tracking**: Stores all past AI reviews in a PostgreSQL database for easy tracking over time.

---

## 🛠️ Technology Stack

**Frontend**
*   **React 18** (via Vite)
*   **Axios** (API & Interceptors)
*   **React Router v6** (Protected Navigation Guards)
*   **Monaco Editor** (Browser-based code editing)
*   **Tailwind CSS / Vanilla CSS** (Custom Design System with CSS variables and Glassmorphism effects)

**Backend**
*   **Java 17** & **Spring Boot 3.4.3**
*   **Spring Security** & **JWT** (Authentication & Authorization)
*   **Spring Data JPA** & **Hibernate** (ORM)
*   **PostgreSQL** (Relational Database)
*   **Maven** (Dependency Management)

---

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
*   [Java Development Kit (JDK) 17+](https://adoptium.net/) installed.
*   [Node.js (LTS)](https://nodejs.org/en/) & npm installed.
*   [PostgreSQL](https://www.postgresql.org/) database installed and running locally on port `5432`.
*   A Google Gemini API Key.

---

## 🚦 Getting Started

### 1. Database Setup
Create a local PostgreSQL database named `aicodereviewer`:
```sql
CREATE DATABASE aicodereviewer;
```
Ensure your local Postgres instance has a user `postgres` with the password `root`. If your setup differs, update the `application.properties` file in the backend.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Update the `application.properties` file (`src/main/resources/application.properties`) with your API Key:
   ```properties
   gemini.api.key=YOUR_GEMINI_API_KEY
   ```
3. Run the Spring Boot application (this auto-creates the database tables):
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

---

## 🔒 API Endpoints

**Authentication (`/api/auth`)**
*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Authenticate and receive JWT

**Code Review (`/api/review`)** (Requires `Bearer Token`)
*   `POST /api/review/code` - Submit code snippet for AI analysis
*   `GET /api/review/history` - Retrieve user's past code reviews
*   `GET /api/review/{id}` - Fetch details of a specific review

---

## 🎨 UI Aesthetics
This project places a heavy emphasis on design. The styling system uses sophisticated dark themes, subtle gradient glows, and standard OS-style window framing for the best possible user experience. All styles are defined natively in `index.css`.
