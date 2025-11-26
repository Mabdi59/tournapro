# TournaPro - Tournament Management Platform

Full-stack tournament management application built with React + Vite frontend, Spring Boot backend, and PostgreSQL database.

## Features

- **User Authentication & Authorization**: JWT-based authentication with three role types (ORGANIZER, REFEREE, ADMIN)
- **Tournament Management**: Create and manage tournaments with customizable formats
- **Team Organization**: Add and manage teams within tournaments
- **Division Support**: Organize teams into divisions
- **Smart Scheduling**: 
  - Round-robin scheduling for league-style tournaments
  - Single-elimination bracket generation
- **Match Management**: 
  - Enter and update match results
  - Automatic standings calculation
  - Winner advancement in elimination brackets
- **Public Access**: Read-only tournament pages for public viewing
- **Real-time Updates**: Live tournament standings and results

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT authentication
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- React 18
- Vite
- React Router for navigation
- Axios for API calls
- CSS3 for styling

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher
- Maven 3.6+

## Setup Instructions

### Database Setup

1. Install PostgreSQL if not already installed
2. Create a database:
```sql
CREATE DATABASE tournapro;
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Configure database connection in `src/main/resources/application.properties` or use environment variables:
```properties
DATABASE_URL=jdbc:postgresql://localhost:5432/tournapro
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

3. Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the API URL in `.env` if needed:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

5. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

### Getting Started

1. **Register an Account**:
   - Visit the application
   - Click "Register"
   - Choose a role (ORGANIZER, REFEREE, or ADMIN)
   - Create your account

2. **Create a Tournament** (Organizers/Admins):
   - Log in to your account
   - Click "Create Tournament"
   - Fill in tournament details (name, location, dates, format)
   - Choose between Round-Robin or Single-Elimination format

3. **Add Teams**:
   - Open your tournament
   - Navigate to the Teams tab
   - Add teams to participate

4. **Create Divisions** (Optional):
   - Navigate to the Divisions tab
   - Create divisions to organize teams
   - Assign teams to divisions

5. **Generate Schedule**:
   - Select a division
   - Click "Generate Schedule"
   - The system will automatically create matches

6. **Enter Results** (Organizers/Referees/Admins):
   - Navigate to the Matches tab
   - Select a division
   - Click "Enter Result" on any match
   - Enter scores for both teams
   - Standings will update automatically

7. **Public Viewing**:
   - Anyone can browse tournaments at `/public/tournaments`
   - View live standings, teams, and match results
   - No login required

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tournaments
- `GET /api/tournaments` - Get all tournaments (authenticated)
- `GET /api/tournaments/{id}` - Get tournament by ID
- `POST /api/tournaments` - Create tournament (ORGANIZER/ADMIN)
- `PUT /api/tournaments/{id}` - Update tournament (ORGANIZER/ADMIN)
- `DELETE /api/tournaments/{id}` - Delete tournament (ORGANIZER/ADMIN)
- `POST /api/tournaments/{tournamentId}/divisions/{divisionId}/generate-schedule` - Generate schedule

### Teams
- `GET /api/tournaments/{tournamentId}/teams` - Get teams by tournament
- `POST /api/tournaments/{tournamentId}/teams` - Create team (ORGANIZER/ADMIN)
- `PUT /api/tournaments/{tournamentId}/teams/{id}` - Update team
- `DELETE /api/tournaments/{tournamentId}/teams/{id}` - Delete team

### Divisions
- `GET /api/tournaments/{tournamentId}/divisions` - Get divisions by tournament
- `POST /api/tournaments/{tournamentId}/divisions` - Create division (ORGANIZER/ADMIN)
- `PUT /api/tournaments/{tournamentId}/divisions/{id}` - Update division
- `DELETE /api/tournaments/{tournamentId}/divisions/{id}` - Delete division

### Matches
- `GET /api/tournaments/{tournamentId}/divisions/{divisionId}/matches` - Get matches by division
- `PUT /api/tournaments/{tournamentId}/matches/{id}/result` - Update match result (REFEREE/ORGANIZER/ADMIN)

### Public API
- `GET /api/public/tournaments` - Browse all tournaments
- `GET /api/public/tournaments/{id}` - View tournament details
- `GET /api/public/tournaments/{tournamentId}/teams` - View teams
- `GET /api/public/tournaments/{tournamentId}/divisions` - View divisions
- `GET /api/public/divisions/{divisionId}/matches` - View matches

## User Roles

- **ORGANIZER**: Can create and manage their own tournaments, teams, divisions, and matches
- **REFEREE**: Can enter and update match results
- **ADMIN**: Full access to all features

## Development

### Running Tests
```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test
```

### Building for Production

#### Backend
```bash
cd backend
mvn clean package
java -jar target/tournapro-backend-1.0.0.jar
```

#### Frontend
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your web server
```

## Project Structure

```
tournapro/
├── backend/
│   ├── src/main/java/com/tournapro/
│   │   ├── config/          # Security and CORS configuration
│   │   ├── controller/      # REST API controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── security/        # JWT utilities and filters
│   │   └── service/         # Business logic
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── contexts/        # React contexts
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    └── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
