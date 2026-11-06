# AI Code Reviewer 🚀

An AI-powered code review platform that helps developers identify bugs, detect security vulnerabilities, understand code complexity, and improve code quality through intelligent analysis.

<p align="center">
  **Built with React, Spring Boot, Java, and Groq AI**
</p>

## ✨ Features

- **AI-Powered Code Review:** Analyze code using Groq AI and receive structured feedback.
- **Bug Detection:** Identify potential runtime errors, logical mistakes, and coding issues.
- **Security Analysis:** Detect potential vulnerabilities, including SQL injection and insecure coding practices.
- **Code Quality Scoring:** Get an overall score representing code quality.
- **Time & Space Complexity:** Analyze current complexity and receive optimization suggestions.
- **Optimization Recommendations:** Get actionable suggestions to improve code efficiency and readability.
- **Multiple Language Support:** Review code across supported programming languages.
- **Review History:** Access previously submitted code reviews.
- **Structured Feedback:** View issues with severity, category, descriptions, and suggested fixes.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Code Editor | Monaco Editor |
| Backend | Java, Spring Boot |
| Database | MySQL |
| AI Integration | Groq API |
| Authentication | Spring Security, JWT |
| Build Tool | Maven |
| API Communication | REST APIs |

## 🏗️ Project Architecture

```text
AI-Code-Reviewer/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
├── package-lock.json
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Java JDK 24
- Maven (or use the included Maven Wrapper)
- Node.js and npm
- MySQL 8+
- A Groq API key

### 1. Clone the repository

```bash
git clone https://github.com/Raj-Panwar/AICODE-REVIEW.git
cd AICODE-REVIEW
```

### 2. Configure the Backend

Navigate to the backend:

```bash
cd backend
```

Configure the following environment variables:

| Variable | Description |
|---|---|
| `DB_PASSWORD` | MySQL database password |
| `JWT_SECRET` | JWT signing secret |
| `GROQ_API_KEY` | Groq API key |

Also configure your database URL and username in `application.properties`.

### 3. Start the Backend

From the `backend` directory:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### 4. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend at:

```text
http://localhost:5173
```

## 🔍 How It Works

1. Write or paste code into the integrated code editor.
2. Select the programming language.
3. Submit the code for analysis.
4. The backend processes the request and communicates with Groq AI.
5. The AI generates structured review results.
6. Explore the code quality score, detected issues, security concerns, complexity analysis, and optimization recommendations.
7. Access previous reviews through review history.

## 📊 AI Review Capabilities

| Analysis | Output |
|---|---|
| Code Quality | Overall score and rating |
| Bug Detection | Issue descriptions and severity |
| Security | Potential vulnerability identification |
| Time Complexity | Current and suggested complexity |
| Space Complexity | Current and suggested complexity |
| Optimization | Actionable improvement suggestions |

*AI-generated findings are recommendations and should be validated by developers before applying them.*

## 🔐 Security

- API keys and sensitive credentials should be supplied through environment variables.
- JWT-based authentication protects authenticated endpoints.
- Database credentials should never be committed to version control.

## 🚀 Future Improvements

- More accurate static and dynamic code analysis.
- Support for additional programming languages.
- Improved code optimization recommendations.
- Automated test-case generation.
- More detailed review reports and analytics.

## 👨‍💻 Author

**Raj Panwar**

- GitHub: [@Raj-Panwar](https://github.com/Raj-Panwar)
- Project: [AI Code Reviewer](https://github.com/Raj-Panwar/AICODE-REVIEW)

## 🙏 Acknowledgements

This project builds upon an existing AI Code Review Platform. The current version includes modifications and additional functionality, including Groq integration, structured AI reviews, and complexity analysis.

Original project: [ai-code-review-platform](https://github.com/storm309/ai-code-review-platform)

---

⭐ If you find this project useful, consider giving it a star!

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
