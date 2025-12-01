import { useState } from 'react';
import './Bracket.css';

function TournamentBracket({ matches, onUpdateResult, onScheduleMatch }) {
  const [editingMatch, setEditingMatch] = useState(null);
  const [scores, setScores] = useState({ team1Score: '', team2Score: '' });

  // Organize matches by rounds
  const rounds = {};
  matches.forEach((match) => {
    if (!rounds[match.round]) rounds[match.round] = [];
    rounds[match.round].push(match);
  });

  const sortedRounds = Object.keys(rounds).sort((a, b) => a - b);
  const totalRounds = sortedRounds.length;

  const getRoundName = (roundNumber) => {
    const roundsFromEnd = totalRounds - roundNumber + 1;
    if (roundsFromEnd === 1) return 'Finals';
    if (roundsFromEnd === 2) return 'Semi-Finals';
    if (roundsFromEnd === 3) return 'Quarter-Finals';
    return `Round ${roundNumber}`;
  };

  const handleEdit = (match) => {
    setEditingMatch(match.id);
    setScores({
      team1Score: match.team1Score || '',
      team2Score: match.team2Score || '',
    });
  };

  const handleSave = (matchId) => {
    onUpdateResult(matchId, parseInt(scores.team1Score), parseInt(scores.team2Score));
    setEditingMatch(null);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return null;
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="tournament-bracket">
      <div className="bracket-container">
        {sortedRounds.map((roundNum) => (
          <div key={roundNum} className="bracket-round">
            <div className="round-header">
              <h3>{getRoundName(parseInt(roundNum))}</h3>
              <span className="round-count">{rounds[roundNum].length} matches</span>
            </div>
            <div className="round-matches">
              {rounds[roundNum].map((match) => (
                <div key={match.id} className="bracket-match-wrapper">
                  <div 
                    className={`bracket-match ${
                      match.status === 'COMPLETED' ? 'completed' : ''
                    } ${match.scheduledTime ? 'scheduled' : ''}`}
                  >
                    {/* Match Header with Schedule Info */}
                    {match.scheduledTime && (
                      <div className="match-schedule-header">
                        <span className="schedule-icon">📅</span>
                        <span className="schedule-time">{formatDateTime(match.scheduledTime)}</span>
                        {match.venue && <span className="schedule-venue">📍 {match.venue}</span>}
                      </div>
                    )}

                    {editingMatch === match.id ? (
                      // Edit Mode
                      <div className="bracket-edit-mode">
                        <div className="edit-team">
                          <span className="team-name">{match.team1?.name || 'TBD'}</span>
                          <input
                            type="number"
                            value={scores.team1Score}
                            onChange={(e) => setScores({ ...scores, team1Score: e.target.value })}
                            className="score-input"
                            min="0"
                          />
                        </div>
                        <div className="edit-team">
                          <span className="team-name">{match.team2?.name || 'TBD'}</span>
                          <input
                            type="number"
                            value={scores.team2Score}
                            onChange={(e) => setScores({ ...scores, team2Score: e.target.value })}
                            className="score-input"
                            min="0"
                          />
                        </div>
                        <div className="edit-actions">
                          <button onClick={() => handleSave(match.id)} className="btn-save">
                            💾 Save
                          </button>
                          <button onClick={() => setEditingMatch(null)} className="btn-cancel">
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <>
                        <div className={`match-team ${
                          match.winner?.id === match.team1?.id ? 'winner' : ''
                        } ${!match.team1 ? 'tbd' : ''}`}>
                          <div className="team-info">
                            <span className="team-name">{match.team1?.name || 'TBD'}</span>
                            {match.team1Score !== null && (
                              <span className="team-score">{match.team1Score}</span>
                            )}
                          </div>
                          {match.winner?.id === match.team1?.id && (
                            <span className="winner-icon">👑</span>
                          )}
                        </div>

                        <div className="match-divider">vs</div>

                        <div className={`match-team ${
                          match.winner?.id === match.team2?.id ? 'winner' : ''
                        } ${!match.team2 ? 'tbd' : ''}`}>
                          <div className="team-info">
                            <span className="team-name">{match.team2?.name || 'TBD'}</span>
                            {match.team2Score !== null && (
                              <span className="team-score">{match.team2Score}</span>
                            )}
                          </div>
                          {match.winner?.id === match.team2?.id && (
                            <span className="winner-icon">👑</span>
                          )}
                        </div>

                        {/* Match Actions */}
                        {match.team1 && match.team2 && (
                          <div className="bracket-match-actions">
                            {match.status !== 'COMPLETED' && (
                              <button
                                onClick={() => handleEdit(match)}
                                className="btn-enter-result"
                                title="Enter Result"
                              >
                                ⚡ Enter Result
                              </button>
                            )}
                            {match.status === 'COMPLETED' && (
                              <button
                                onClick={() => handleEdit(match)}
                                className="btn-edit-result"
                                title="Edit Result"
                              >
                                ✏️ Edit
                              </button>
                            )}
                            <button
                              onClick={() => onScheduleMatch(match)}
                              className="btn-schedule-small"
                              title={match.scheduledTime ? 'Reschedule' : 'Schedule'}
                            >
                              {match.scheduledTime ? '🔄' : '📅'}
                            </button>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="match-status-badge">
                          {match.status === 'COMPLETED' ? '✅' : 
                           match.status === 'IN_PROGRESS' ? '🔥' : '⏳'}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Connector Line */}
                  {parseInt(roundNum) < totalRounds && (
                    <div className="bracket-connector"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TournamentBracket;
