import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../../services/api';
import './Public.css';

function PublicTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const response = await publicAPI.getTournaments();
      setTournaments(response.data);
    } catch (err) {
      console.error('Failed to load tournaments', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>All Tournaments</h1>
      {tournaments.length === 0 ? (
        <div className="card">
          <p>No tournaments available at the moment.</p>
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
                to={`/public/tournaments/${tournament.id}`}
                className="btn btn-primary"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicTournaments;
