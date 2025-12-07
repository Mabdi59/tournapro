import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTournamentContext } from "../../contexts/TournamentContext";
import "./Layout.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTitle } = useTournamentContext();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  // Check if we're on a tournament management page (not the wizard)
  const isOnTournamentManage = location.pathname.startsWith("/manage/tournament/");

  // If the user is in the wizard AND has typed a title, show that instead of TournaPro
  const isInTournamentFlow = location.pathname.startsWith("/manage/new");
  const mainTitle = isInTournamentFlow && currentTitle.trim().length > 0
    ? currentTitle
    : "TournaPro";

  const handleBackClick = () => {
    navigate("/manage");
  };

  const handleLogoClick = () => {
    // Only navigate to /manage if we're not on a tournament manage page
    if (!isOnTournamentManage) {
      navigate("/manage");
    }
  };

  return (
    <header className="tp-navbar">
      <div className="tp-left">
        {isOnTournamentManage && (
          <button
            className="tp-back-btn"
            type="button"
            onClick={handleBackClick}
            aria-label="Back to tournaments"
          >
            ←
          </button>
        )}
        
        <div className="tp-logo-wrapper" onClick={handleLogoClick} style={{ cursor: isOnTournamentManage ? 'default' : 'pointer' }}>
          <span className="tp-logo">🏆</span>
          <span className="tp-title">{mainTitle}</span>
        </div>
      </div>

      <div className="tp-right">
        {user && (
          <div className="tp-account-wrapper">
            <button className="tp-account-btn" onClick={toggleMenu}>
              Account
            </button>

            {open && (
              <div className="tp-dropdown">
                <div
                  className="tp-dropdown-item"
                  onClick={() => {
                    setOpen(false);
                    navigate("/manage/account");
                  }}
                >
                  Settings
                </div>

                <div
                  className="tp-dropdown-item tp-logout"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
