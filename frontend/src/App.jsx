import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { TournamentProvider } from './contexts/TournamentContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/public/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ManagePage from './pages/organizer/ManagePage';
import AccountSettingsPage from './pages/organizer/AccountSettingsPage';
import NewTournamentWizard from './pages/organizer/NewTournamentWizard';
import TournamentTeamsPage from './pages/organizer/TournamentTeamsPage';
import TournamentFormatPage from './pages/organizer/TournamentFormatPage';

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Main organizer home - Tournify style */}
        <Route 
          path="/manage" 
          element={
            <ProtectedRoute>
              <ManagePage />
            </ProtectedRoute>
          } 
        />
        
        {/* New Tournament Wizard */}
        <Route
          path="/manage/new"
          element={
            <ProtectedRoute>
              <NewTournamentWizard />
            </ProtectedRoute>
          }
        />
        
        {/* Tournament Teams Page */}
        <Route
          path="/manage/tournament/:tournamentId/teams"
          element={
            <ProtectedRoute>
              <TournamentTeamsPage />
            </ProtectedRoute>
          }
        />
        
        {/* Tournament Format Page */}
        <Route
          path="/manage/tournament/:tournamentId/format"
          element={
            <ProtectedRoute>
              <TournamentFormatPage />
            </ProtectedRoute>
          }
        />
        
        {/* Account Settings */}
        <Route
          path="/manage/account"
          element={
            <ProtectedRoute>
              <AccountSettingsPage />
            </ProtectedRoute>
          }
        />
        
        {/* /dashboard redirects to /manage */}
        <Route path="/dashboard" element={<Navigate to="/manage" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <TournamentProvider>
          <WebSocketProvider>
            <AppContent />
          </WebSocketProvider>
        </TournamentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
