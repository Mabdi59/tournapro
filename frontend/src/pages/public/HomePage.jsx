import { useState } from "react";
import "./HomePage.css";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="tp-root">
      {/* Mobile Menu Overlay */}
      <div 
        className={`tp-mobile-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={closeMobileMenu}
      />
      
      {/* NAVBAR */}
      <header className="tp-nav">
        <div className="tp-container tp-nav-inner">
          <div className="tp-logo">TournaPro</div>
          <button 
            className="tp-nav-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
          <nav className={`tp-nav-links ${mobileMenuOpen ? "active" : ""}`}>
            <a href="/login" onClick={closeMobileMenu}>Login</a>
            <a href="/register" className="tp-nav-cta" onClick={closeMobileMenu}>
              Get Started
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="tp-hero">
          <div className="tp-container tp-hero-inner">
            <div className="tp-hero-text">
              <span className="tp-pill">Sports Management</span>
              <h1>
                Plan your next tournament
                <br />
                with <span className="tp-highlight">TournaPro</span>
              </h1>
              <p className="tp-hero-subtitle">
                From registration to live scores, TournaPro handles every step
                of your event so you can focus on the game.
              </p>
              <div className="tp-hero-actions">
                <a href="/register" className="tp-btn tp-btn-primary">
                  Create a free tournament
                </a>
                <button className="tp-btn tp-btn-ghost">
                  Watch how it works
                </button>
              </div>
              <ul className="tp-hero-bullets">
                <li>Quick, flexible match scheduler</li>
                <li>Beautiful live presentation on any screen</li>
                <li>Online registration for teams and players</li>
              </ul>
            </div>

            {/* Fake app preview / mockup */}
            <div className="tp-hero-preview">
              <div className="tp-phone-frame">
                <div className="tp-phone-header">
                  <span className="tp-dot" />
                  <span className="tp-dot" />
                  <span className="tp-dot" />
                </div>
                <div className="tp-phone-body">
                  <div className="tp-phone-tournament-title">
                    City Cup 2025
                  </div>
                  <div className="tp-phone-tabs">
                    <button className="active">Standings</button>
                    <button>Schedule</button>
                    <button>Teams</button>
                  </div>
                  <div className="tp-phone-table">
                    <div className="tp-phone-row tp-phone-row-head">
                      <span>Team</span>
                      <span>PLD</span>
                      <span>PTS</span>
                    </div>
                    <div className="tp-phone-row">
                      <span>Lions FC</span>
                      <span>3</span>
                      <span>9</span>
                    </div>
                    <div className="tp-phone-row">
                      <span>Downtown United</span>
                      <span>3</span>
                      <span>6</span>
                    </div>
                    <div className="tp-phone-row">
                      <span>Riverside</span>
                      <span>3</span>
                      <span>3</span>
                    </div>
                    <div className="tp-phone-row">
                      <span>Northside</span>
                      <span>3</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="tp-hero-caption">
                Live standings and schedules update instantly for players and
                fans.
              </p>
            </div>
          </div>
        </section>

        {/* FLOW SECTION */}
        <section className="tp-section tp-section-alt">
          <div className="tp-container tp-two-col">
            <div>
              <h2>No more spreadsheets</h2>
              <p className="tp-section-subtitle">
                TournaPro is your all-in-one control center for tournaments.
                Build brackets, schedules and live pages in minutes.
              </p>

              <ol className="tp-steps">
                <li>
                  <h3>1. Manage teams</h3>
                  <p>Add teams manually or share a registration link.</p>
                </li>
                <li>
                  <h3>2. Pick your format</h3>
                  <p>Groups, brackets or single matches – mix and match.</p>
                </li>
                <li>
                  <h3>3. Create schedules</h3>
                  <p>
                    Auto-generate match times and fields, then fine-tune with
                    drag &amp; drop.
                  </p>
                </li>
                <li>
                  <h3>4. Keep scores</h3>
                  <p>
                    Enter results from any device and let standings update
                    themselves.
                  </p>
                </li>
              </ol>
            </div>

            <div className="tp-card tp-schedule-card">
              <div className="tp-schedule-header">
                City Cup · Pitch 1
                <span className="tp-badge">Today</span>
              </div>
              <div className="tp-schedule-list">
                <div className="tp-schedule-item">
                  <div>
                    10:00 · Lions FC vs Downtown United
                    <span className="tp-tag">Group A</span>
                  </div>
                  <span className="tp-score-placeholder">– : –</span>
                </div>
                <div className="tp-schedule-item">
                  <div>
                    11:15 · Riverside vs Northside
                    <span className="tp-tag">Group A</span>
                  </div>
                  <span className="tp-score-placeholder">– : –</span>
                </div>
                <div className="tp-schedule-item">
                  <div>
                    12:30 · Winner A vs Runner-up B
                    <span className="tp-tag tp-tag-accent">Semi-final</span>
                  </div>
                  <span className="tp-score-placeholder">– : –</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRESENTATION SECTION */}
        <section className="tp-section">
          <div className="tp-container tp-two-col tp-two-col-reverse">
            <div className="tp-presentation-mock">
              <div className="tp-screen">
                <div className="tp-screen-header">
                  City Cup 2025 · Finals Bracket
                </div>
                <div className="tp-bracket">
                  <div className="tp-bracket-column">
                    <div className="tp-bracket-match">
                      Lions FC
                      <span className="tp-match-score">3</span>
                    </div>
                    <div className="tp-bracket-match">
                      Downtown United
                      <span className="tp-match-score">1</span>
                    </div>
                  </div>
                  <div className="tp-bracket-column tp-bracket-column-center">
                    <div className="tp-bracket-match tp-bracket-final">
                      Lions FC
                      <span className="tp-match-score">2</span>
                    </div>
                  </div>
                  <div className="tp-bracket-column">
                    <div className="tp-trophy">🏆</div>
                    <div className="tp-bracket-label">Champions</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2>Run a professional-looking event</h2>
              <p className="tp-section-subtitle">
                Share live brackets, schedules and standings on TVs, phones or
                the web. No design skills needed.
              </p>

              <div className="tp-feature-list">
                <div className="tp-feature-item">
                  <h3>Tournament website</h3>
                  <p>
                    Give your event its own page with branding, sponsors and
                    all match info in one place.
                  </p>
                </div>
                <div className="tp-feature-item">
                  <h3>Mobile-friendly</h3>
                  <p>
                    Players and fans can check today&apos;s matches, fields and
                    results on the go.
                  </p>
                </div>
                <div className="tp-feature-item">
                  <h3>Slideshow mode</h3>
                  <p>
                    Use a projector or TV to show rotating slides with today&apos;s
                    fixtures, scores and brackets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="tp-section tp-section-alt">
          <div className="tp-container">
            <h2 className="tp-center">What organizers say</h2>
            <p className="tp-section-subtitle tp-center">
              TournaPro helps clubs, schools and leagues run smooth,
              stress-free tournaments.
            </p>

            <div className="tp-testimonials">
              <div className="tp-card tp-testimonial-card">
                <p>
                  &quot;TournaPro turned our weekend tournament into a breeze.
                  Teams loved checking their schedule online and we didn&apos;t
                  touch Excel once.&quot;
                </p>
                <div className="tp-testimonial-author">
                  <span className="tp-avatar">CB</span>
                  <div>
                    <div className="tp-author-name">Chris Brown</div>
                    <div className="tp-author-role">
                      Youth Coordinator, Metro FC
                    </div>
                  </div>
                </div>
              </div>

              <div className="tp-card tp-testimonial-card">
                <p>
                  &quot;Rescheduling matches due to weather used to be chaos.
                  Now we drag, drop and everyone sees the update instantly.&quot;
                </p>
                <div className="tp-testimonial-author">
                  <span className="tp-avatar">AL</span>
                  <div>
                    <div className="tp-author-name">Alex Lee</div>
                    <div className="tp-author-role">
                      Tournament Director, City Sports Fest
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="tp-section">
          <div className="tp-container">
            <h2 className="tp-center">Simple pricing for every event</h2>
            <p className="tp-section-subtitle tp-center">
              Start free. Upgrade only when you need more teams and advanced
              features.
            </p>

            <div className="tp-pricing-grid">
              <div className="tp-card tp-pricing-card">
                <div className="tp-pricing-label">Amateur</div>
                <div className="tp-price">$0</div>
                <div className="tp-price-note">per tournament</div>
                <ul>
                  <li>Up to 8 teams</li>
                  <li>Basic formats</li>
                  <li>Public tournament page</li>
                </ul>
                <button className="tp-btn tp-btn-outline">Start free</button>
              </div>

              <div className="tp-card tp-pricing-card tp-pricing-card-featured">
                <div className="tp-pricing-label">Club</div>
                <div className="tp-price">$49</div>
                <div className="tp-price-note">per tournament</div>
                <ul>
                  <li>Up to 64 teams</li>
                  <li>Custom branding</li>
                  <li>Advanced scheduling tools</li>
                  <li>Sponsor listings</li>
                </ul>
                <button className="tp-btn tp-btn-primary">
                  Most popular plan
                </button>
              </div>

              <div className="tp-card tp-pricing-card">
                <div className="tp-pricing-label">Pro</div>
                <div className="tp-price">Contact us</div>
                <div className="tp-price-note">for multi-event deals</div>
                <ul>
                  <li>Unlimited teams</li>
                  <li>Multiple admins</li>
                  <li>Priority support</li>
                </ul>
                <button className="tp-btn tp-btn-outline">
                  Talk to our team
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="tp-section tp-section-alt">
          <div className="tp-container tp-faq">
            <h2 className="tp-center">Frequently asked questions</h2>
            <div className="tp-faq-grid">
              <div className="tp-faq-item">
                <h3>Is there a free version?</h3>
                <p>
                  Yes. You can fully set up and run smaller tournaments with the
                  free plan and upgrade later if needed.
                </p>
              </div>
              <div className="tp-faq-item">
                <h3>Which sports do you support?</h3>
                <p>
                  TournaPro works for almost any team or solo sport: soccer,
                  basketball, volleyball, futsal and more.
                </p>
              </div>
              <div className="tp-faq-item">
                <h3>Do I need to install anything?</h3>
                <p>
                  No. TournaPro runs in your browser. Players and fans can
                  access schedules from any device.
                </p>
              </div>
              <div className="tp-faq-item">
                <h3>Can you help me set up my event?</h3>
                <p>
                  For larger tournaments we offer onboarding support to help you
                  configure formats, fields and schedules.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="tp-section">
          <div className="tp-container tp-final-cta">
            <h2>Ready to run your next tournament with TournaPro?</h2>
            <p>
              Create your first event for free and see how much time you can
              save.
            </p>
            <div className="tp-hero-actions tp-center">
              <a href="/register" className="tp-btn tp-btn-primary">
                Create a free tournament
              </a>
              <a href="/public/tournaments" className="tp-btn tp-btn-ghost">
                Browse public tournaments
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="tp-footer">
        <div className="tp-container tp-footer-inner">
          <div>
            <div className="tp-logo">TournaPro</div>
            <p className="tp-footer-copy">
              © {new Date().getFullYear()} TournaPro. All rights reserved.
            </p>
          </div>
          <div className="tp-footer-columns">
            <div>
              <h4>Product</h4>
              <a href="#pricing">Pricing</a>
              <a href="/public/tournaments">Browse tournaments</a>
            </div>
            <div>
              <h4>Support</h4>
              <a href="/help">Help center</a>
              <a href="/contact">Contact</a>
            </div>
            <div>
              <h4>Learn</h4>
              <a href="/guides">Tournament guide</a>
              <a href="/sports">Sports</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
