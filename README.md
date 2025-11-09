# TournaPro — Tournament Management Platform

TournaPro is a full‑stack tournament management application built with **React (Vite)**, **Spring Boot**, and **PostgreSQL**. It enables organizations to create, manage, and publish tournaments with automated scheduling, bracket generation, and real‑time score tracking.

---

## ⚙️ Tech Stack

### Frontend

* React 18 + Vite
* React Router DOM 6
* Zustand (state management)
* React Query (data fetching & caching)
* Tailwind CSS + shadcn‑style components (class‑variance‑authority, clsx, lucide‑react)
* Framer Motion (animations)

### Backend

* Java 17 (Spring Boot 3)
* PostgreSQL 15
* JDBC Template for data access
* JWT authentication with Spring Security
* Flyway / SQL‑based schema management

---

## 🚀 Features

* **Tournament Creation & Management** — Create organizations, tournaments, divisions, and teams.
* **Smart Scheduling** — Auto‑generate matches with rest time and venue constraints.
* **Bracket Generation** — Single elimination, double elimination, and round robin formats.
* **Live Scoring** — Real‑time updates for spectators and admins.
* **User Roles** — Admin, Referee, Coach, Player, and Viewer with role‑based access.
* **Secure Auth** — JWT‑based login, registration, and token refresh.
* **Payments (Planned)** — Stripe integration for team registration and fees.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tournapro.git
cd tournapro
```

### 2. Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

Runs the Spring Boot server on **[http://localhost:9000](http://localhost:9000)**.

#### Database Configuration

PostgreSQL must be running locally. Update your credentials in:

```
src/main/resources/application.properties
```

Create and initialize the database:

```bash
cd database
./create.sh
```

This runs schema, data, and user scripts to create the `tournapro` database.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access the app on **[http://localhost:5173](http://localhost:5173)**.

---

## 📁 Project Structure

### Backend

```
backend/
├── src/main/java/com/tournapro
│   ├── controller/
│   ├── dao/
│   ├── model/
│   ├── security/
│   ├── service/
│   └── config/
├── src/main/resources/
│   ├── application.properties
│   ├── schema.sql
│   └── data.sql
└── database/
    ├── create.sh
    ├── schema.sql
    ├── data.sql
    └── user.sql
```

### Frontend

```
frontend/
├── public/
│   ├── css/global.css
│   └── css/reset.css
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── styles/
│   └── App.jsx
└── .env
```

---

## 🧩 Environment Variables

**Frontend `.env`:**

```bash
VITE_REMOTE_API=http://localhost:9000
VITE_APP_NAME=TournaPro
```

**Backend `application.properties`:**

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tournapro
spring.datasource.username=tournapro_appuser
spring.datasource.password=tournapro
server.port=9000
```

---

## 🔒 Authentication Workflow

* Users register or log in via `/login` and `/register` endpoints.
* Backend issues a JWT token stored in localStorage.
* Protected routes on the frontend verify the token before rendering.
* Tokens auto‑refresh via `/refresh` endpoint.

---

## 🧠 Development Notes

* Port mapping:

  * **Backend:** 9000
  * **Frontend:** 5173
* CORS enabled for all frontend requests.
* Live reload via Spring Boot DevTools and Vite.

---

## 🧪 Testing

Backend tests are built with JUnit 5 and Spring Boot’s test runner.

```bash
./mvnw test
```

DAO integration tests rollback automatically between runs.

---

## 📦 Build & Deployment

### Frontend

```bash
npm run build
```

Output will be available in `/dist`.

### Backend

Package the Spring Boot application:

```bash
./mvnw package
```

JAR file output: `target/tournapro-backend.jar`

Run:

```bash
java -jar target/tournapro-backend.jar
```

---

## 🌍 Roadmap

* 🧩 Match analytics & reports
* 📱 Mobile‑friendly progressive web app (PWA)
* 💸 Stripe payments integration
* 📊 Admin dashboard with insights
* 🔔 Real‑time notifications (WebSockets)

---

## 👥 Contributors

Developed by the TournaPro team. Contributions welcome via pull requests.

---

**TournaPro** © 2025 — All rights reserved.
