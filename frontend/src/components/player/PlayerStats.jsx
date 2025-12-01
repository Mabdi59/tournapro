import { useState, useEffect } from 'react';
import { playerAPI } from '../../services/api';
import './Player.css';

function PlayerStats({ tournamentId }) {
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopScorers = async () => {
      try {
        const response = await playerAPI.getTopScorers(tournamentId, 10);
        setTopScorers(response.data);
      } catch {
        console.error('Failed to load top scorers');
      } finally {
        setLoading(false);
      }
    };

    loadTopScorers();
  }, [tournamentId]);

  if (loading) {
    return <div className="container">Loading statistics...</div>;
  }

  return (
    <div className="player-stats-dashboard">
      <div className="stats-header">
        <h2>🏆 Top Scorers</h2>
      </div>

      {topScorers.length === 0 ? (
        <div className="empty-state">
          <p>No player statistics available yet.</p>
        </div>
      ) : (
        <div className="top-scorers-list">
          {topScorers.map((player, index) => (
            <div key={player.id} className="scorer-item">
              <div className={`scorer-rank ${index < 3 ? 'top' : ''}`}>
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `${index + 1}`}
              </div>
              
              <div className="scorer-info">
                <div className="scorer-name">
                  {player.name}
                  {player.jerseyNumber && ` #${player.jerseyNumber}`}
                </div>
                <div className="scorer-team">{player.teamName}</div>
              </div>

              <div className="scorer-stats">
                <div className="scorer-goals">
                  ⚽ {player.goals}
                </div>
                {player.assists > 0 && (
                  <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                    🎯 {player.assists} assists
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayerStats;
