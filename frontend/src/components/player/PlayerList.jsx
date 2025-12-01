import { useState } from 'react';
import toast from 'react-hot-toast';
import { playerAPI } from '../../services/api';
import PlayerForm from './PlayerForm';
import './Player.css';

function PlayerList({ teamId, players, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setShowForm(true);
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleDeletePlayer = (player) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span>Remove {player.name} from the team?</span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Removing player...');
              try {
                await playerAPI.delete(player.id);
                toast.success('Player removed successfully!', { id: loadingToast });
                onUpdate();
              } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to remove player';
                toast.error(errorMessage, { id: loadingToast });
              }
            }}
            className="btn btn-danger"
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Remove
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPlayer(null);
    onUpdate();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPlayer(null);
  };

  return (
    <div className="player-list">
      <div className="player-list-header">
        <h3>Team Roster ({players.length} players)</h3>
        <button onClick={handleAddPlayer} className="btn btn-primary">
          + Add Player
        </button>
      </div>

      {players.length === 0 ? (
        <div className="empty-state">
          <p>No players added yet.</p>
          <button onClick={handleAddPlayer} className="btn btn-primary">
            Add Your First Player
          </button>
        </div>
      ) : (
        <div className="players-grid">
          {players.map((player) => (
            <div key={player.id} className="player-card">
              <div className="player-card-header">
                {player.jerseyNumber && (
                  <div className="jersey-number">#{player.jerseyNumber}</div>
                )}
                <div className="player-name">{player.name}</div>
                {player.position && (
                  <div className="player-position">{player.position}</div>
                )}
              </div>

              <div className="player-stats">
                <div className="stat-item">
                  <span className="stat-label">Games</span>
                  <span className="stat-value">{player.gamesPlayed || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Goals</span>
                  <span className="stat-value">{player.goals || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Assists</span>
                  <span className="stat-value">{player.assists || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Points</span>
                  <span className="stat-value">{player.points || 0}</span>
                </div>
              </div>

              {(player.yellowCards > 0 || player.redCards > 0) && (
                <div className="player-cards">
                  {player.yellowCards > 0 && (
                    <span className="card-badge yellow">🟨 {player.yellowCards}</span>
                  )}
                  {player.redCards > 0 && (
                    <span className="card-badge red">🟥 {player.redCards}</span>
                  )}
                </div>
              )}

              {(player.email || player.phoneNumber) && (
                <div className="player-contact">
                  {player.email && <div className="contact-item">📧 {player.email}</div>}
                  {player.phoneNumber && <div className="contact-item">📱 {player.phoneNumber}</div>}
                </div>
              )}

              <div className="player-actions">
                <button
                  onClick={() => handleEditPlayer(player)}
                  className="btn btn-secondary btn-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePlayer(player)}
                  className="btn btn-danger btn-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PlayerForm
          teamId={teamId}
          existingPlayer={editingPlayer}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}

export default PlayerList;
