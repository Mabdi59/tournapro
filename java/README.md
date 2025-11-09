# TournaPro — Java Backend & Database Starter

This guide walks you through setting up and running the TournaPro backend service. It covers the database scripts, Spring Boot configuration, security, controllers, and testing utilities.

---

## Database

Inside the `<project-root>/database/` directory, you'll find an executable Bash script (`.sh` file) and several SQL scripts (`.sql` files). These are used to build and rebuild a PostgreSQL database for TournaPro.

From a terminal session, run:

```bash
cd <project-root>/database/
./create.sh
```

This Bash script drops the existing database if necessary, creates a new database named `tournapro`, and runs the SQL scripts in the correct order.

Each SQL script has a specific purpose:

| File Name    | Description                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data.sql`   | Populates the database with static setup data and test/demo data. Update this for local demo content (for example, seed organizations, tournaments, and sample users). |
| `dropdb.sql` | Destroys the database so it can be recreated. It drops the database and associated users. No changes typically needed.                                                 |
| `schema.sql` | Creates all database objects such as tables and sequences. Extend/modify as TournaPro's schema evolves.                                                                |
| `user.sql`   | Creates the database application users and grants them appropriate privileges. No changes typically needed.                                                            |

### Database users

The database superuser—`postgres`—must only be used for administration, not by applications. Two database users are created for TournaPro:

| Username            | Description                                                                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tournapro_owner`   | Schema owner with full privileges to all objects within the `tournapro` schema and privileges to create new objects. Use this user for administrative work in tools like PGAdmin.                                             |
| `tournapro_appuser` | Application user used by the backend service. Granted `SELECT`, `INSERT`, `UPDATE`, and `DELETE` privileges for all tables and `SELECT` on all sequences. The application datasource is configured to connect with this user. |

> **Note:** If you change database names or usernames, update both the SQL scripts in `/database/` and the application properties described below.

---

## Spring Boot

The backend runs on port **9000** by default.

### Datasource

Datasource configuration is located in `src/main/resources/application.properties`. It connects to the PostgreSQL database using the `tournapro_appuser` account.

```properties
# datasource connection properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tournapro
spring.datasource.name=tournapro
spring.datasource.username=tournapro_appuser
spring.datasource.password=tournapro

# JPA / Hibernate (if using JPA)
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.open-in-view=false

# Server
server.port=9000
```

> If you rename the database or credentials, update the values above and the `/database/create.sh` script accordingly.

### Package structure & naming

All backend code lives under the base package: **`com.tournapro`**.

Recommended structure:

```
com.tournapro
├── controller
├── dao
├── model
├── security
├── service
└── config
```

### JdbcTemplate example

DAO classes use Spring's `JdbcTemplate`. Declare a field of type `JdbcTemplate` and add it as a constructor argument—Spring injects an instance automatically:

```java
package com.tournapro.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcUserDao implements UserDao {

    private final JdbcTemplate jdbcTemplate;

    public JdbcUserDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ... implement DAO methods
}
```

### CORS

Any controller accessed from the frontend client should allow cross-origin requests. Annotate those controllers with `@CrossOrigin` as needed:

```java
package com.tournapro.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class AuthenticationController {
    // ... endpoints for login/register
}
```

---

## Security

Security-related classes are located under `src/main/java/com/tournapro/security`. This includes JWT filters, token utilities, password encoding, and WebSecurity configuration. You typically won’t need to change this to get started, but it’s available for customization as your requirements evolve.

---

## Controllers

Controllers are located in the `com.tournapro.controller` package and expose endpoints for authentication and users.

### Authentication controller

`AuthenticationController` handles `/login` and `/register`. If you need to modify the registration fields, start here. The controller uses a DAO to read and write user records.

### User controller

`UserController` exposes `/api/users` and `/api/users/{id}` to retrieve all users or a specific user. The frontend uses these to validate and fetch user information after authentication.

> Over time, add domain-specific controllers such as `/api/orgs`, `/api/tournaments`, `/api/divisions`, `/api/teams`, and `/api/matches`.

---

## Testing

### DAO integration tests

Use a base test class to initialize a Datasource for testing and automatically roll back database changes between tests.

* `com.tournapro.dao.BaseDaoTest` — shared test setup (Datasource, transaction management)
* `com.tournapro.dao.JdbcUserDaoTest` — example DAO integration test

Testing notes:

* Tests run against an isolated copy of the real schema.
* The schema for tests is defined in `database/schema.sql`.
* Test data lives in `src/test/resources/test-data.sql`.

---

## Runbook (Quick Start)

1. **Create the database**

```bash
cd <project-root>/database
./create.sh
```

2. **Configure the app**

* Ensure `src/main/resources/application.properties` matches your local DB settings (see above).

3. **Run the backend**

```bash
./mvnw spring-boot:run
# or
mvn spring-boot:run
```

The API will be available at `http://localhost:9000`.

4. **Smoke test**

* `POST /login` and `POST /register` should respond as expected.
* `GET /api/users/{id}` returns the authenticated user when provided a valid token.

---

## Next Steps

* Add initial domain tables (organizations, tournaments, divisions, teams, players, venues, surfaces, matches, assignments, audit logs) to `schema.sql`.
* Introduce `/api/orgs` and `/api/tournaments` endpoints.
* Wire JWT-protected routes for user profile and administration features.
* Add seed data for a demo tournament in `data.sql` for local development.
