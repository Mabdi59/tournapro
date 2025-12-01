import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/organizer/Dashboard';
import TournamentForm from './pages/organizer/TournamentForm';
import TournamentManage from './pages/organizer/TournamentManage';
import PublicTournaments from './pages/public/PublicTournaments';
import PublicTournamentView from './pages/public/PublicTournamentView';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
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
          <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/public/tournaments" element={<PublicTournaments />} />
          <Route path="/public/tournaments/:id" element={<PublicTournamentView />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tournaments"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tournaments/new"
            element={
              <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                <TournamentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tournaments/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                <TournamentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tournaments/:id"
            element={
              <ProtectedRoute>
                <TournamentManage />
              </ProtectedRoute>
            }
          />
        </Routes>
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
