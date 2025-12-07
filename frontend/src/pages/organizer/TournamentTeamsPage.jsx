import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTournamentContext } from "../../contexts/TournamentContext";
import { tournamentAPI, teamAPI, playerAPI, refereeAPI, administratorAPI } from "../../services/api";
import toast from "react-hot-toast";
import "./TournamentTeamsPage.css";

export default function TournamentTeamsPage() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { setCurrentTitle } = useTournamentContext();
  const [activeTab, setActiveTab] = useState("teams");
  const [activeSidebar, setActiveSidebar] = useState("participants");

  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addMode, setAddMode] = useState("one"); // "one" or "multiple"
  const [newName, setNewName] = useState("");
  const [newShortName, setNewShortName] = useState("");
  const [multipleNames, setMultipleNames] = useState("");
  const [error, setError] = useState(null);

  // Edit modal state
  const [editing, setEditing] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    country: "",
    logo: null,
    dressingRoom: "",
  });

  // Add player modal state
  const [showingPlayers, setShowingPlayers] = useState(false);
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [playerMode, setPlayerMode] = useState("single"); // "single" or "multiple"
  const [playerForm, setPlayerForm] = useState({
    name: "",
    dateOfBirth: "",
    number: "",
  });
  const [multiplePlayers, setMultiplePlayers] = useState("");
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editPlayerForm, setEditPlayerForm] = useState({
    name: "",
    dateOfBirth: "",
    number: "",
  });

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState({
    present: false,
    paid: false,
    email: false,
    added: true,
    country: false,
    logo: false,
    dressingRoom: false,
    players: true,
    directLoginLink: true,
  });

  const [teamInfoExpanded, setTeamInfoExpanded] = useState(false);

  // Referee state
  const [referees, setReferees] = useState([]);
  const [loadingReferees, setLoadingReferees] = useState(false);
  const [addingReferee, setAddingReferee] = useState(false);
  const [refereeMode, setRefereeMode] = useState("one"); // "one" or "multiple"
  const [newRefereeName, setNewRefereeName] = useState("");
  const [newRefereeCountry, setNewRefereeCountry] = useState("");
  const [multipleReferees, setMultipleReferees] = useState("");
  const [refereeInfoExpanded, setRefereeInfoExpanded] = useState(false);
  const [teamsAsReferees, setTeamsAsReferees] = useState(false);
  const [refereeColumns, setRefereeColumns] = useState({
    country: false,
    directLoginLink: true,
    locationsAndFields: false,
    availability: false,
    divisions: false,
    maxMatches: false,
    excludedTeams: false,
    role: false,
  });

  // Administrators state
  const [administrators, setAdministrators] = useState([]);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminEmailError, setAdminEmailError] = useState(null);
  const [adminRights, setAdminRights] = useState({
    manageGeneral: true,
    manageParticipants: true,
    manageFormat: true,
    manageSchedule: true,
    managePresentation: true,
    managePublicWebsite: false,
    manageSlideShow: false,
    manageDesign: false,
    manageResults: true,
    managePhaseProgress: false,
  });

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const toggleAdminRight = (right) => {
    setAdminRights((prev) => ({
      ...prev,
      [right]: !prev[right],
    }));
  };

  useEffect(() => {
    // Fetch tournament to get its title for navbar
    const loadTournament = async () => {
      try {
        const response = await tournamentAPI.getById(tournamentId);
        setCurrentTitle(response.data.title); // Updates navbar
      } catch (err) {
        console.error("Error loading tournament:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      }
    };
    loadTournament();
  }, [tournamentId, setCurrentTitle, navigate]);

  useEffect(() => {
    // Fetch teams for this tournament
    const loadTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await teamAPI.getByTournament(tournamentId);
        setTeams(response.data || []);
      } catch (err) {
        console.error("Failed to load teams:", err);
        setError("Failed to load teams");
        toast.error("Failed to load teams");
      } finally {
        setLoading(false);
      }
    };
    
    if (tournamentId && activeTab === "teams") {
      loadTeams();
    }
  }, [tournamentId, activeTab]);

  useEffect(() => {
    // Fetch referees for this tournament
    const loadReferees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await refereeAPI.getByTournament(tournamentId);
        setReferees(response.data || []);
      } catch (err) {
        console.error("Failed to load referees:", err);
        setError("Failed to load referees");
        toast.error("Failed to load referees");
      } finally {
        setLoading(false);
      }
    };
    
    if (tournamentId && activeTab === "referees") {
      loadReferees();
    }
  }, [tournamentId, activeTab]);

  useEffect(() => {
    // Fetch administrators for this tournament
    const loadAdministrators = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await administratorAPI.getByTournament(tournamentId);
        setAdministrators(response.data || []);
      } catch (err) {
        console.error("Failed to load administrators:", err);
        setError("Failed to load administrators");
        toast.error("Failed to load administrators");
      } finally {
        setLoading(false);
      }
    };
    
    if (tournamentId && activeTab === "administrators") {
      loadAdministrators();
    }
  }, [tournamentId, activeTab]);

  const handleAddTeam = async (e) => {
    e.preventDefault();

    if (addMode === "one") {
      // Single team mode
      if (!newName.trim()) return;

      try {
        const response = await teamAPI.create(tournamentId, {
          name: newName.trim(),
          shortName: newShortName.trim() || null,
        });
        setTeams((prev) => [...prev, response.data]);
        setNewName("");
        setNewShortName("");
        setAdding(false);
        toast.success("Team added successfully");
      } catch (err) {
        console.error("Failed to create team:", err);
        toast.error(err.response?.data?.message || "Could not create team");
      }
    } else {
      // Multiple teams mode
      if (!multipleNames.trim()) return;

      const teamNames = multipleNames
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (teamNames.length === 0) return;

      try {
        const createdTeams = [];
        for (const name of teamNames) {
          const response = await teamAPI.create(tournamentId, {
            name: name,
            shortName: null,
          });
          createdTeams.push(response.data);
        }
        setTeams((prev) => [...prev, ...createdTeams]);
        setMultipleNames("");
        setAdding(false);
        toast.success(`${createdTeams.length} teams added successfully`);
      } catch (err) {
        console.error("Failed to create teams:", err);
        toast.error(err.response?.data?.message || "Could not create teams");
      }
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setEditForm({
      name: team.name || "",
      email: team.email || "",
      country: team.country || "",
      logo: null,
      logoPreview: team.logo || null,
      dressingRoom: team.dressingRoom || "",
    });
    setEditing(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({
          ...editForm,
          logo: file,
          logoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        name: editForm.name.trim(),
        shortName: editForm.email.trim() || null,
        email: editForm.email.trim() || null,
        country: editForm.country || null,
        dressingRoom: editForm.dressingRoom.trim() || null,
        present: editingTeam.present || false,
        paid: editingTeam.paid || false,
        logo: editForm.logoPreview || null, // Store the preview URL or existing logo
      };
      
      const response = await teamAPI.update(tournamentId, editingTeam.id, payload);
      
      setTeams((prev) =>
        prev.map((t) => (t.id === editingTeam.id ? response.data : t))
      );
      setEditing(false);
      setEditingTeam(null);
      toast.success("Team updated successfully");
    } catch (err) {
      console.error("Failed to update team:", err);
      console.error("Error details:", err.response?.data);
      toast.error(err.response?.data?.message || "Could not update team");
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm("Delete this team?")) return;
    
    try {
      await teamAPI.delete(tournamentId, teamId);
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      toast.success("Team deleted");
    } catch (err) {
      console.error("Failed to delete team:", err);
      toast.error(err.response?.data?.message || "Could not delete team");
    }
  };

  const handleToggleTeamSelection = (teamId) => {
    setSelectedTeams((prev) => {
      if (prev.includes(teamId)) {
        return prev.filter((id) => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };

  const handleToggleAllTeams = () => {
    if (selectedTeams.length === teams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(teams.map((t) => t.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedTeams.length} team(s)?`)) return;
    
    try {
      await Promise.all(
        selectedTeams.map((teamId) => teamAPI.delete(tournamentId, teamId))
      );
      setTeams((prev) => prev.filter((t) => !selectedTeams.includes(t.id)));
      setSelectedTeams([]);
      toast.success(`${selectedTeams.length} team(s) deleted`);
    } catch (err) {
      console.error("Failed to delete teams:", err);
      toast.error("Could not delete some teams");
    }
  };

  const handleTogglePresent = async (team) => {
    const newPresentStatus = !team.present;
    
    try {
      // Optimistic update
      setTeams((prev) =>
        prev.map((t) => (t.id === team.id ? { ...t, present: newPresentStatus } : t))
      );
      
      // Update backend
      await teamAPI.update(tournamentId, team.id, {
        name: team.name,
        shortName: team.shortName || null,
        present: newPresentStatus,
        paid: team.paid || false,
      });
    } catch (err) {
      // Revert on error
      setTeams((prev) =>
        prev.map((t) => (t.id === team.id ? { ...t, present: team.present } : t))
      );
      console.error("Failed to update present status:", err);
      toast.error("Could not update present status");
    }
  };

  const handleTogglePaid = async (team) => {
    const newPaidStatus = !team.paid;
    
    try {
      // Optimistic update
      setTeams((prev) =>
        prev.map((t) => (t.id === team.id ? { ...t, paid: newPaidStatus } : t))
      );
      
      // Update backend
      await teamAPI.update(tournamentId, team.id, {
        name: team.name,
        shortName: team.shortName || null,
        present: team.present || false,
        paid: newPaidStatus,
      });
    } catch (err) {
      // Revert on error
      setTeams((prev) =>
        prev.map((t) => (t.id === team.id ? { ...t, paid: team.paid } : t))
      );
      console.error("Failed to update paid status:", err);
      toast.error("Could not update paid status");
    }
  };

  const handleOpenPlayerModal = async (team) => {
    setSelectedTeamForPlayer(team);
    setShowingPlayers(true);
    setAddingPlayer(false);
    setEditingPlayer(null);
    
    // Load players for this team
    try {
      setLoadingPlayers(true);
      const response = await playerAPI.getByTeam(tournamentId, team.id);
      setPlayers(response.data || []);
    } catch (err) {
      console.error("Failed to load players:", err);
      toast.error("Could not load players");
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    
    if (playerMode === "single") {
      if (!playerForm.name.trim()) return;
      
      try {
        const response = await playerAPI.create(tournamentId, selectedTeamForPlayer.id, {
          name: playerForm.name.trim(),
          dateOfBirth: playerForm.dateOfBirth || null,
          number: playerForm.number || null,
        });
        setPlayers((prev) => [...prev, response.data]);
        toast.success(`Player "${playerForm.name}" added to ${selectedTeamForPlayer.name}`);
        setAddingPlayer(false);
        setPlayerForm({ name: "", dateOfBirth: "", number: "" });
      } catch (err) {
        console.error("Failed to create player:", err);
        toast.error(err.response?.data?.message || "Could not create player");
      }
    } else {
      if (!multiplePlayers.trim()) return;
      
      const playerNames = multiplePlayers
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
      
      if (playerNames.length === 0) return;
      
      try {
        const playerRequests = playerNames.map(name => ({
          name: name,
          dateOfBirth: null,
          number: null,
        }));
        
        const response = await playerAPI.bulkCreate(tournamentId, selectedTeamForPlayer.id, playerRequests);
        setPlayers((prev) => [...prev, ...(response.data || [])]);
        toast.success(`${playerNames.length} players added to ${selectedTeamForPlayer.name}`);
        setAddingPlayer(false);
        setMultiplePlayers("");
      } catch (err) {
        console.error("Failed to create players:", err);
        console.error("Response status:", err.response?.status);
        console.error("Response data:", err.response?.data);
        console.error("Request URL:", err.config?.url);
        toast.error(err.response?.data?.message || "Could not create players");
      }
    }
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setEditPlayerForm({
      name: player.name || "",
      dateOfBirth: player.dateOfBirth || "",
      number: player.number || "",
    });
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    
    try {
      const response = await playerAPI.update(editingPlayer.id, {
        name: editPlayerForm.name.trim(),
        dateOfBirth: editPlayerForm.dateOfBirth || null,
        number: editPlayerForm.number || null,
      });
      
      setPlayers((prev) =>
        prev.map((p) => (p.id === editingPlayer.id ? response.data : p))
      );
      setEditingPlayer(null);
      toast.success("Player updated successfully");
    } catch (err) {
      console.error("Failed to update player:", err);
      toast.error(err.response?.data?.message || "Could not update player");
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm("Delete this player?")) return;
    
    try {
      await playerAPI.delete(playerId);
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
      toast.success("Player deleted");
    } catch (err) {
      console.error("Failed to delete player:", err);
      toast.error(err.response?.data?.message || "Could not delete player");
    }
  };

  const getCountryFlag = (countryCode) => {
    const flags = {
      'US': '🇺🇸',
      'UK': '🇬🇧',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'ES': '🇪🇸',
      'IT': '🇮🇹',
      'BR': '🇧🇷',
      'MX': '🇲🇽',
      'AR': '🇦🇷',
      'JP': '🇯🇵',
      'CN': '🇨🇳',
      'IN': '🇮🇳',
      'KR': '🇰🇷',
      'NL': '🇳🇱',
      'SE': '🇸🇪',
      'NO': '🇳🇴',
      'DK': '🇩🇰',
      'FI': '🇫🇮',
      'PT': '🇵🇹',
      'PL': '🇵🇱',
      'BE': '🇧🇪',
      'CH': '🇨🇭',
      'AT': '🇦🇹',
    };
    return flags[countryCode] || countryCode;
  };

  const toggleRefereeColumn = (column) => {
    setRefereeColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleAddReferee = async (e) => {
    e.preventDefault();
    
    if (refereeMode === "one") {
      if (!newRefereeName.trim()) return;
      
      try {
        const response = await refereeAPI.create(tournamentId, {
          name: newRefereeName.trim(),
          country: newRefereeCountry || null,
        });
        
        setReferees((prev) => [...prev, response.data]);
        setNewRefereeName("");
        setNewRefereeCountry("");
        setAddingReferee(false);
        toast.success("Referee added successfully");
      } catch (err) {
        console.error("Failed to add referee:", err);
        toast.error("Failed to add referee");
      }
    } else {
      if (!multipleReferees.trim()) return;
      
      const refereeNames = multipleReferees
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
      
      if (refereeNames.length === 0) return;
      
      try {
        const refereesToCreate = refereeNames.map(name => ({
          name: name,
          country: null,
        }));
        
        const response = await refereeAPI.bulkCreate(tournamentId, refereesToCreate);
        setReferees((prev) => [...prev, ...response.data]);
        setMultipleReferees("");
        setAddingReferee(false);
        toast.success(`${refereeNames.length} referees added successfully`);
      } catch (err) {
        console.error("Failed to add referees:", err);
        toast.error("Failed to add referees");
      }
    }
  };

  const handleTeamsAsReferees = async (checked) => {
    setTeamsAsReferees(checked);
    
    if (checked) {
      try {
        // Load teams and convert to referees
        const teamsResponse = await teamAPI.getByTournament(tournamentId);
        const teamsList = teamsResponse.data || [];
        
        if (teamsList.length === 0) {
          toast.error("No teams found to convert to referees");
          setTeamsAsReferees(false);
          return;
        }
        
        // Create referees from team names
        const refereesToCreate = teamsList.map(team => ({
          name: team.name,
          country: team.country || null,
        }));
        
        const response = await refereeAPI.bulkCreate(tournamentId, refereesToCreate);
        setReferees(response.data || []);
        toast.success(`${teamsList.length} teams added as referees`);
      } catch (err) {
        console.error("Failed to convert teams to referees:", err);
        toast.error("Failed to convert teams to referees");
        setTeamsAsReferees(false);
      }
    } else {
      // When unchecking, just clear the referees list
      setReferees([]);
    }
  };

  const handleAddAdministrator = async (e) => {
    e.preventDefault();
    
    setAdminEmailError(null);
    
    if (!adminEmail.trim()) {
      setAdminEmailError("Please enter an email address");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      setAdminEmailError("Please enter a valid email address");
      return;
    }
    
    // Check if admin already exists
    if (administrators.some(admin => admin.email === adminEmail.trim())) {
      setAdminEmailError("This administrator already exists");
      return;
    }
    
    try {
      // Convert rights object to CSV string as backend expects
      const rightsArray = Object.entries(adminRights)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      const rightsString = rightsArray.join(",");
      
      const response = await administratorAPI.create(tournamentId, {
        email: adminEmail.trim(),
        rights: rightsString,
      });
      
      setAdministrators((prev) => [...prev, response.data]);
      setAdminEmail("");
      setAdminRights({
        manageGeneral: true,
        manageParticipants: true,
        manageFormat: true,
        manageSchedule: true,
        managePresentation: true,
        managePublicWebsite: false,
        manageSlideShow: false,
        manageDesign: false,
        manageResults: true,
        managePhaseProgress: false,
      });
      setAddingAdmin(false);
      toast.success("Administrator added successfully");
    } catch (err) {
      console.error("Failed to add administrator:", err);
      
      // Handle validation errors from backend
      const data = err.response?.data;
      if (data?.validationErrors?.email) {
        // Backend returns "User not found" for non-registered users
        setAdminEmailError(data.validationErrors.email);
      } else if (data?.message) {
        toast.error(data.message);
      } else {
        toast.error("Failed to add administrator");
      }
    }
  };

  const handleRemoveAdministrator = async (adminId) => {
    if (!window.confirm("Are you sure you want to remove this administrator?")) {
      return;
    }
    
    try {
      await administratorAPI.delete(tournamentId, adminId);
      
      setAdministrators((prev) => prev.filter((admin) => admin.id !== adminId));
      toast.success("Administrator removed successfully");
    } catch (err) {
      console.error("Failed to remove administrator:", err);
      toast.error("Failed to remove administrator");
    }
  };

  const hasTeams = teams.length > 0;
  const hasReferees = referees.length > 0;
  const hasAdministrators = administrators.length > 0;

  return (
    <main className="tp-layout">
      {/* LEFT SIDEBAR */}
      <aside className="tp-sidebar">
        <button
          className={`tp-sidebar-item ${activeSidebar === "participants" ? "active" : ""}`}
          onClick={() => setActiveSidebar("participants")}
        >
          <span className="tp-sidebar-icon">👥</span>
          <span>Participants</span>
        </button>
        <button
          className={`tp-sidebar-item ${activeSidebar === "format" ? "active" : ""}`}
          onClick={() => navigate(`/manage/tournament/${tournamentId}/format`)}
        >
          <span className="tp-sidebar-icon">⚙️</span>
          <span>Format</span>
        </button>
        <button
          className={`tp-sidebar-item ${activeSidebar === "schedule" ? "active" : ""}`}
          onClick={() => setActiveSidebar("schedule")}
        >
          <span className="tp-sidebar-icon">📅</span>
          <span>Schedule</span>
        </button>
        <button
          className={`tp-sidebar-item ${activeSidebar === "presentation" ? "active" : ""}`}
          onClick={() => setActiveSidebar("presentation")}
        >
          <span className="tp-sidebar-icon">📺</span>
          <span>Presentation</span>
        </button>
        <button
          className={`tp-sidebar-item ${activeSidebar === "results" ? "active" : ""}`}
          onClick={() => setActiveSidebar("results")}
        >
          <span className="tp-sidebar-icon">📊</span>
          <span>Results</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <section className="tp-main">
        {/* Top tabs: Teams / Referees / Administrators */}
        <div className="tp-top-tabs">
          <button
            className={`tp-top-tab ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            Teams
          </button>
          <button
            className={`tp-top-tab ${activeTab === "referees" ? "active" : ""}`}
            onClick={() => setActiveTab("referees")}
          >
            Referees
          </button>
          <button
            className={`tp-top-tab ${activeTab === "administrators" ? "active" : ""}`}
            onClick={() => setActiveTab("administrators")}
          >
            Administrators
          </button>
        </div>

        {/* Teams Tab */}
        {activeTab === "teams" && (
          <>
            {loading && <p className="tp-status-text">Loading teams...</p>}
            {error && <p className="tp-error-text">{error}</p>}

            {/* Team Information Section - Always show */}
            <div className="tp-team-info-section">
              <div 
                className="tp-team-info-header" 
                onClick={() => setTeamInfoExpanded(!teamInfoExpanded)}
              >
                <span>Team information</span>
                <span className={`tp-dropdown-arrow ${teamInfoExpanded ? 'expanded' : ''}`}>▼</span>
              </div>
              {teamInfoExpanded && (
              <div className="tp-team-info-content">
                <p className="tp-info-description">
                  Decide which information of the teams you want to keep track of.
                </p>



                <div className="tp-data-columns-section">
                  <h4 className="tp-section-title">Default data columns</h4>
                  <div className="tp-data-options">
                    <label className="tp-data-option">
                      <span>Present</span>
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.present}
                        onChange={() => toggleColumn('present')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Paid</span>
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.paid}
                        onChange={() => toggleColumn('paid')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Email</span>
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.email}
                        onChange={() => toggleColumn('email')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Added</span>
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.added}
                        onChange={() => toggleColumn('added')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Country</span>
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.country}
                        onChange={() => toggleColumn('country')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Logo</span>
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.logo}
                        onChange={() => toggleColumn('logo')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Dressing room</span>
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.dressingRoom}
                        onChange={() => toggleColumn('dressingRoom')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Players</span>
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.players}
                        onChange={() => toggleColumn('players')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Direct login link</span>
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.directLoginLink}
                        onChange={() => toggleColumn('directLoginLink')}
                      />
                    </label>
                  </div>
                  <button className="tp-add-column-btn">ADD DATA COLUMN</button>
                </div>

                <div className="tp-data-columns-section">
                  <h4 className="tp-section-title">Player data columns</h4>
                  <div className="tp-data-options">
                    <label className="tp-data-option">
                      <span>Name</span>
                      <div className="tp-option-actions">
                        <button className="tp-edit-icon-btn">✏️</button>
                        <input type="checkbox" defaultChecked disabled />
                      </div>
                    </label>
                    <label className="tp-data-option">
                      <span>Date of birth</span>
                      <div className="tp-option-actions">
                        <button className="tp-edit-icon-btn">✏️</button>
                        <input type="checkbox" defaultChecked />
                      </div>
                    </label>
                    <label className="tp-data-option">
                      <span>Number</span>
                      <div className="tp-option-actions">
                        <button className="tp-edit-icon-btn">✏️</button>
                        <input type="checkbox" defaultChecked />
                      </div>
                    </label>
                  </div>
                  <button className="tp-add-column-btn">ADD DATA COLUMN</button>
                </div>
              </div>
              )}
            </div>

            {!loading && !hasTeams && (
              <div className="tp-empty-card">
                <div className="tp-shirt-emoji" aria-hidden="true">
                  👕
                </div>
                <h2 className="tp-empty-title">Add teams</h2>
                <p className="tp-empty-subtitle">
                  Or start by creating a <a href={`/manage/tournament/${tournamentId}/format`} className="tp-format-link">format</a> and add the teams later on.
                </p>
                <button className="tp-primary-btn" onClick={() => setAdding(true)}>
                  Add team
                </button>
              </div>
            )}

            {!loading && hasTeams && (
              <>
                {/* Action Buttons */}
                <div className="tp-teams-actions-bar">
                  <div 
                    className="tp-team-info-header" 
                    onClick={() => setTeamInfoExpanded(!teamInfoExpanded)}
                  >
                    <span>Team information</span>
                    <span className={`tp-dropdown-arrow ${teamInfoExpanded ? 'expanded' : ''}`}>▼</span>
                  </div>
                  {teamInfoExpanded && (
                  <div className="tp-team-info-content">
                    <p className="tp-info-description">
                      Decide which information of the teams you want to keep track of.
                    </p>



                    <div className="tp-data-columns-section">
                      <h4 className="tp-section-title">Default data columns</h4>
                      <div className="tp-data-options">
                        <label className="tp-data-option">
                          <span>Present</span>
                          <input 
                            type="checkbox" 
                            checked={visibleColumns.present}
                            onChange={() => toggleColumn('present')}
                          />
                        </label>
                        <label className="tp-data-option">
                          <span>Paid</span>
                          <input 
                            type="checkbox" 
                            checked={visibleColumns.paid}
                            onChange={() => toggleColumn('paid')}
                          />
                        </label>
                        <label className="tp-data-option">
                          <span>Email</span>
                          <input 
                            type="checkbox" 
                            checked={visibleColumns.email}
                            onChange={() => toggleColumn('email')}
                          />
                        </label>
                        <label className="tp-data-option">
                          <span>Added</span>
                          <input 
                            type="checkbox" 
                            checked={visibleColumns.added}
                            onChange={() => toggleColumn('added')}
                          />
                        </label>
                        <label className="tp-data-option">
                          <span>Country</span>
                          <input 
                            type="checkbox" 
                            checked={visibleColumns.country}
                            onChange={() => toggleColumn('country')}
                          />
                        </label>
                        <label className="tp-data-option">
                          <span>Logo</span>
                          <input 
                            type="checkbox" 
                            checked={visibleColumns.logo}
                            onChange={() => toggleColumn('logo')}
                          />
                        </label>
                        <label className="tp-data-option">
                          <span>Dressing room</span>
                          <input 
                            type="checkbox" 
                            checked={visibleColumns.dressingRoom}
                            onChange={() => toggleColumn('dressingRoom')}
                          />
                        </label>
                        <label className="tp-data-option">
                          <span>Players</span>
                          <input 
                            type="checkbox" 
                            checked={visibleColumns.players}
                            onChange={() => toggleColumn('players')}
                          />
                        </label>
                        <label className="tp-data-option">
                          <span>Direct login link</span>
                          <input 
                            type="checkbox" 
                            checked={visibleColumns.directLoginLink}
                            onChange={() => toggleColumn('directLoginLink')}
                          />
                        </label>
                      </div>
                      <button className="tp-add-column-btn">ADD DATA COLUMN</button>
                    </div>

                    <div className="tp-data-columns-section">
                      <h4 className="tp-section-title">Player data columns</h4>
                      <div className="tp-data-options">
                        <label className="tp-data-option">
                          <span>Name</span>
                          <div className="tp-option-actions">
                            <button className="tp-edit-icon-btn">✏️</button>
                            <input type="checkbox" defaultChecked disabled />
                          </div>
                        </label>
                        <label className="tp-data-option">
                          <span>Date of birth</span>
                          <div className="tp-option-actions">
                            <button className="tp-edit-icon-btn">✏️</button>
                            <input type="checkbox" defaultChecked />
                          </div>
                        </label>
                        <label className="tp-data-option">
                          <span>Number</span>
                          <div className="tp-option-actions">
                            <button className="tp-edit-icon-btn">✏️</button>
                            <input type="checkbox" defaultChecked />
                          </div>
                        </label>
                      </div>
                      <button className="tp-add-column-btn">ADD DATA COLUMN</button>
                    </div>
                  </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="tp-teams-actions-bar">
                  <button className="tp-export-btn">EXPORT</button>
                  <button className="tp-add-team-btn" onClick={() => setAdding(true)}>
                    ADD TEAM
                  </button>
                </div>

                {/* Selection Banner */}
                {selectedTeams.length > 0 && (
                  <div className="tp-selection-banner">
                    <span className="tp-selection-count">{selectedTeams.length} selected</span>
                    <div className="tp-selection-actions">
                      <button className="tp-move-btn" disabled>
                        MOVE <span className="tp-move-arrow">➔</span>
                      </button>
                      <button className="tp-delete-selected-btn" onClick={handleBulkDelete}>
                        DELETE <span className="tp-trash-icon">🗑️</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Teams Table */}
                <div className="tp-teams-table-wrapper">
                  <table className="tp-teams-table">
                    <thead>
                      <tr>
                        <th className="tp-checkbox-col">
                          <input 
                            type="checkbox" 
                            checked={selectedTeams.length === teams.length && teams.length > 0}
                            onChange={handleToggleAllTeams}
                          />
                        </th>
                        {visibleColumns.present && (
                          <th className="tp-icon-col">
                            <span title="Present">👤</span>
                          </th>
                        )}
                        {visibleColumns.paid && (
                          <th className="tp-icon-col">
                            <span title="Paid">💳</span>
                          </th>
                        )}
                        <th className="tp-name-col">
                          Name <span className="tp-sort-arrow">↑</span>
                        </th>
                        {visibleColumns.email && <th className="tp-text-col">Email</th>}
                        {visibleColumns.added && <th className="tp-text-col">Added</th>}
                        {visibleColumns.country && <th className="tp-text-col">Country</th>}
                        {visibleColumns.logo && <th className="tp-logo-col">Logo</th>}
                        {visibleColumns.dressingRoom && <th className="tp-text-col">Dressing room</th>}
                        {visibleColumns.players && <th className="tp-players-col">Players</th>}
                        {visibleColumns.directLoginLink && <th className="tp-icon-col">Direct login link</th>}
                        <th className="tp-edit-col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map((team) => (
                        <tr key={team.id} className={selectedTeams.includes(team.id) ? "tp-row-selected" : ""}>
                          <td className="tp-checkbox-col">
                            <input 
                              type="checkbox" 
                              checked={selectedTeams.includes(team.id)}
                              onChange={() => handleToggleTeamSelection(team.id)}
                            />
                          </td>
                          {visibleColumns.present && (
                            <td className="tp-icon-col">
                              <input 
                                type="checkbox" 
                                className="tp-status-checkbox" 
                                checked={team.present || false}
                                onChange={() => handleTogglePresent(team)}
                              />
                            </td>
                          )}
                          {visibleColumns.paid && (
                            <td className="tp-icon-col">
                              <input 
                                type="checkbox" 
                                className="tp-status-checkbox tp-paid-checkbox" 
                                checked={team.paid || false}
                                onChange={() => handleTogglePaid(team)}
                              />
                            </td>
                          )}
                          <td className="tp-name-col">{team.name}</td>
                          {visibleColumns.email && <td className="tp-text-col">{team.email || ''}</td>}
                          {visibleColumns.added && <td className="tp-text-col">{team.createdAt ? new Date(team.createdAt).toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}) : ''}</td>}
                          {visibleColumns.country && (
                            <td className="tp-text-col">
                              {team.country && (
                                <span className="tp-country-flag" title={team.country}>
                                  {getCountryFlag(team.country)}
                                </span>
                              )}
                            </td>
                          )}
                          {visibleColumns.logo && (
                            <td className="tp-logo-col">
                              {team.logo && (
                                <img src={team.logo} alt="Logo" className="tp-team-logo-img" />
                              )}
                            </td>
                          )}
                          {visibleColumns.dressingRoom && <td className="tp-text-col">{team.dressingRoom || ''}</td>}
                          {visibleColumns.players && (
                            <td className="tp-players-col">
                              <button 
                                className="tp-players-icon-btn"
                                onClick={() => handleOpenPlayerModal(team)}
                                title="Manage players"
                              >
                                <span className="tp-players-icon">👥</span>
                              </button>
                            </td>
                          )}
                          {visibleColumns.directLoginLink && (
                            <td className="tp-icon-col">
                              <button className="tp-link-icon-btn" title="Direct login link">
                                ⓘ
                              </button>
                            </td>
                          )}
                          <td className="tp-edit-col">
                            <button
                              className="tp-edit-btn"
                              onClick={() => handleEditTeam(team)}
                              title="Edit team"
                            >
                              ✏️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="tp-pagination">
                  <div className="tp-pagination-left">
                    <span>Rows per page</span>
                    <select className="tp-pagination-select">
                      <option value="100">100</option>
                      <option value="50">50</option>
                      <option value="25">25</option>
                    </select>
                  </div>
                  <div className="tp-pagination-right">
                    <span className="tp-pagination-info">1-{teams.length} of {teams.length}</span>
                    <button className="tp-pagination-btn" disabled>‹</button>
                    <button className="tp-pagination-btn" disabled>›</button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Referees Tab */}
        {activeTab === "referees" && (
          <>
            {/* Referee Information Section - Always show */}
            <div className="tp-team-info-section">
              <div 
                className="tp-team-info-header" 
                onClick={() => setRefereeInfoExpanded(!refereeInfoExpanded)}
              >
                <span>Referee information</span>
                <span className={`tp-dropdown-arrow ${refereeInfoExpanded ? 'expanded' : ''}`}>▼</span>
              </div>
              {refereeInfoExpanded && (
              <div className="tp-team-info-content">
                <p className="tp-info-description">
                  Decide which information of the referees you want to keep track of.
                </p>

                <div className="tp-info-notice">
                  <span className="tp-info-icon">ℹ️</span>
                  <span>No referees? Click here to use 'judges' instead.</span>
                </div>

                <div className="tp-data-columns-section">
                  <h4 className="tp-section-title">Default data columns</h4>
                  <div className="tp-data-options">
                    <label className="tp-data-option">
                      <span>Country</span>
                      <input 
                        type="checkbox" 
                        checked={refereeColumns.country}
                        onChange={() => toggleRefereeColumn('country')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Direct login link</span>
                      <input 
                        type="checkbox" 
                        checked={refereeColumns.directLoginLink}
                        onChange={() => toggleRefereeColumn('directLoginLink')}
                      />
                    </label>
                  </div>
                  <button className="tp-add-column-btn">ADD DATA COLUMN</button>
                </div>

                <div className="tp-data-columns-section">
                  <h4 className="tp-section-title">Wishes</h4>
                  <div className="tp-data-options">
                    <label className="tp-data-option">
                      <span>Locations and fields</span>
                      <input 
                        type="checkbox" 
                        checked={refereeColumns.locationsAndFields}
                        onChange={() => toggleRefereeColumn('locationsAndFields')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Availability</span>
                      <input 
                        type="checkbox" 
                        checked={refereeColumns.availability}
                        onChange={() => toggleRefereeColumn('availability')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Divisions</span>
                      <input 
                        type="checkbox" 
                        checked={refereeColumns.divisions}
                        onChange={() => toggleRefereeColumn('divisions')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Max matches</span>
                      <input 
                        type="checkbox" 
                        checked={refereeColumns.maxMatches}
                        onChange={() => toggleRefereeColumn('maxMatches')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Excluded teams</span>
                      <input 
                        type="checkbox" 
                        checked={refereeColumns.excludedTeams}
                        onChange={() => toggleRefereeColumn('excludedTeams')}
                      />
                    </label>
                    <label className="tp-data-option">
                      <span>Role 1-5</span>
                      <input 
                        type="checkbox" 
                        checked={refereeColumns.role}
                        onChange={() => toggleRefereeColumn('role')}
                      />
                    </label>
                  </div>
                  <button className="tp-add-column-btn">ADD DATA COLUMN</button>
                </div>
              </div>
              )}
            </div>

            {!hasReferees && (
              <div className="tp-empty-card">
                <div className="tp-shirt-emoji">👕</div>
                <h2 className="tp-empty-title">Add referees</h2>
                <p className="tp-empty-subtitle">
                  And use the schedule page to assign referees to matches.
                </p>
                <button className="tp-primary-btn" onClick={() => setAddingReferee(true)}>
                  Add referee
                </button>
                <label className="tp-teams-as-referees">
                  <input 
                    type="checkbox" 
                    checked={teamsAsReferees}
                    onChange={(e) => handleTeamsAsReferees(e.target.checked)}
                  />
                  <span>Teams as referees</span>
                </label>
              </div>
            )}

            {hasReferees && (
              <>
                {/* Action Buttons */}
                <div className="tp-teams-actions-bar">
                  <label className="tp-teams-as-referees" style={{ marginRight: 'auto' }}>
                    <input 
                      type="checkbox" 
                      checked={teamsAsReferees}
                      onChange={(e) => handleTeamsAsReferees(e.target.checked)}
                    />
                    <span>Teams as referees</span>
                  </label>
                  <button className="tp-export-btn">EXPORT</button>
                  <button className="tp-add-team-btn" onClick={() => setAddingReferee(true)}>
                    ADD REFEREE
                  </button>
                </div>

                {/* Referees Table */}
                <div className="tp-teams-table-wrapper">
                  <table className="tp-teams-table">
                    <thead>
                      <tr>
                        <th className="tp-checkbox-col">
                          <input type="checkbox" />
                        </th>
                        <th className="tp-name-col">
                          Name <span className="tp-sort-arrow">↑</span>
                        </th>
                        {refereeColumns.country && <th className="tp-text-col">Country</th>}
                        {refereeColumns.locationsAndFields && <th className="tp-text-col">Locations and fields</th>}
                        {refereeColumns.availability && <th className="tp-text-col">Availability</th>}
                        {refereeColumns.divisions && <th className="tp-text-col">Divisions</th>}
                        {refereeColumns.maxMatches && <th className="tp-text-col">Max. matches</th>}
                        {refereeColumns.excludedTeams && <th className="tp-text-col">Excluded teams</th>}
                        {refereeColumns.role && <th className="tp-text-col">Role</th>}
                        {refereeColumns.directLoginLink && <th className="tp-icon-col">Direct login link</th>}
                        <th className="tp-edit-col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {referees.map((referee) => (
                        <tr key={referee.id}>
                          <td className="tp-checkbox-col">
                            <input type="checkbox" />
                          </td>
                          <td className="tp-name-col">{referee.name}</td>
                          {refereeColumns.country && (
                            <td className="tp-text-col">
                              {referee.country && (
                                <span className="tp-country-flag" title={referee.country}>
                                  {getCountryFlag(referee.country)}
                                </span>
                              )}
                            </td>
                          )}
                          {refereeColumns.locationsAndFields && <td className="tp-text-col"></td>}
                          {refereeColumns.availability && <td className="tp-text-col"></td>}
                          {refereeColumns.divisions && <td className="tp-text-col"></td>}
                          {refereeColumns.maxMatches && <td className="tp-text-col"></td>}
                          {refereeColumns.excludedTeams && <td className="tp-text-col"></td>}
                          {refereeColumns.role && <td className="tp-text-col"></td>}
                          {refereeColumns.directLoginLink && (
                            <td className="tp-icon-col">
                              <button className="tp-link-icon-btn" title="Direct login link">
                                ⓘ
                              </button>
                            </td>
                          )}
                          <td className="tp-edit-col">
                            <button className="tp-edit-btn" title="Edit referee">
                              ✏️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="tp-pagination">
                  <div className="tp-pagination-left">
                    <span>Rows per page</span>
                    <select className="tp-pagination-select">
                      <option value="100">100</option>
                      <option value="50">50</option>
                      <option value="25">25</option>
                    </select>
                  </div>
                  <div className="tp-pagination-right">
                    <span className="tp-pagination-info">1-{referees.length} of {referees.length}</span>
                    <button className="tp-pagination-btn" disabled>‹</button>
                    <button className="tp-pagination-btn" disabled>›</button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Administrators Tab */}
        {activeTab === "administrators" && (
          <>
            {!hasAdministrators && (
              <div className="tp-empty-card">
                <div className="tp-admin-emoji">👔</div>
                <h2 className="tp-empty-title">Add administrators</h2>
                <p className="tp-empty-subtitle">
                  They can help you manage this tournament. You can share this tournament, or certain<br />
                  parts of it, with another TournaPro account.
                </p>
                <button className="tp-primary-btn" onClick={() => setAddingAdmin(true)}>
                  ADD ADMINISTRATOR
                </button>
              </div>
            )}

            {hasAdministrators && (
              <>
                {/* Action Buttons */}
                <div className="tp-teams-actions-bar">
                  <button className="tp-add-team-btn" onClick={() => setAddingAdmin(true)}>
                    ADD ADMINISTRATOR
                  </button>
                </div>

                {/* Administrators Table */}
                <div className="tp-teams-table-wrapper">
                  <table className="tp-teams-table">
                    <thead>
                      <tr>
                        <th className="tp-name-col">
                          Email <span className="tp-sort-arrow">↑</span>
                        </th>
                        <th className="tp-text-col">Rights</th>
                        <th className="tp-text-col">Added</th>
                        <th className="tp-actions-col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {administrators.map((admin) => (
                        <tr key={admin.id}>
                          <td>{admin.email}</td>
                          <td>
                            <div className="tp-admin-rights-summary">
                              {Object.entries(admin.rights)
                                .filter(([_, value]) => value)
                                .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
                                .join(', ')}
                            </div>
                          </td>
                          <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="tp-delete-icon-btn"
                              onClick={() => handleRemoveAdministrator(admin.id)}
                              title="Remove administrator"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="tp-pagination">
                  <span className="tp-pagination-info">
                    Rows per page: 100
                  </span>
                  <span className="tp-pagination-info">
                    1-{administrators.length} of {administrators.length}
                  </span>
                  <div className="tp-pagination-controls">
                    <button className="tp-pagination-btn" disabled>‹</button>
                    <button className="tp-pagination-btn" disabled>›</button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Edit Team Modal */}
        {editing && (
          <div className="tp-modal-backdrop" onClick={() => setEditing(false)}>
            <div className="tp-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Edit team</h3>

              <form onSubmit={handleUpdateTeam} className="tp-form">
                <label className="tp-field">
                  <span>Name</span>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    required
                  />
                </label>

                <label className="tp-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                </label>

                <label className="tp-field">
                  <span className="tp-field-label-blue">Country</span>
                  <select
                    className="tp-select"
                    value={editForm.country}
                    onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                  >
                    <option value="">None</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                  </select>
                </label>

                <div className="tp-field">
                  <span>Logo</span>
                  <div className="tp-logo-upload">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="logo-upload" className="tp-upload-btn">
                      {editForm.logoPreview ? (
                        <img src={editForm.logoPreview} alt="Logo preview" className="tp-logo-preview" />
                      ) : (
                        <span>☁️</span>
                      )}
                    </label>
                  </div>
                </div>

                <label className="tp-field">
                  <span>Dressing room</span>
                  <input
                    value={editForm.dressingRoom}
                    onChange={(e) => setEditForm({...editForm, dressingRoom: e.target.value})}
                  />
                </label>

                <div className="tp-modal-actions">
                  <button
                    type="button"
                    className="tp-secondary-btn"
                    onClick={() => {
                      setEditing(false);
                      setEditingTeam(null);
                    }}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="tp-primary-btn">
                    EDIT
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Players List Modal */}
        {showingPlayers && !addingPlayer && !editingPlayer && (
          <div className="tp-modal-backdrop" onClick={() => setShowingPlayers(false)}>
            <div className="tp-modal tp-players-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Players</h3>
              
              <p className="tp-modal-subtitle">
                Manage the players of {selectedTeamForPlayer?.name}. Go to General &gt; Group ranking to set which player statistics you want to keep.
              </p>

              {loadingPlayers ? (
                <p className="tp-status-text">Loading players...</p>
              ) : (
                <>
                  {players.length > 0 ? (
                    <div className="tp-players-list">
                      <table className="tp-players-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Date of birth</th>
                            <th>Number</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {players.map((player) => (
                            <tr key={player.id}>
                              <td>{player.name}</td>
                              <td>{player.dateOfBirth || ""}</td>
                              <td>{player.number || ""}</td>
                              <td>
                                <button
                                  type="button"
                                  className="tp-player-edit-btn"
                                  onClick={() => handleEditPlayer(player)}
                                >
                                  ✏️
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="tp-empty-players-text">No players yet</p>
                  )}

                  <div className="tp-modal-actions">
                    <button
                      type="button"
                      className="tp-add-player-btn"
                      onClick={() => {
                        setPlayerMode("single");
                        setPlayerForm({ name: "", dateOfBirth: "", number: "" });
                        setMultiplePlayers("");
                        setAddingPlayer(true);
                      }}
                    >
                      ADD PLAYER
                    </button>
                    <button
                      type="button"
                      className="tp-close-btn"
                      onClick={() => setShowingPlayers(false)}
                    >
                      CLOSE
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Add Player Modal */}
        {addingPlayer && (
          <div className="tp-modal-backdrop" onClick={() => setAddingPlayer(false)}>
            <div className="tp-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Add player</h3>
              
              <p className="tp-modal-subtitle">
                Manage the players of {selectedTeamForPlayer?.name}. Go to General &gt; Group ranking to set which player statistics you want to keep.
              </p>

              {/* Tabs */}
              <div className="tp-modal-tabs">
                <button
                  type="button"
                  className={`tp-modal-tab ${playerMode === "single" ? "active" : ""}`}
                  onClick={() => setPlayerMode("single")}
                >
                  SINGLE PLAYER
                </button>
                <button
                  type="button"
                  className={`tp-modal-tab ${playerMode === "multiple" ? "active" : ""}`}
                  onClick={() => setPlayerMode("multiple")}
                >
                  MULTIPLE PLAYERS
                </button>
              </div>

              <form onSubmit={handleAddPlayer} className="tp-form">
                {playerMode === "single" ? (
                  <>
                    <label className="tp-field">
                      <span>Name</span>
                      <input
                        value={playerForm.name}
                        onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})}
                        autoFocus
                        required
                      />
                    </label>

                    <label className="tp-field">
                      <span>Date of birth</span>
                      <input
                        type="date"
                        value={playerForm.dateOfBirth}
                        onChange={(e) => setPlayerForm({...playerForm, dateOfBirth: e.target.value})}
                      />
                    </label>

                    <label className="tp-field">
                      <span>Number</span>
                      <input
                        type="text"
                        value={playerForm.number}
                        onChange={(e) => setPlayerForm({...playerForm, number: e.target.value})}
                      />
                    </label>
                  </>
                ) : (
                  <label className="tp-field">
                    <span>Add multiple players at once. Use a single line for each name.</span>
                    <textarea
                      className="tp-textarea"
                      value={multiplePlayers}
                      onChange={(e) => setMultiplePlayers(e.target.value)}
                      placeholder="Player 1&#10;Player 2&#10;Player 3"
                      rows={8}
                      autoFocus
                      required
                    />
                  </label>
                )}

                <div className="tp-modal-actions">
                  <button
                    type="button"
                    className="tp-secondary-btn"
                    onClick={() => {
                      setAddingPlayer(false);
                      setPlayerMode("single");
                      setPlayerForm({ name: "", dateOfBirth: "", number: "" });
                      setMultiplePlayers("");
                    }}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="tp-primary-btn">
                    ADD
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Player Modal */}
        {editingPlayer && (
          <div className="tp-modal-backdrop" onClick={() => setEditingPlayer(null)}>
            <div className="tp-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Edit player</h3>
              
              <p className="tp-modal-subtitle">
                Manage the players of {selectedTeamForPlayer?.name}. Go to General &gt; Group ranking to set which player statistics you want to keep.
              </p>

              <form onSubmit={handleUpdatePlayer} className="tp-form">
                <label className="tp-field">
                  <span>Name</span>
                  <input
                    value={editPlayerForm.name}
                    onChange={(e) => setEditPlayerForm({...editPlayerForm, name: e.target.value})}
                    autoFocus
                    required
                  />
                </label>

                <label className="tp-field">
                  <span>Date of birth</span>
                  <input
                    type="date"
                    value={editPlayerForm.dateOfBirth}
                    onChange={(e) => setEditPlayerForm({...editPlayerForm, dateOfBirth: e.target.value})}
                  />
                </label>

                <label className="tp-field">
                  <span>Number</span>
                  <input
                    type="text"
                    value={editPlayerForm.number}
                    onChange={(e) => setEditPlayerForm({...editPlayerForm, number: e.target.value})}
                  />
                </label>

                <button
                  type="button"
                  className="tp-delete-player-btn"
                  onClick={() => {
                    handleDeletePlayer(editingPlayer.id);
                    setEditingPlayer(null);
                  }}
                >
                  DELETE
                </button>

                <div className="tp-modal-actions">
                  <button
                    type="button"
                    className="tp-secondary-btn"
                    onClick={() => setEditingPlayer(null)}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="tp-primary-btn-gray">
                    SAVE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Team Modal */}
        {adding && (
          <div className="tp-modal-backdrop" onClick={() => setAdding(false)}>
            <div className="tp-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Add team</h3>
              
              <p className="tp-modal-subtitle">
                Add one or multiple teams. If you want teams to sign up using TournaPro, check out the online sign up page.
              </p>

              {/* Tabs */}
              <div className="tp-modal-tabs">
                <button
                  type="button"
                  className={`tp-modal-tab ${addMode === "one" ? "active" : ""}`}
                  onClick={() => setAddMode("one")}
                >
                  ONE TEAM
                </button>
                <button
                  type="button"
                  className={`tp-modal-tab ${addMode === "multiple" ? "active" : ""}`}
                  onClick={() => setAddMode("multiple")}
                >
                  MULTIPLE TEAMS
                </button>
              </div>

              <form onSubmit={handleAddTeam} className="tp-form">
                {addMode === "one" ? (
                  <>
                    <label className="tp-field">
                      <span>Name</span>
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                        required
                      />
                    </label>
                  </>
                ) : (
                  <label className="tp-field">
                    <span>Team names (one per line)</span>
                    <textarea
                      className="tp-textarea"
                      value={multipleNames}
                      onChange={(e) => setMultipleNames(e.target.value)}
                      placeholder="Team A&#10;Team B&#10;Team C"
                      rows={8}
                      autoFocus
                      required
                    />
                  </label>
                )}

                <div className="tp-modal-actions">
                  <button
                    type="button"
                    className="tp-secondary-btn"
                    onClick={() => {
                      setAdding(false);
                      setAddMode("one");
                      setNewName("");
                      setNewShortName("");
                      setMultipleNames("");
                    }}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="tp-primary-btn">
                    ADD
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Referee Modal */}
        {addingReferee && (
          <div className="tp-modal-backdrop" onClick={() => setAddingReferee(false)}>
            <div className="tp-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Add referee</h3>

              {/* Tabs */}
              <div className="tp-modal-tabs">
                <button
                  type="button"
                  className={`tp-modal-tab ${refereeMode === "one" ? "active" : ""}`}
                  onClick={() => setRefereeMode("one")}
                >
                  ONE
                </button>
                <button
                  type="button"
                  className={`tp-modal-tab ${refereeMode === "multiple" ? "active" : ""}`}
                  onClick={() => setRefereeMode("multiple")}
                >
                  MULTIPLE
                </button>
              </div>

              <form onSubmit={handleAddReferee} className="tp-form">
                {refereeMode === "one" ? (
                  <>
                    <label className="tp-field">
                      <span>Name</span>
                      <input
                        value={newRefereeName}
                        onChange={(e) => setNewRefereeName(e.target.value)}
                        autoFocus
                        required
                      />
                    </label>

                    {refereeColumns.country && (
                      <label className="tp-field">
                        <span className="tp-field-label-blue">Country</span>
                        <select
                          className="tp-select"
                          value={newRefereeCountry}
                          onChange={(e) => setNewRefereeCountry(e.target.value)}
                        >
                          <option value="">None</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="ES">Spain</option>
                          <option value="IT">Italy</option>
                        </select>
                      </label>
                    )}

                    {refereeColumns.locationsAndFields && (
                      <label className="tp-field">
                        <span className="tp-field-label-blue">Locations and fields</span>
                        <input
                          type="text"
                          placeholder="1100 Commerce Street, Dallas, TX, USA"
                        />
                        <select className="tp-select" style={{ marginTop: '8px' }}>
                          <option value="">All fields</option>
                        </select>
                      </label>
                    )}

                    {refereeColumns.availability && (
                      <label className="tp-field">
                        <span className="tp-field-label-blue">Availability (Days and times)</span>
                        <input
                          type="date"
                          placeholder="12-08-2025"
                        />
                        <select className="tp-select" style={{ marginTop: '8px' }}>
                          <option value="">All day</option>
                        </select>
                      </label>
                    )}

                    {refereeColumns.divisions && (
                      <label className="tp-field">
                        <span className="tp-field-label-blue">Divisions</span>
                        <select className="tp-select">
                          <option value="">All divisions</option>
                        </select>
                      </label>
                    )}

                    {refereeColumns.maxMatches && (
                      <label className="tp-field">
                        <span className="tp-field-label-blue">Max. number of matches</span>
                        <input
                          type="number"
                          placeholder="Enter max matches"
                        />
                      </label>
                    )}

                    {refereeColumns.excludedTeams && (
                      <label className="tp-field">
                        <span className="tp-field-label-blue">Excluded teams/players</span>
                        <select className="tp-select">
                          <option value="">Select teams to exclude</option>
                        </select>
                      </label>
                    )}

                    {refereeColumns.role && (
                      <label className="tp-field">
                        <span className="tp-field-label-blue">Role (1-5)</span>
                        <select className="tp-select">
                          <option value="">All roles</option>
                          <option value="1">Role 1</option>
                          <option value="2">Role 2</option>
                          <option value="3">Role 3</option>
                          <option value="4">Role 4</option>
                          <option value="5">Role 5</option>
                        </select>
                      </label>
                    )}
                  </>
                ) : (
                  <label className="tp-field">
                    <span>Add multiple referees at the same time. Use a single line for each referee.</span>
                    <textarea
                      className="tp-textarea"
                      value={multipleReferees}
                      onChange={(e) => setMultipleReferees(e.target.value)}
                      placeholder="List of referees"
                      rows={8}
                      autoFocus
                      required
                    />
                  </label>
                )}

                <div className="tp-modal-actions">
                  <button
                    type="button"
                    className="tp-secondary-btn"
                    onClick={() => {
                      setAddingReferee(false);
                      setRefereeMode("one");
                      setNewRefereeName("");
                      setNewRefereeCountry("");
                      setMultipleReferees("");
                    }}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="tp-primary-btn">
                    ADD
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Administrator Modal */}
        {addingAdmin && (
          <div className="tp-modal-backdrop" onClick={() => {
            setAddingAdmin(false);
            setAdminEmail("");
            setAdminEmailError(null);
          }}>
            <div className="tp-modal tp-modal-scrollable" onClick={(e) => e.stopPropagation()}>
              <h3>Add administrator</h3>
              
              <form onSubmit={handleAddAdministrator} className="tp-form">
                <p className="tp-modal-subtitle">
                  You can only add email addresses of registered TournaPro accounts.
                </p>

                <label className="tp-field">
                  <span className="tp-field-label-blue">Email</span>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => {
                      setAdminEmail(e.target.value);
                      setAdminEmailError(null);
                    }}
                    placeholder="admin@example.com"
                    autoFocus
                    required
                    className={adminEmailError ? 'tp-input-error' : ''}
                  />
                  {adminEmailError && (
                    <span className="tp-field-error">{adminEmailError}</span>
                  )}
                </label>

                <div className="tp-rights-section">
                  <h4 className="tp-rights-title">Rights:</h4>
                  
                  <label className="tp-toggle-option">
                    <span>Manage general</span>
                    <div className="tp-toggle-switch">
                      <input
                        type="checkbox"
                        checked={adminRights.manageGeneral}
                        onChange={() => toggleAdminRight('manageGeneral')}
                      />
                      <span className="tp-toggle-slider"></span>
                    </div>
                  </label>

                  <label className="tp-toggle-option">
                    <span>Manage participants</span>
                    <div className="tp-toggle-switch">
                      <input
                        type="checkbox"
                        checked={adminRights.manageParticipants}
                        onChange={() => toggleAdminRight('manageParticipants')}
                      />
                      <span className="tp-toggle-slider"></span>
                    </div>
                  </label>

                  <label className="tp-toggle-option">
                    <span>Manage format</span>
                    <div className="tp-toggle-switch">
                      <input
                        type="checkbox"
                        checked={adminRights.manageFormat}
                        onChange={() => toggleAdminRight('manageFormat')}
                      />
                      <span className="tp-toggle-slider"></span>
                    </div>
                  </label>

                  <label className="tp-toggle-option">
                    <span>Manage schedule</span>
                    <div className="tp-toggle-switch">
                      <input
                        type="checkbox"
                        checked={adminRights.manageSchedule}
                        onChange={() => toggleAdminRight('manageSchedule')}
                      />
                      <span className="tp-toggle-slider"></span>
                    </div>
                  </label>

                  <label className="tp-toggle-option">
                    <span>Manage presentation</span>
                    <div className="tp-toggle-switch">
                      <input
                        type="checkbox"
                        checked={adminRights.managePresentation}
                        onChange={() => toggleAdminRight('managePresentation')}
                      />
                      <span className="tp-toggle-slider"></span>
                    </div>
                  </label>

                  <label className="tp-toggle-option">
                    <span>Manage public website</span>
                    <div className="tp-toggle-switch">
                      <input
                        type="checkbox"
                        checked={adminRights.managePublicWebsite}
                        onChange={() => toggleAdminRight('managePublicWebsite')}
                      />
                      <span className="tp-toggle-slider"></span>
                    </div>
                  </label>

                  <label className="tp-toggle-option">
                    <span>Manage slide show</span>
                    <div className="tp-toggle-switch">
                      <input
                        type="checkbox"
                        checked={adminRights.manageSlideShow}
                        onChange={() => toggleAdminRight('manageSlideShow')}
                      />
                      <span className="tp-toggle-slider"></span>
                    </div>
                  </label>

                  <label className="tp-toggle-option">
                    <span>Manage design</span>
                    <div className="tp-toggle-switch">
                      <input
                        type="checkbox"
                        checked={adminRights.manageDesign}
                        onChange={() => toggleAdminRight('manageDesign')}
                      />
                      <span className="tp-toggle-slider"></span>
                    </div>
                  </label>

                  <label className="tp-toggle-option">
                    <span>Manage results</span>
                    <div className="tp-toggle-switch">
                      <input
                        type="checkbox"
                        checked={adminRights.manageResults}
                        onChange={() => toggleAdminRight('manageResults')}
                      />
                      <span className="tp-toggle-slider"></span>
                    </div>
                  </label>

                  <label className="tp-toggle-option">
                    <span>Manage phase progress</span>
                    <div className="tp-toggle-switch">
                      <input
                        type="checkbox"
                        checked={adminRights.managePhaseProgress}
                        onChange={() => toggleAdminRight('managePhaseProgress')}
                      />
                      <span className="tp-toggle-slider"></span>
                    </div>
                  </label>

                  <p className="tp-rights-note">
                    Administrator can start and reverse phases of the tournament.
                  </p>
                </div>

                <div className="tp-modal-actions">
                  <button
                    type="button"
                    className="tp-secondary-btn"
                    onClick={() => {
                      setAddingAdmin(false);
                      setAdminEmail("");
                      setAdminEmailError(null);
                      setAdminRights({
                        manageGeneral: true,
                        manageParticipants: true,
                        manageFormat: true,
                        manageSchedule: true,
                        managePresentation: true,
                        managePublicWebsite: false,
                        manageSlideShow: false,
                        manageDesign: false,
                        manageResults: true,
                        managePhaseProgress: false,
                      });
                    }}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="tp-primary-btn">
                    ADD
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
