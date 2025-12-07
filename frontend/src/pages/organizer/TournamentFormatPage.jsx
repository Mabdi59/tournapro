import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTournamentContext } from "../../contexts/TournamentContext";
import { tournamentAPI } from "../../services/api";
import toast from "react-hot-toast";
import "./TournamentFormatPage.css";

export default function TournamentFormatPage() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { setCurrentTitle } = useTournamentContext();
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalFormat, setModalFormat] = useState(null);
  const [numGroups, setNumGroups] = useState(4);
  const [teamsPerGroup, setTeamsPerGroup] = useState(4);
  const [teamsToKnockout, setTeamsToKnockout] = useState(8);

  useEffect(() => {
    // Fetch tournament to get its title for navbar
    const loadTournament = async () => {
      try {
        const response = await tournamentAPI.getById(tournamentId);
        setCurrentTitle(response.data.title);
      } catch (err) {
        console.error("Error loading tournament:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      }
    };
    loadTournament();
  }, [tournamentId, setCurrentTitle, navigate]);

  const handleFormatSelect = (format) => {
    setModalFormat(format);
    setShowModal(true);
  };

  const handleCreateFormat = async () => {
    try {
      // TODO: Save format configuration to backend
      setSelectedFormat(modalFormat);
      toast.success(`${modalFormat} format created`);
      setShowModal(false);
      // Navigate back to teams
      setTimeout(() => {
        navigate(`/manage/tournament/${tournamentId}/teams`);
      }, 1000);
    } catch (err) {
      console.error("Failed to save format:", err);
      toast.error("Failed to save format");
    }
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setModalFormat(null);
  };

  const handleAddComponent = (component) => {
    toast.info(`Adding ${component} - Coming soon!`);
    // TODO: Implement custom tournament composition
  };

  return (
    <main className="tf-layout">
      {/* LEFT SIDEBAR */}
      <aside className="tf-sidebar">
        <button
          className="tf-sidebar-item"
          onClick={() => navigate(`/manage/tournament/${tournamentId}`)}
        >
          <span>⚙️</span>
          <span>General</span>
        </button>
        <button
          className="tf-sidebar-item"
          onClick={() => navigate(`/manage/tournament/${tournamentId}/teams`)}
        >
          <span>👥</span>
          <span>Participants</span>
        </button>
        <button className="tf-sidebar-item active">
          <span>🏆</span>
          <span>Format</span>
        </button>
        <button
          className="tf-sidebar-item"
          onClick={() => navigate(`/manage/tournament/${tournamentId}/schedule`)}
        >
          <span>📅</span>
          <span>Schedule</span>
        </button>
        <button
          className="tf-sidebar-item"
          onClick={() => navigate(`/manage/tournament/${tournamentId}/presentation`)}
        >
          <span>📺</span>
          <span>Presentation</span>
        </button>
        <button
          className="tf-sidebar-item"
          onClick={() => navigate(`/manage/tournament/${tournamentId}/results`)}
        >
          <span>📊</span>
          <span>Results</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <section className="tf-main">
        <div className="tf-content">
          <h1 className="tf-page-title">Choose a tournament format</h1>

          {/* Predefined Format Options */}
          <div className="tf-format-options">
            {/* Group Phase Only */}
            <div 
              className={`tf-format-card ${selectedFormat === 'group' ? 'selected' : ''}`}
              onClick={() => handleFormatSelect('group')}
            >
              <h3 className="tf-format-title">Group phase only</h3>
              <div className="tf-format-visual">
                <svg viewBox="0 0 240 140" className="tf-format-svg">
                  {/* Group table with rows */}
                  <rect x="30" y="20" width="40" height="24" fill="none" stroke="#6b7280" strokeWidth="3" />
                  <rect x="70" y="20" width="140" height="24" fill="none" stroke="#6b7280" strokeWidth="3" />
                  
                  <rect x="30" y="44" width="40" height="24" fill="none" stroke="#6b7280" strokeWidth="3" />
                  <rect x="70" y="44" width="140" height="24" fill="none" stroke="#6b7280" strokeWidth="3" />
                  
                  <rect x="30" y="68" width="40" height="24" fill="none" stroke="#6b7280" strokeWidth="3" />
                  <rect x="70" y="68" width="140" height="24" fill="none" stroke="#6b7280" strokeWidth="3" />
                  
                  <rect x="30" y="92" width="40" height="24" fill="none" stroke="#6b7280" strokeWidth="3" />
                  <rect x="70" y="92" width="140" height="24" fill="none" stroke="#6b7280" strokeWidth="3" />
                </svg>
              </div>
            </div>

            {/* Group Phase and Knockout Phase */}
            <div 
              className={`tf-format-card ${selectedFormat === 'group-knockout' ? 'selected' : ''}`}
              onClick={() => handleFormatSelect('group-knockout')}
            >
              <h3 className="tf-format-title">Group phase and knockout phase</h3>
              <div className="tf-format-visual">
                <svg viewBox="0 0 240 140" className="tf-format-svg">
                  {/* Group table at top */}
                  <rect x="20" y="15" width="25" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                  <rect x="45" y="15" width="75" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                  
                  <rect x="20" y="31" width="25" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                  <rect x="45" y="31" width="75" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                  
                  <rect x="20" y="47" width="25" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                  <rect x="45" y="47" width="75" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                  
                  {/* Knockout bracket below */}
                  <rect x="30" y="80" width="50" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                  <rect x="30" y="100" width="50" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                  <line x1="80" y1="88" x2="95" y2="88" stroke="#6b7280" strokeWidth="3" />
                  <line x1="80" y1="108" x2="95" y2="108" stroke="#6b7280" strokeWidth="3" />
                  <line x1="95" y1="88" x2="95" y2="108" stroke="#6b7280" strokeWidth="3" />
                  <line x1="95" y1="98" x2="115" y2="98" stroke="#6b7280" strokeWidth="3" />
                  <rect x="115" y="90" width="50" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                </svg>
              </div>
            </div>

            {/* Knockout Phase Only */}
            <div 
              className={`tf-format-card ${selectedFormat === 'knockout' ? 'selected' : ''}`}
              onClick={() => handleFormatSelect('knockout')}
            >
              <h3 className="tf-format-title">Knockout phase only</h3>
              <div className="tf-format-visual">
                <svg viewBox="0 0 240 140" className="tf-format-svg">
                  {/* Knockout bracket */}
                  <rect x="40" y="45" width="50" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                  <rect x="40" y="75" width="50" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                  <line x1="90" y1="53" x2="110" y2="53" stroke="#6b7280" strokeWidth="3" />
                  <line x1="90" y1="83" x2="110" y2="83" stroke="#6b7280" strokeWidth="3" />
                  <line x1="110" y1="53" x2="110" y2="83" stroke="#6b7280" strokeWidth="3" />
                  <line x1="110" y1="68" x2="130" y2="68" stroke="#6b7280" strokeWidth="3" />
                  <rect x="130" y="60" width="50" height="16" fill="none" stroke="#6b7280" strokeWidth="3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Custom Composition Section */}
          <div className="tf-compose-section">
            <p className="tf-compose-text">
              Or compose the tournament yourself by combining groups, brackets and single matches.
            </p>
            <div className="tf-compose-buttons">
              <button 
                className="tf-compose-btn"
                onClick={() => handleAddComponent('group')}
              >
                + GROUP
              </button>
              <button 
                className="tf-compose-btn"
                onClick={() => handleAddComponent('bracket')}
              >
                + BRACKET
              </button>
              <button 
                className="tf-compose-btn"
                onClick={() => handleAddComponent('single match')}
              >
                + SINGLE MATCH
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FORMAT CONFIGURATION MODAL */}
      {showModal && (
        <div className="tf-modal-overlay" onClick={handleCancelModal}>
          <div className="tf-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="tf-modal-title">
              {modalFormat === 'group' && 'Group phase only'}
              {modalFormat === 'group-knockout' && 'Group phase and knockout phase'}
              {modalFormat === 'knockout' && 'Knockout phase only'}
            </h2>

            <div className="tf-modal-content">
              {/* Group phase fields */}
              {(modalFormat === 'group' || modalFormat === 'group-knockout') && (
                <>
                  <div className="tf-form-group">
                    <label className="tf-label">How many groups do you want to create?</label>
                    <input
                      type="number"
                      className="tf-input"
                      value={numGroups}
                      onChange={(e) => setNumGroups(e.target.value)}
                      min="1"
                    />
                  </div>

                  <div className="tf-form-group">
                    <label className="tf-label">How many teams are there in each group?</label>
                    <input
                      type="number"
                      className="tf-input"
                      value={teamsPerGroup}
                      onChange={(e) => setTeamsPerGroup(e.target.value)}
                      min="2"
                    />
                  </div>
                </>
              )}

              {/* Knockout phase fields */}
              {(modalFormat === 'group-knockout' || modalFormat === 'knockout') && (
                <div className="tf-form-group">
                  <label className="tf-label">
                    {modalFormat === 'group-knockout' 
                      ? 'How many teams proceed to the knockout phase' 
                      : 'How many teams proceed to the knockout phase'}
                  </label>
                  <select
                    className="tf-select"
                    value={teamsToKnockout}
                    onChange={(e) => setTeamsToKnockout(e.target.value)}
                  >
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                  </select>
                </div>
              )}

              <p className="tf-modal-note">You can change the format at any time.</p>
            </div>

            <div className="tf-modal-actions">
              <button className="tf-btn-cancel" onClick={handleCancelModal}>
                CANCEL
              </button>
              <button className="tf-btn-create" onClick={handleCreateFormat}>
                CREATE
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
