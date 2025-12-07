import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { tournamentAPI } from "../../services/api";
import toast from "react-hot-toast";
import "./ManagePage.css";

export default function ManagePage() {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("DATE_NEWEST");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openSortMenu, setOpenSortMenu] = useState(false);

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await tournamentAPI.getAll();
        setTournaments(response.data || []);
      } catch (err) {
        console.error("Failed to load tournaments", err);
        setError("Failed to load tournaments");
        toast.error("Failed to load tournaments");
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, []);

  // Filtered and sorted tournaments
  const visibleTournaments = useMemo(() => {
    let list = [...tournaments];

    // Filter by search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((t) =>
        (t.title || "").toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      const aTitle = (a.title || "").toLowerCase();
      const bTitle = (b.title || "").toLowerCase();

      const aDate = a.startDate ? new Date(a.startDate) : null;
      const bDate = b.startDate ? new Date(b.startDate) : null;

      switch (sortBy) {
        case "DATE_OLDEST":
          if (aDate && bDate) return aDate.getTime() - bDate.getTime();
          if (aDate) return -1;
          if (bDate) return 1;
          return 0;
        case "NAME_AZ":
          return aTitle.localeCompare(bTitle);
        case "NAME_ZA":
          return bTitle.localeCompare(aTitle);
        case "DATE_NEWEST":
        default:
          if (aDate && bDate) return bDate.getTime() - aDate.getTime();
          if (aDate) return 1;
          if (bDate) return -1;
          return 0;
      }
    });

    return list;
  }, [tournaments, searchTerm, sortBy]);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCreateTournament = () => {
    navigate("/manage/new");
  };

  const handleCardClick = (id) => {
    navigate(`/manage/tournament/${id}/teams`);
  };

  const handleDeleteTournament = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this tournament? This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await tournamentAPI.delete(id);
      setTournaments((prev) => prev.filter((t) => t.id !== id));
      setOpenMenuId(null);
      toast.success("Tournament deleted");
    } catch (err) {
      console.error("Failed to delete tournament", err);
      toast.error(err.response?.data?.message || "Failed to delete tournament");
    }
  };

  const handleCopyTournament = async (id, includeTeams) => {
    try {
      const response = await tournamentAPI.copy(id, includeTeams);
      const newTournament = response.data;
      
      // Add the new copy to the top of the list
      setTournaments((prev) => [newTournament, ...prev]);
      setOpenMenuId(null);
      
      const copyType = includeTeams ? "with teams" : "without teams";
      toast.success(`Tournament copied (${copyType})`);
    } catch (err) {
      console.error("Failed to copy tournament", err);
      toast.error(err.response?.data?.message || "Failed to copy tournament");
    }
  };

  const sortByLabel = (option) => {
    switch (option) {
      case "DATE_OLDEST":
        return "Date (oldest)";
      case "NAME_AZ":
        return "Name (a–z)";
      case "NAME_ZA":
        return "Name (z–a)";
      case "DATE_NEWEST":
      default:
        return "Date (newest)";
    }
  };

  if (loading) {
    return (
      <main className="manage-page">
        <div className="manage-inner">
          <p className="manage-status-text">Loading tournaments…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="manage-page">
        <div className="manage-inner">
          <div className="manage-error-banner">{error}</div>
          <button
            className="manage-primary-btn"
            onClick={handleCreateTournament}
          >
            + New Tournament
          </button>
        </div>
      </main>
    );
  }

  // Empty state – no tournaments yet
  if (tournaments.length === 0) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-empty-card">
          <div className="dashboard-trophy" aria-hidden="true">
            🏆
          </div>
          <h1 className="dashboard-title">Welcome!</h1>
          <p className="dashboard-subtitle">
            Create your first tournament to get started.
          </p>
          <button
            className="manage-primary-btn"
            onClick={handleCreateTournament}
          >
            + New Tournament
          </button>
        </div>
      </main>
    );
  }

  // Non-empty state – list tournaments
  return (
    <main className="manage-page">
      <div className="manage-inner">
        <header className="manage-header-row">
          <div>
            <h1 className="manage-title">Tournaments</h1>
            <div className="manage-search-row">
              <div className="manage-search-wrapper">
                <span className="manage-search-icon" aria-hidden="true">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search tournaments…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="manage-header-actions">
            <div className="manage-sort-wrapper">
              <button
                type="button"
                className="manage-sort-btn"
                onClick={() => setOpenSortMenu((v) => !v)}
              >
                {sortByLabel(sortBy)}
                <span className="manage-sort-caret">▾</span>
              </button>
              {openSortMenu && (
                <div className="manage-sort-menu">
                  <button
                    type="button"
                    className={sortBy === "DATE_NEWEST" ? "active" : ""}
                    onClick={() => {
                      setSortBy("DATE_NEWEST");
                      setOpenSortMenu(false);
                    }}
                  >
                    Date (newest)
                  </button>
                  <button
                    type="button"
                    className={sortBy === "DATE_OLDEST" ? "active" : ""}
                    onClick={() => {
                      setSortBy("DATE_OLDEST");
                      setOpenSortMenu(false);
                    }}
                  >
                    Date (oldest)
                  </button>
                  <button
                    type="button"
                    className={sortBy === "NAME_AZ" ? "active" : ""}
                    onClick={() => {
                      setSortBy("NAME_AZ");
                      setOpenSortMenu(false);
                    }}
                  >
                    Name (a–z)
                  </button>
                  <button
                    type="button"
                    className={sortBy === "NAME_ZA" ? "active" : ""}
                    onClick={() => {
                      setSortBy("NAME_ZA");
                      setOpenSortMenu(false);
                    }}
                  >
                    Name (z–a)
                  </button>
                </div>
              )}
            </div>

            <button
              className="manage-primary-btn"
              type="button"
              onClick={handleCreateTournament}
            >
              + New Tournament
            </button>
          </div>
        </header>

        {visibleTournaments.length === 0 ? (
          <div className="manage-empty-state">
            <p>No tournaments found matching your search.</p>
          </div>
        ) : (
          <section className="manage-grid">
            {visibleTournaments.map((t) => (
              <article
                key={t.id}
                className="tournament-card"
                onClick={() => handleCardClick(t.id)}
              >
                <div className="tournament-card-main">
                  <div className="tournament-card-icon">🏆</div>
                  <div className="tournament-card-text">
                    <div className="tournament-card-title">{t.title}</div>
                    {t.primaryVenue && (
                      <div className="tournament-card-subtitle">
                        {t.primaryVenue}
                      </div>
                    )}
                  </div>
                </div>

                <div className="tournament-card-meta">
                  <span className="tournament-card-date">
                    {formatDate(t.startDate)}
                  </span>

                  <div
                    className="tournament-card-menu-wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="tournament-card-menu-btn"
                      onClick={() =>
                        setOpenMenuId((current) =>
                          current === t.id ? null : t.id
                        )
                      }
                    >
                      ⋮
                    </button>
                    {openMenuId === t.id && (
                      <div className="tournament-card-menu">
                        <button
                          type="button"
                          onClick={() => handleCopyTournament(t.id, true)}
                        >
                          Copy tournament (With teams)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyTournament(t.id, false)}
                        >
                          Copy tournament (Without teams)
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDeleteTournament(t.id)}
                        >
                          Delete tournament
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
