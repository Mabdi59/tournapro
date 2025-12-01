import { useState } from 'react';
import toast from 'react-hot-toast';
import { matchAPI } from '../../services/api';
import './Match.css';

function MatchScheduleForm({ tournamentId, match, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    scheduledTime: match?.scheduledTime?.substring(0, 16) || '',
    venue: match?.venue || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading('Scheduling match...');

    try {
      const data = {
        scheduledTime: formData.scheduledTime ? new Date(formData.scheduledTime).toISOString() : null,
        venue: formData.venue || null,
      };
      
      await matchAPI.updateSchedule(tournamentId, match.id, data);
      toast.success('Match scheduled successfully!', { id: loadingToast });
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to schedule match';
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  return (
    <div className="match-schedule-modal">
      <div className="match-schedule-content">
        <h3>Schedule Match</h3>
        
        <div className="match-info">
          <div className="match-teams">
            <span className="team-name">{match.team1?.name || 'TBD'}</span>
            <span className="vs">vs</span>
            <span className="team-name">{match.team2?.name || 'TBD'}</span>
          </div>
          <div className="match-round">Round {match.round}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              className="datetime-input"
            />
            <small className="form-help">Leave empty if time is not yet determined</small>
          </div>

          <div className="form-group">
            <label>Venue / Location</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g., Main Stadium, Court 1, Field A"
              className="venue-input"
            />
            <small className="form-help">Physical location where match will be played</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Schedule Match
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MatchScheduleForm;
