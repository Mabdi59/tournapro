import { useState } from 'react';
import toast from 'react-hot-toast';
import { playerAPI } from '../../services/api';
import './Player.css';

function PlayerForm({ teamId, onSuccess, onCancel, existingPlayer = null }) {
  const [formData, setFormData] = useState({
    name: existingPlayer?.name || '',
    jerseyNumber: existingPlayer?.jerseyNumber || '',
    position: existingPlayer?.position || '',
    email: existingPlayer?.email || '',
    phoneNumber: existingPlayer?.phoneNumber || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading(
      existingPlayer ? 'Updating player...' : 'Adding player...'
    );

    try {
      if (existingPlayer) {
        await playerAPI.update(existingPlayer.id, formData);
        toast.success('Player updated successfully!', { id: loadingToast });
      } else {
        await playerAPI.create(teamId, formData);
        toast.success('Player added successfully!', { id: loadingToast });
      }
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        `Failed to ${existingPlayer ? 'update' : 'add'} player`;
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  return (
    <div className="player-form-modal">
      <div className="player-form-content">
        <h3>{existingPlayer ? 'Edit Player' : 'Add New Player'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Player Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter player name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Jersey Number</label>
              <input
                type="number"
                name="jerseyNumber"
                value={formData.jerseyNumber}
                onChange={handleChange}
                placeholder="#"
                min="0"
                max="999"
              />
            </div>

            <div className="form-group">
              <label>Position</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
              >
                <option value="">Select position</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
                <option value="Striker">Striker</option>
                <option value="Winger">Winger</option>
                <option value="Center">Center</option>
                <option value="Guard">Guard</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="player@example.com"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {existingPlayer ? 'Update Player' : 'Add Player'}
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

export default PlayerForm;
