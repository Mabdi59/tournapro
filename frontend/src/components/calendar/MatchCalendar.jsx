import { useState } from 'react';
import './Calendar.css';

function MatchCalendar({ matches, onMatchClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month' or 'week'

  // Get calendar data
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Get week days
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Get matches for a specific date
  const getMatchesForDate = (date) => {
    return matches.filter(match => {
      if (!match.scheduledTime) return false;
      const matchDate = new Date(match.scheduledTime);
      return (
        matchDate.getFullYear() === date.getFullYear() &&
        matchDate.getMonth() === date.getMonth() &&
        matchDate.getDate() === date.getDate()
      );
    });
  };

  // Navigation
  const previousPeriod = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const nextPeriod = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format time
  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // Check if date is current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const days = view === 'month' ? getCalendarDays() : getWeekDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const scheduledMatchCount = matches.filter(m => m.scheduledTime).length;
  const totalMatchCount = matches.length;

  return (
    <div className="match-calendar">
      {/* Calendar Header */}
      <div className="calendar-header">
        <div className="calendar-header-left">
          <h2>
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          <div className="calendar-stats">
            <span className="stat-badge">
              📅 {scheduledMatchCount}/{totalMatchCount} matches scheduled
            </span>
          </div>
        </div>
        
        <div className="calendar-controls">
          <button onClick={goToToday} className="btn-today">
            Today
          </button>
          <button onClick={previousPeriod} className="btn-nav">
            ◀
          </button>
          <button onClick={nextPeriod} className="btn-nav">
            ▶
          </button>
          <div className="view-toggle">
            <button 
              className={`btn-view ${view === 'month' ? 'active' : ''}`}
              onClick={() => setView('month')}
            >
              Month
            </button>
            <button 
              className={`btn-view ${view === 'week' ? 'active' : ''}`}
              onClick={() => setView('week')}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day Names Header */}
        {dayNames.map(day => (
          <div key={day} className="calendar-day-name">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((date, index) => {
          const dayMatches = getMatchesForDate(date);
          const isCurrentDay = isToday(date);
          const isThisMonth = isCurrentMonth(date);

          return (
            <div 
              key={index} 
              className={`calendar-day ${!isThisMonth && view === 'month' ? 'other-month' : ''} ${isCurrentDay ? 'today' : ''}`}
            >
              <div className="day-header">
                <span className="day-number">{date.getDate()}</span>
                {dayMatches.length > 0 && (
                  <span className="match-count-badge">{dayMatches.length}</span>
                )}
              </div>
              
              <div className="day-matches">
                {dayMatches.slice(0, 3).map((match) => (
                  <div 
                    key={match.id} 
                    className={`calendar-match ${match.status.toLowerCase()}`}
                    onClick={() => onMatchClick(match)}
                  >
                    <div className="match-time">{formatTime(match.scheduledTime)}</div>
                    <div className="match-teams">
                      {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'}
                    </div>
                    {match.venue && (
                      <div className="match-venue">📍 {match.venue}</div>
                    )}
                  </div>
                ))}
                {dayMatches.length > 3 && (
                  <div className="more-matches">
                    +{dayMatches.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot completed"></span>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot in_progress"></span>
          <span>In Progress</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot scheduled"></span>
          <span>Scheduled</span>
        </div>
      </div>
    </div>
  );
}

export default MatchCalendar;
