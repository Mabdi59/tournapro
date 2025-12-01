import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  tournamentAPI,
  teamAPI,
  divisionAPI,
  matchAPI,
  playerAPI,
} from '../../services/api';
import { useWebSocket } from '../../contexts/WebSocketContext';
import PlayerList from '../../components/player/PlayerList';
import PlayerStats from '../../components/player/PlayerStats';
import MatchScheduleForm from '../../components/match/MatchScheduleForm';
import TournamentBracket from '../../components/bracket/TournamentBracket';
import MatchCalendar from '../../components/calendar/MatchCalendar';
import ConnectionStatus from '../../components/websocket/ConnectionStatus';
import './Organizer.css';
import '../../components/match/Match.css';
import '../../components/calendar/Calendar.css';

function TournamentManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subscribe } = useWebSocket();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('teams');
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showDivisionForm, setShowDivisionForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [schedulingMatch, setSchedulingMatch] = useState(null);
  const [teamForm, setTeamForm] = useState({ name: '', description: '', divisionId: '' });
  const [divisionForm, setDivisionForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const loadTeams = async () => {
    try {
      const response = await teamAPI.getByTournament(id);
      setTeams(response.data);
    } catch {
      console.error('Failed to load teams');
    }
  };

  const loadDivisions = async () => {
    try {
      const response = await divisionAPI.getByTournament(id);
      setDivisions(response.data);
    } catch {
      console.error('Failed to load divisions');
    }
  };

  const loadMatches = async (divisionId) => {
    try {
      const response = await matchAPI.getByDivision(id, divisionId);
      setMatches(response.data);
    } catch {
      console.error('Failed to load matches');
    }
  };

  useEffect(() => {
    const loadTournament = async () => {
      try {
        const response = await tournamentAPI.getById(id);
        setTournament(response.data);
      } catch {
        setError('Failed to load tournament');
      }
    };

    loadTournament();
    loadTeams();
    loadDivisions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (selectedDivision) {
      loadMatches(selectedDivision);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDivision]);

  // WebSocket subscriptions for real-time updates
  useEffect(() => {
    const unsubscribeMatch = subscribe('matchUpdate', (payload) => {
      if (payload.tournamentId === parseInt(id)) {
        setMatches((prev) =>
          prev.map((match) =>
            match.id === payload.match.id ? { ...match, ...payload.match } : match
          )
        );
        toast.success('Match updated in real-time!');
      }
    });

    const unsubscribeTournament = subscribe('tournamentUpdate', (payload) => {
      if (payload.tournament.id === parseInt(id)) {
        setTournament((prev) => ({ ...prev, ...payload.tournament }));
        toast.success('Tournament updated!');
      }
    });

    const unsubscribeTeam = subscribe('teamUpdate', (payload) => {
      if (payload.tournamentId === parseInt(id)) {
        if (payload.action === 'created') {
          setTeams((prev) => [...prev, payload.team]);
        } else if (payload.action === 'updated') {
          setTeams((prev) =>
            prev.map((team) => (team.id === payload.team.id ? payload.team : team))
          );
        } else if (payload.action === 'deleted') {
          setTeams((prev) => prev.filter((team) => team.id !== payload.teamId));
        }
      }
    });

    const unsubscribePlayer = subscribe('playerUpdate', (payload) => {
      if (selectedTeam && payload.teamId === selectedTeam) {
        reloadPlayers();
      }
    });

    const unsubscribeRegistration = subscribe('registrationUpdate', (payload) => {
      if (payload.tournamentId === parseInt(id)) {
        toast.success(`New registration: ${payload.teamName}`);
        loadTeams();
      }
    });

    return () => {
      unsubscribeMatch();
      unsubscribeTournament();
      unsubscribeTeam();
      unsubscribePlayer();
      unsubscribeRegistration();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedTeam]);

  const reloadPlayers = async () => {
    if (selectedTeam) {
      try {
        const response = await playerAPI.getByTeam(selectedTeam);
        setPlayers(response.data);
      } catch {
        console.error('Failed to load players');
      }
    }
  };

  useEffect(() => {
    const loadPlayers = async (teamId) => {
      try {
        const response = await playerAPI.getByTeam(teamId);
        setPlayers(response.data);
      } catch {
        console.error('Failed to load players');
      }
    };

    if (selectedTeam) {
      loadPlayers(selectedTeam);
    }
  }, [selectedTeam]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating team...');
    try {
      await teamAPI.create(id, teamForm);
      setTeamForm({ name: '', description: '', divisionId: '' });
      setShowTeamForm(false);
      loadTeams();
      toast.success('Team created successfully!', { id: loadingToast });
    } catch {
      const errorMessage = 'Failed to create team';
      setError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const handleCreateDivision = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating division...');
    try {
      await divisionAPI.create(id, divisionForm);
      setDivisionForm({ name: '', description: '' });
      setShowDivisionForm(false);
      loadDivisions();
      toast.success('Division created successfully!', { id: loadingToast });
    } catch {
      const errorMessage = 'Failed to create division';
      setError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const handleDeleteTeam = async (teamId) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span>Are you sure you want to delete this team?</span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Deleting team...');
              try {
                await teamAPI.delete(id, teamId);
                loadTeams();
                toast.success('Team deleted successfully!', { id: loadingToast });
              } catch {
                const errorMessage = 'Failed to delete team';
                setError(errorMessage);
                toast.error(errorMessage, { id: loadingToast });
              }
            }}
            className="btn btn-danger"
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Delete
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

  const handleDeleteDivision = async (divisionId) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span>Are you sure you want to delete this division?</span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Deleting division...');
              try {
                await divisionAPI.delete(id, divisionId);
                loadDivisions();
                toast.success('Division deleted successfully!', { id: loadingToast });
              } catch {
                const errorMessage = 'Failed to delete division';
                setError(errorMessage);
                toast.error(errorMessage, { id: loadingToast });
              }
            }}
            className="btn btn-danger"
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Delete
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

  const handleGenerateSchedule = async (divisionId) => {
    const loadingToast = toast.loading('Generating schedule...');
    try {
      await tournamentAPI.generateSchedule(id, divisionId);
      loadMatches(divisionId);
      toast.success('Schedule generated successfully!', { id: loadingToast });
    } catch {
      const errorMessage = 'Failed to generate schedule';
      setError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const handleUpdateMatchResult = async (matchId, team1Score, team2Score) => {
    const loadingToast = toast.loading('Updating match result...');
    try {
      await matchAPI.updateResult(id, matchId, { team1Score, team2Score });
      loadMatches(selectedDivision);
      loadTeams();
      toast.success('Match result updated successfully!', { id: loadingToast });
    } catch {
      const errorMessage = 'Failed to update match result';
      setError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const handleScheduleMatch = (match) => {
    setSchedulingMatch(match);
    setShowScheduleForm(true);
  };

  const handleScheduleSave = async () => {
    await loadMatches(selectedDivision);
    setShowScheduleForm(false);
    setSchedulingMatch(null);
  };

  const handleStatusChange = async (newStatus) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span>Are you sure you want to change the tournament status to {newStatus}?</span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Updating tournament status...');
              try {
                await tournamentAPI.update(id, { ...tournament, status: newStatus });
                setTournament({ ...tournament, status: newStatus });
                toast.success('Tournament status updated successfully!', { id: loadingToast });
              } catch {
                const errorMessage = 'Failed to update tournament status';
                setError(errorMessage);
                toast.error(errorMessage, { id: loadingToast });
              }
            }}
            className="btn btn-primary"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="btn btn-secondary"
          >
            No
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (!tournament) return <div className="container">Loading...</div>;

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

  return (
    <div className="container">
      <div className="tournament-details">
        <div className="tournament-header">
          <div>
            <h1>{tournament.name}</h1>
            <span className={`status-badge ${getStatusBadgeClass(tournament.status)}`}>
              {getStatusDisplay(tournament.status)}
            </span>
          </div>
          <ConnectionStatus />
        </div>
        <p>{tournament.description}</p>
        <p>📍 {tournament.location}</p>
        <p>📅 {new Date(tournament.startDate).toLocaleDateString()}</p>
        <p>Format: {tournament.format}</p>
        <div className="tournament-actions">
          <button
            onClick={() => navigate(`/tournaments/edit/${id}`)}
            className="btn btn-primary"
          >
            Edit Tournament
          </button>
          
          {tournament.status === 'UPCOMING' && (
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              className="btn btn-success"
            >
              🚀 Start Tournament
            </button>
          )}
          
          {tournament.status === 'IN_PROGRESS' && (
            <button
              onClick={() => handleStatusChange('COMPLETED')}
              className="btn btn-success"
            >
              ✅ Mark as Complete
            </button>
          )}
          
          {(tournament.status === 'UPCOMING' || tournament.status === 'IN_PROGRESS') && (
            <button
              onClick={() => handleStatusChange('CANCELLED')}
              className="btn btn-danger"
            >
              ❌ Cancel Tournament
            </button>
          )}
        </div>
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
          className={`tab ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          Players
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
        <button
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
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

      {activeTab === 'players' && (
        <div className="players-section">
          <div className="form-group">
            <label>Select Team</label>
            <select
              value={selectedTeam || ''}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">Choose a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTeam && (
            <PlayerList 
              teamId={selectedTeam} 
              players={players}
              onUpdate={reloadPlayers}
            />
          )}

          {!selectedTeam && teams.length > 0 && (
            <div className="empty-state">
              <p>Select a team to manage its players.</p>
            </div>
          )}
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
              {tournament.format === 'SINGLE_ELIMINATION' || tournament.format === 'DOUBLE_ELIMINATION' ? (
                <TournamentBracket 
                  matches={matches} 
                  onUpdateResult={handleUpdateMatchResult}
                  onScheduleMatch={handleScheduleMatch}
                />
              ) : (
                <MatchList 
                  matches={matches} 
                  onUpdateResult={handleUpdateMatchResult}
                  onScheduleMatch={handleScheduleMatch}
                />
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="stats-section">
          <PlayerStats tournamentId={id} />
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="calendar-section">
          <MatchCalendar
            matches={matches}
            onMatchClick={handleScheduleMatch}
          />
        </div>
      )}

      {showScheduleForm && schedulingMatch && (
        <MatchScheduleForm
          tournamentId={id}
          match={schedulingMatch}
          onClose={() => {
            setShowScheduleForm(false);
            setSchedulingMatch(null);
          }}
          onSave={handleScheduleSave}
        />
      )}
    </div>
  );
}

function MatchList({ matches, onUpdateResult, onScheduleMatch }) {
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

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {matches.map((match) => (
        <div 
          key={match.id} 
          className={`match-item ${match.scheduledTime ? 'scheduled' : ''}`}
        >
          <div className="match-header">
            <div className="match-teams">
              <strong>Round {match.round}:</strong> {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'}
            </div>
            <div>
              {match.scheduledTime ? (
                <span className="schedule-badge">
                  📅 Scheduled
                </span>
              ) : (
                <span className="schedule-badge unscheduled-badge">
                  ⏳ Not Scheduled
                </span>
              )}
            </div>
          </div>

          {match.scheduledTime && (
            <div className="match-schedule-info">
              <div className="schedule-time">
                🕐 {formatDateTime(match.scheduledTime)}
              </div>
              {match.venue && (
                <div className="schedule-venue">
                  📍 {match.venue}
                </div>
              )}
            </div>
          )}

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
              <div className="match-actions">
                <span className={`match-status ${match.status.toLowerCase()}`}>
                  {match.status}
                </span>
                {match.team1 && match.team2 && (
                  <>
                    <button
                      onClick={() => handleEdit(match)}
                      className="btn btn-primary"
                    >
                      {match.status === 'COMPLETED' ? 'Edit' : 'Enter Result'}
                    </button>
                    <button
                      onClick={() => onScheduleMatch(match)}
                      className="btn-schedule"
                    >
                      {match.scheduledTime ? 'Reschedule' : 'Schedule'}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TournamentManage;
