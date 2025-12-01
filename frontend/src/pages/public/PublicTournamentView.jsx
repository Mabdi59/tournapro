import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { publicAPI } from '../../services/api';
import './Public.css';

function PublicTournamentView() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('teams');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tournamentRes, teamsRes, divisionsRes] = await Promise.all([
          publicAPI.getTournament(id),
          publicAPI.getTeams(id),
          publicAPI.getDivisions(id),
        ]);
        setTournament(tournamentRes.data);
        setTeams(teamsRes.data);
        setDivisions(divisionsRes.data);
        if (divisionsRes.data.length > 0) {
          setSelectedDivision(divisionsRes.data[0].id);
        }
      } catch {
        console.error('Failed to load tournament data');
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    const loadMatches = async (divisionId) => {
      try {
        const response = await publicAPI.getMatches(divisionId);
        setMatches(response.data);
      } catch {
        console.error('Failed to load matches');
      }
    };

    if (selectedDivision) {
      loadMatches(selectedDivision);
    }
  }, [selectedDivision]);

  if (!tournament) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="tournament-header">
        <h1>{tournament.name}</h1>
        <p className="tournament-description">{tournament.description}</p>
        <div className="tournament-info">
          <p>📍 {tournament.location}</p>
          <p>📅 {new Date(tournament.startDate).toLocaleDateString()}</p>
          <p>🏆 Format: {tournament.format}</p>
          <p>Status: <span className="status-badge">{tournament.status}</span></p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          Teams ({teams.length})
        </button>
        <button
          className={`tab ${activeTab === 'standings' ? 'active' : ''}`}
          onClick={() => setActiveTab('standings')}
        >
          Standings
        </button>
        <button
          className={`tab ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          Matches
        </button>
      </div>

      {activeTab === 'teams' && (
        <div className="teams-grid">
          {teams.map((team) => (
            <div key={team.id} className="card team-card">
              <h3>{team.name}</h3>
              {team.description && <p>{team.description}</p>}
              <div className="team-record">
                <span>Record: {team.wins}W - {team.losses}L - {team.draws}D</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'standings' && (
        <div className="standings-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Draws</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {teams
                .sort((a, b) => b.points - a.points)
                .map((team, index) => (
                  <tr key={team.id}>
                    <td>{index + 1}</td>
                    <td>{team.name}</td>
                    <td>{team.wins}</td>
                    <td>{team.losses}</td>
                    <td>{team.draws}</td>
                    <td>{team.points}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'matches' && (
        <div>
          {divisions.length > 0 && (
            <div className="form-group">
              <label>Division</label>
              <select
                value={selectedDivision || ''}
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                {divisions.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {tournament.format === 'SINGLE_ELIMINATION' ? (
            <BracketView matches={matches} />
          ) : (
            <MatchList matches={matches} />
          )}
        </div>
      )}
    </div>
  );
}

function MatchList({ matches }) {
  return (
    <div className="matches-list">
      {matches.map((match) => (
        <div key={match.id} className="match-card">
          <div className="match-round">Round {match.round}</div>
          <div className="match-teams">
            <div className="team-name">{match.team1?.name || 'TBD'}</div>
            <div className="match-score">
              {match.team1Score !== null && match.team2Score !== null
                ? `${match.team1Score} - ${match.team2Score}`
                : 'vs'}
            </div>
            <div className="team-name">{match.team2?.name || 'TBD'}</div>
          </div>
          <div className={`match-status ${match.status.toLowerCase()}`}>
            {match.status}
          </div>
        </div>
      ))}
    </div>
  );
}

function BracketView({ matches }) {
  const rounds = {};
  matches.forEach((match) => {
    if (!rounds[match.round]) rounds[match.round] = [];
    rounds[match.round].push(match);
  });

  return (
    <div className="bracket">
      {Object.keys(rounds)
        .sort((a, b) => a - b)
        .map((round) => (
          <div key={round} className="bracket-round">
            <h4>Round {round}</h4>
            {rounds[round].map((match) => (
              <div key={match.id} className="bracket-match">
                <div className={`bracket-team ${match.winner?.id === match.team1?.id ? 'winner' : ''}`}>
                  {match.team1?.name || 'TBD'}
                  {match.team1Score !== null ? ` (${match.team1Score})` : ''}
                </div>
                <div className={`bracket-team ${match.winner?.id === match.team2?.id ? 'winner' : ''}`}>
                  {match.team2?.name || 'TBD'}
                  {match.team2Score !== null ? ` (${match.team2Score})` : ''}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

export default PublicTournamentView;
