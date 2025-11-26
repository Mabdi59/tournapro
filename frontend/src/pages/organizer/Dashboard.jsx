import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentAPI } from '../../services/api';
import './Organizer.css';

function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const response = await tournamentAPI.getMy();
      setTournaments(response.data);
    } catch (err) {
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>My Tournaments</h1>
        <Link to="/tournaments/new" className="btn btn-primary">
          Create Tournament
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tournaments.length === 0 ? (
        <div className="card">
          <p>You haven't created any tournaments yet.</p>
          <Link to="/tournaments/new" className="btn btn-primary">
            Create Your First Tournament
          </Link>
        </div>
      ) : (
        <div className="tournaments-grid">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="card tournament-card">
              <h3>{tournament.name}</h3>
              <p className="tournament-location">📍 {tournament.location}</p>
              <p className="tournament-date">
                📅 {new Date(tournament.startDate).toLocaleDateString()}
              </p>
              <p className="tournament-status">Status: {tournament.status}</p>
              <p className="tournament-format">Format: {tournament.format}</p>
              <Link
                to={`/tournaments/${tournament.id}`}
                className="btn btn-primary"
              >
                Manage
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
