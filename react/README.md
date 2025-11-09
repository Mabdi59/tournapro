# TournaPro React Frontend Starter

This is the React starter project for the **TournaPro** platform. It provides the base setup for routing, authentication, and layout management. This document explains how to set up and run the project locally.

---

## Project setup

Install all dependencies:

```bash
npm install
```

Then open the `.env` file located at the project root. This file contains environment variables used throughout the app. It should look like this:

```bash
VITE_REMOTE_API=http://localhost:9000
```

> The backend service (Spring Boot) runs on port `9000`.

To start the development server:

```bash
npm run dev
```

---

## Application styling

Global styles are located in:

* `public/css/global.css`
* `public/css/reset.css`

You can freely modify these files or replace them entirely with your own styling framework. TournaPro uses **Tailwind CSS** and **shadcn/ui** for component styling and theming.

---

## Project structure

```
src/
├── api/                 # Services for API calls
├── assets/              # Static assets
├── components/          # Shared UI components
├── context/             # React contexts (UserContext, ThemeContext, etc.)
├── hooks/               # Custom hooks
├── pages/               # Page components for routes
├── routes/              # App route definitions
├── styles/              # Additional CSS or Tailwind config
└── App.jsx              # Root app component
```

---

## Authentication

When you first run the project and open the app, you’ll start on the Home page (`/`). The left navigation bar provides access to the **Login** page. From there, you can either log in or register a new account.

Once logged in, the navigation updates with additional links such as **Profile** and **Logout**. Protected routes (like `/profile` or `/dashboard`) use the `<ProtectedRoute>` component to ensure only authenticated users can access them.

Authentication follows this structure:

* `src/context/UserContext.jsx` — Manages and provides user data globally.
* `src/App.jsx` —

  * Includes `handleLogin()` and `handleLogout()` functions for managing authentication.
  * Uses `useEffect()` to restore user sessions from `localStorage` when the app loads.
  * Wraps the app with `<UserContext.Provider>` so user data is available across components.

---

## Environment variables

All environment-specific variables are defined in the `.env` file. Example:

```bash
VITE_REMOTE_API=http://localhost:9000
VITE_APP_NAME=TournaPro
```

You can add additional variables for features like live updates or third-party integrations.

---

## Running in development

To start the local development environment:

```bash
npm run dev
```

This runs the Vite server on `http://localhost:5173` (default). The app will automatically connect to the backend running at `http://localhost:9000`.

---

## Next steps

* Replace placeholder pages with TournaPro sections: **Tournaments**, **Teams**, **Divisions**, **Venues**, **Schedule**, and **Brackets**.
* Integrate API calls using the configured `VITE_REMOTE_API`.
* Implement responsive design with Tailwind and dynamic theme switching.
* Expand `<ProtectedRoute>` logic for role-based access (Admin, Organizer, Referee, etc.).

---

**TournaPro Frontend Starter** — ready for local development and full integration with the backend API.
