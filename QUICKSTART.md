# TournaPro Quick Start Guide

Get TournaPro up and running in minutes!

## Option 1: Docker Compose (Easiest)

If you have Docker and Docker Compose installed:

```bash
# Clone the repository
git clone https://github.com/Mabdi59/tournapro.git
cd tournapro

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8080
```

That's it! The application should be running with a PostgreSQL database, backend API, and frontend web app.

## Option 2: Manual Setup

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 12+
- Maven 3.6+

### Step 1: Database Setup

```sql
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE tournapro;
\q
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Run the backend (will start on port 8080)
mvn spring-boot:run
```

**Environment Variables (Optional):**
```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/tournapro
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=your_password
export JWT_SECRET=your_secret_key
```

### Step 3: Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run the frontend (will start on port 5173)
npm run dev
```

### Step 4: Access the Application

Open your browser and go to:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## First Steps

1. **Register an Account**
   - Click "Register" on the homepage
   - Fill in username, email, password
   - Select role: ORGANIZER (to create tournaments)

2. **Create Your First Tournament**
   - After login, click "Create Tournament"
   - Enter tournament details
   - Choose format (Round Robin or Single Elimination)
   - Click "Create"

3. **Add Teams**
   - Open your tournament
   - Go to "Teams" tab
   - Click "Add Team"
   - Enter team name and details

4. **Create Divisions (Optional)**
   - Go to "Divisions" tab
   - Click "Add Division"
   - Assign teams to divisions

5. **Generate Schedule**
   - Select a division
   - Click "Generate Schedule"
   - Matches will be automatically created

6. **Enter Results**
   - Go to "Matches" tab
   - Click "Enter Result" on any match
   - Enter scores for both teams
   - Standings update automatically!

## Default Configuration

### Backend (application.properties)
- Server Port: 8080
- Database: PostgreSQL on localhost:5432
- Database Name: tournapro

### Frontend (.env)
- Dev Server Port: 5173 (Vite default)
- API Base URL: http://localhost:8080/api

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database credentials
- Ensure port 8080 is not in use

### Frontend won't start
- Run `npm install` to ensure all dependencies are installed
- Check if port 5173 is available
- Verify .env file exists with correct API URL

### Can't connect to backend from frontend
- Ensure backend is running on port 8080
- Check CORS configuration in SecurityConfig.java
- Verify API_BASE_URL in .env

### Database connection failed
- Confirm PostgreSQL is running
- Check database exists: `psql -U postgres -l`
- Verify credentials in application.properties

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub for bugs or questions

## Production Deployment

For production deployment:

```bash
# Build backend
cd backend
mvn clean package

# Build frontend
cd frontend
npm run build

# Deploy:
# - Backend JAR: backend/target/*.jar
# - Frontend static files: frontend/dist/
```

Or use Docker:
```bash
docker-compose up -d --build
```

Enjoy using TournaPro! 🏆
