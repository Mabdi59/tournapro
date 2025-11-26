import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  tournamentAPI,
  teamAPI,
  divisionAPI,
  matchAPI,
} from '../../services/api';
import './Organizer.css';

function TournamentManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('teams');
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showDivisionForm, setShowDivisionForm] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: '', description: '', divisionId: '' });
  const [divisionForm, setDivisionForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadTournament();
    loadTeams();
    loadDivisions();
  }, [id]);

  useEffect(() => {
    if (selectedDivision) {
      loadMatches(selectedDivision);
    }
  }, [selectedDivision]);

  const loadTournament = async () => {
    try {
      const response = await tournamentAPI.getById(id);
      setTournament(response.data);
    } catch (err) {
      setError('Failed to load tournament');
    }
  };

  const loadTeams = async () => {
    try {
      const response = await teamAPI.getByTournament(id);
      setTeams(response.data);
    } catch (err) {
      console.error('Failed to load teams', err);
    }
  };

  const loadDivisions = async () => {
    try {
      const response = await divisionAPI.getByTournament(id);
      setDivisions(response.data);
    } catch (err) {
      console.error('Failed to load divisions', err);
    }
  };

  const loadMatches = async (divisionId) => {
    try {
      const response = await matchAPI.getByDivision(id, divisionId);
      setMatches(response.data);
    } catch (err) {
      console.error('Failed to load matches', err);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await teamAPI.create(id, teamForm);
      setTeamForm({ name: '', description: '', divisionId: '' });
      setShowTeamForm(false);
      loadTeams();
    } catch (err) {
      setError('Failed to create team');
    }
  };

  const handleCreateDivision = async (e) => {
    e.preventDefault();
    try {
      await divisionAPI.create(id, divisionForm);
      setDivisionForm({ name: '', description: '' });
      setShowDivisionForm(false);
      loadDivisions();
    } catch (err) {
      setError('Failed to create division');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamAPI.delete(id, teamId);
        loadTeams();
      } catch (err) {
        setError('Failed to delete team');
      }
    }
  };

  const handleDeleteDivision = async (divisionId) => {
    if (window.confirm('Are you sure you want to delete this division?')) {
      try {
        await divisionAPI.delete(id, divisionId);
        loadDivisions();
      } catch (err) {
        setError('Failed to delete division');
      }
    }
  };

  const handleGenerateSchedule = async (divisionId) => {
    try {
      await tournamentAPI.generateSchedule(id, divisionId);
      loadMatches(divisionId);
      alert('Schedule generated successfully!');
    } catch (err) {
      setError('Failed to generate schedule');
    }
  };

  const handleUpdateMatchResult = async (matchId, team1Score, team2Score) => {
    try {
      await matchAPI.updateResult(id, matchId, { team1Score, team2Score });
      loadMatches(selectedDivision);
      loadTeams();
    } catch (err) {
      setError('Failed to update match result');
    }
  };

  if (!tournament) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="tournament-details">
        <h1>{tournament.name}</h1>
        <p>{tournament.description}</p>
        <p>📍 {tournament.location}</p>
        <p>📅 {new Date(tournament.startDate).toLocaleDateString()}</p>
        <p>Format: {tournament.format}</p>
        <button
          onClick={() => navigate(`/tournaments/edit/${id}`)}
          className="btn btn-primary"
        >
          Edit Tournament
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          Teams ({teams.length})
        </button>
        <button
          className={`tab ${activeTab === 'divisions' ? 'active' : ''}`}
          onClick={() => setActiveTab('divisions')}
        >
          Divisions ({divisions.length})
        </button>
        <button
          className={`tab ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          Matches
        </button>
      </div>

      {activeTab === 'teams' && (
        <div className="teams-list">
          <button
            onClick={() => setShowTeamForm(!showTeamForm)}
            className="btn btn-primary"
          >
            {showTeamForm ? 'Cancel' : 'Add Team'}
          </button>

          {showTeamForm && (
            <div className="card" style={{ marginTop: '20px' }}>
              <form onSubmit={handleCreateTeam}>
                <div className="form-group">
                  <label>Team Name *</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) =>
                      setTeamForm({ ...teamForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={teamForm.description}
                    onChange={(e) =>
                      setTeamForm({ ...teamForm, description: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Division</label>
                  <select
                    value={teamForm.divisionId}
                    onChange={(e) =>
                      setTeamForm({ ...teamForm, divisionId: e.target.value })
                    }
                  >
                    <option value="">No Division</option>
                    {divisions.map((div) => (
                      <option key={div.id} value={div.id}>
                        {div.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Create Team
                </button>
              </form>
            </div>
          )}

          {teams.map((team) => (
            <div key={team.id} className="team-item">
              <div>
                <h4>{team.name}</h4>
                <p>{team.description}</p>
                <div className="team-stats">
                  <span>Wins: {team.wins}</span>
                  <span>Losses: {team.losses}</span>
                  <span>Draws: {team.draws}</span>
                  <span>Points: {team.points}</span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTeam(team.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'divisions' && (
        <div className="divisions-list">
          <button
            onClick={() => setShowDivisionForm(!showDivisionForm)}
            className="btn btn-primary"
          >
            {showDivisionForm ? 'Cancel' : 'Add Division'}
          </button>

          {showDivisionForm && (
            <div className="card" style={{ marginTop: '20px' }}>
              <form onSubmit={handleCreateDivision}>
                <div className="form-group">
                  <label>Division Name *</label>
                  <input
                    type="text"
                    value={divisionForm.name}
                    onChange={(e) =>
                      setDivisionForm({ ...divisionForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={divisionForm.description}
                    onChange={(e) =>
                      setDivisionForm({
                        ...divisionForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Create Division
                </button>
              </form>
            </div>
          )}

          {divisions.map((division) => (
            <div key={division.id} className="division-item">
              <div>
                <h4>{division.name}</h4>
                <p>{division.description}</p>
              </div>
              <div>
                <button
                  onClick={() => handleGenerateSchedule(division.id)}
                  className="btn btn-primary"
                  style={{ marginRight: '10px' }}
                >
                  Generate Schedule
                </button>
                <button
                  onClick={() => handleDeleteDivision(division.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="matches-list">
          <div className="form-group">
            <label>Select Division</label>
            <select
              value={selectedDivision || ''}
              onChange={(e) => setSelectedDivision(e.target.value)}
            >
              <option value="">Choose a division</option>
              {divisions.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.name}
                </option>
              ))}
            </select>
          </div>

          {selectedDivision && (
            <>
              {tournament.format === 'SINGLE_ELIMINATION' ? (
                <BracketView matches={matches} onUpdateResult={handleUpdateMatchResult} />
              ) : (
                <MatchList matches={matches} onUpdateResult={handleUpdateMatchResult} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MatchList({ matches, onUpdateResult }) {
  const [editingMatch, setEditingMatch] = useState(null);
  const [scores, setScores] = useState({ team1Score: '', team2Score: '' });

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

  return (
    <div>
      {matches.map((match) => (
        <div key={match.id} className="match-item">
          <div className="match-teams">
            Round {match.round}: {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'}
          </div>
          {editingMatch === match.id ? (
            <div>
              <input
                type="number"
                value={scores.team1Score}
                onChange={(e) => setScores({ ...scores, team1Score: e.target.value })}
                style={{ width: '60px', marginRight: '5px' }}
              />
              -
              <input
                type="number"
                value={scores.team2Score}
                onChange={(e) => setScores({ ...scores, team2Score: e.target.value })}
                style={{ width: '60px', marginLeft: '5px' }}
              />
              <button onClick={() => handleSave(match.id)} className="btn btn-primary">
                Save
              </button>
              <button onClick={() => setEditingMatch(null)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="match-score">
                {match.team1Score !== null && match.team2Score !== null
                  ? `${match.team1Score} - ${match.team2Score}`
                  : '-'}
              </div>
              <div>
                <span className={`match-status ${match.status.toLowerCase()}`}>
                  {match.status}
                </span>
                {match.team1 && match.team2 && (
                  <button
                    onClick={() => handleEdit(match)}
                    className="btn btn-primary"
                    style={{ marginLeft: '10px' }}
                  >
                    {match.status === 'COMPLETED' ? 'Edit' : 'Enter Result'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function BracketView({ matches, onUpdateResult }) {
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
                  {match.team1?.name || 'TBD'} {match.team1Score !== null ? `(${match.team1Score})` : ''}
                </div>
                <div className={`bracket-team ${match.winner?.id === match.team2?.id ? 'winner' : ''}`}>
                  {match.team2?.name || 'TBD'} {match.team2Score !== null ? `(${match.team2Score})` : ''}
                </div>
                {match.team1 && match.team2 && match.status !== 'COMPLETED' && (
                  <button
                    onClick={() => {
                      const team1Score = prompt('Enter score for ' + match.team1.name);
                      const team2Score = prompt('Enter score for ' + match.team2.name);
                      if (team1Score !== null && team2Score !== null) {
                        onUpdateResult(match.id, parseInt(team1Score), parseInt(team2Score));
                      }
                    }}
                    className="btn btn-primary"
                    style={{ marginTop: '10px', width: '100%' }}
                  >
                    Enter Result
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

export default TournamentManage;
