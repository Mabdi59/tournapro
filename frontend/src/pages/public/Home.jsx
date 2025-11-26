import { Link } from 'react-router-dom';
import './Public.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to TournaPro</h1>
      <p>The Ultimate Tournament Management Platform</p>
      <div className="home-actions">
        <Link to="/register" className="btn btn-primary">
          Get Started
        </Link>
        <Link to="/public/tournaments" className="btn btn-secondary">
          Browse Tournaments
        </Link>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Tournament Management</h3>
          <p>Create and manage tournaments with ease</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Team Organization</h3>
          <p>Organize teams and divisions efficiently</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Smart Scheduling</h3>
          <p>Automatic round-robin and bracket generation</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Live Results</h3>
          <p>Track and update match results in real-time</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
