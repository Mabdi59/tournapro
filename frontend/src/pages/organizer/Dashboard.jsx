import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentAPI } from '../../services/api';
import './Organizer.css';

function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadTournaments();
  }, []);

  useEffect(() => {
    filterTournaments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, tournaments]);

  const loadTournaments = async () => {
    try {
      const response = await tournamentAPI.getMy();
      setTournaments(response.data);
      setFilteredTournaments(response.data);
    } catch {
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const filterTournaments = () => {
    let filtered = tournaments;

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTournaments(filtered);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'status-upcoming';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'UPCOMING':
        return '📅 Upcoming';
      case 'IN_PROGRESS':
        return '🔥 In Progress';
      case 'COMPLETED':
        return '✅ Completed';
      case 'CANCELLED':
        return '❌ Cancelled';
      default:
        return status;
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

      {tournaments.length > 0 && (
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-box">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Tournaments</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      )}

      {tournaments.length === 0 ? (
        <div className="card">
          <p>You haven't created any tournaments yet.</p>
          <Link to="/tournaments/new" className="btn btn-primary">
            Create Your First Tournament
          </Link>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="card">
          <p>No tournaments found matching your search.</p>
        </div>
      ) : (
        <div className="tournaments-grid">
          {filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="card tournament-card">
              <div className="card-header">
                <h3>{tournament.name}</h3>
                <span className={`status-badge ${getStatusBadgeClass(tournament.status)}`}>
                  {getStatusDisplay(tournament.status)}
                </span>
              </div>
              <p className="tournament-location">📍 {tournament.location}</p>
              <p className="tournament-date">
                📅 {new Date(tournament.startDate).toLocaleDateString()}
              </p>
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
