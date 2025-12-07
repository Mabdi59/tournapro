import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTournamentContext } from "../../contexts/TournamentContext";
import { tournamentAPI } from "../../services/api";
import VenueAutocomplete from "../../components/VenueAutocomplete";
import "./NewTournamentWizard.css";

const emptyForm = {
  title: "",
  dates: [new Date().toISOString().slice(0, 10)],
  venues: [""],
  divisions: [""],
};

export default function NewTournamentWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const navigate = useNavigate();
  const { setCurrentTitle } = useTournamentContext();

  const goBackToManage = () => {
    setCurrentTitle(""); // Clear title when leaving wizard
    navigate("/manage");
  };

  const handleCreate = async () => {
    try {
      if (!form.title.trim()) {
        toast.error("Tournament title is required");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to create a tournament");
        navigate("/login");
        return;
      }

      const startDate = form.dates.find(d => d.trim()) || new Date().toISOString().slice(0, 10);
      const primaryVenue = form.venues.find(v => v.trim()) || null;

      const tournamentData = {
        title: form.title.trim(),
        startDate: startDate,
        primaryVenue: primaryVenue,
      };

      const response = await tournamentAPI.create(tournamentData);
      const tournamentId = response.data.id;

      toast.success(`Tournament "${form.title}" created successfully!`);
      navigate(`/manage/tournament/${tournamentId}/teams`);
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;
        let errorMessage = errorData.message || "Failed to create tournament";
        
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map(e => e.message).join(", ");
        }
        
        if (status === 401 || status === 403) {
          toast.error("Authentication failed. Please log in again.");
          navigate("/login");
        } else if (status === 400) {
          toast.error(`Validation error: ${errorMessage}`);
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Cannot connect to server.");
      }
    }
  };

  // Update context whenever title changes
  useEffect(() => {
    setCurrentTitle(form.title);
  }, [form.title, setCurrentTitle]);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const addDate = () => updateField("dates", [...form.dates, ""]);
  const changeDate = (i, v) => {
    const next = [...form.dates];
    next[i] = v;
    updateField("dates", next);
  };

  const addVenue = () => updateField("venues", [...form.venues, ""]);
  const changeVenue = (i, v) => {
    const next = [...form.venues];
    next[i] = v;
    updateField("venues", next);
  };

  const addDivision = () => updateField("divisions", [...form.divisions, ""]);
  const changeDivision = (i, v) => {
    const next = [...form.divisions];
    next[i] = v;
    updateField("divisions", next);
  };

  return (
    <main className="wizard-page">
      <div className="wizard-card">
        <div className="wizard-tabs">
          <div className={`wizard-tab ${step === 1 ? "active" : ""}`} />
          <div className={`wizard-tab ${step === 2 ? "active" : ""}`} />
          <div className={`wizard-tab ${step === 3 ? "active" : ""}`} />
        </div>

        {/* --------------------------- STEP 1 --------------------------- */}
        {step === 1 && (
          <section>
            <h1 className="wizard-title">New tournament</h1>
            <p className="wizard-subtitle">All information can be changed later.</p>

            <label className="wizard-label">
              Tournament title
              <input
                className="wizard-input"
                type="text"
                value={form.title}
                onChange={e => updateField("title", e.target.value)}
                placeholder="City Cup 2025"
              />
            </label>

            <label className="wizard-label">
              Date
              {form.dates.map((d, i) => (
                <input
                  key={i}
                  className="wizard-input"
                  type="date"
                  value={d}
                  onChange={e => changeDate(i, e.target.value)}
                />
              ))}
            </label>

            <button type="button" className="wizard-secondary-btn" onClick={addDate}>
              Add another day
            </button>

            <div className="wizard-footer">
              <button className="wizard-text-btn" onClick={goBackToManage}>Cancel</button>
              <button
                className="wizard-primary-btn"
                onClick={() => setStep(2)}
                disabled={!form.title.trim()}
              >
                Next
              </button>
            </div>
          </section>
        )}

        {/* --------------------------- STEP 2 --------------------------- */}
        {step === 2 && (
          <section>
            <h1 className="wizard-title">Choose a venue</h1>
            <p className="wizard-subtitle">Search for real addresses and venues.</p>

            <label className="wizard-label">
              Venue
              {form.venues.map((v, i) => (
                <VenueAutocomplete
                  key={i}
                  value={v}
                  onChange={(newValue) => changeVenue(i, newValue)}
                  placeholder="Search for venue or address..."
                />
              ))}
            </label>

            <button type="button" className="wizard-secondary-btn" onClick={addVenue}>
              Add another venue
            </button>

            <div className="wizard-footer">
              <button className="wizard-text-btn" onClick={() => setStep(1)}>Back</button>
              <button className="wizard-primary-btn" onClick={() => setStep(3)}>
                Next
              </button>
            </div>
          </section>
        )}

        {/* --------------------------- STEP 3 --------------------------- */}
        {step === 3 && (
          <section>
            <h1 className="wizard-title">Participants</h1>
            <p className="wizard-subtitle">
              Add divisions (age groups, categories, levels).
            </p>

            <label className="wizard-label">
              Division
              {form.divisions.map((div, i) => (
                <input
                  key={i}
                  className="wizard-input"
                  type="text"
                  value={div}
                  onChange={e => changeDivision(i, e.target.value)}
                  placeholder="U12 Boys, Open, Elite..."
                />
              ))}
            </label>

            <button type="button" className="wizard-secondary-btn" onClick={addDivision}>
              Add another division
            </button>

            <div className="wizard-footer">
              <button className="wizard-text-btn" onClick={() => setStep(2)}>Back</button>
              <button className="wizard-primary-btn" onClick={handleCreate}>
                Create
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
