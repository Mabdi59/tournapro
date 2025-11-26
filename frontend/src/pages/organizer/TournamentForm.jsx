import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tournamentAPI } from '../../services/api';
import './Organizer.css';

function TournamentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    format: 'ROUND_ROBIN',
  });
  const [error, setError] = useState('');
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      loadTournament();
    }
  }, [id]);

  const loadTournament = async () => {
    try {
      const response = await tournamentAPI.getById(id);
      const tournament = response.data;
      setFormData({
        name: tournament.name,
        description: tournament.description || '',
        startDate: tournament.startDate.substring(0, 16),
        endDate: tournament.endDate ? tournament.endDate.substring(0, 16) : '',
        location: tournament.location,
        format: tournament.format,
      });
    } catch (err) {
      setError('Failed to load tournament');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };
      if (isEdit) {
        await tournamentAPI.update(id, data);
      } else {
        await tournamentAPI.create(data);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save tournament');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>{isEdit ? 'Edit Tournament' : 'Create New Tournament'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tournament Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Format *</label>
            <select name="format" value={formData.format} onChange={handleChange}>
              <option value="ROUND_ROBIN">Round Robin</option>
              <option value="SINGLE_ELIMINATION">Single Elimination</option>
              <option value="DOUBLE_ELIMINATION">Double Elimination</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Update' : 'Create'} Tournament
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TournamentForm;
