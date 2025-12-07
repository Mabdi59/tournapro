import { useEffect, useState } from "react";
import "./VenueAutocomplete.css";

export default function VenueAutocomplete({ value, onChange, placeholder = "Type a venue name or address" }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        
        // Using OpenStreetMap Nominatim API (free, no API key needed)
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(value)}&` +
          `format=json&` +
          `addressdetails=1&` +
          `limit=5&` +
          `countrycodes=us,ca,gb,au` // Adjust countries as needed
        );
        
        if (!resp.ok) throw new Error("Failed to fetch suggestions");
        
        const data = await resp.json();
        
        // Transform the response to our format
        const formatted = data.map((item) => ({
          id: item.place_id,
          name: item.name || item.display_name.split(',')[0],
          address: item.display_name,
          lat: item.lat,
          lon: item.lon,
        }));
        
        setSuggestions(formatted);
        setOpen(formatted.length > 0);
      } catch (err) {
        console.error("Venue autocomplete error:", err);
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(handle);
  }, [value]);

  const handleSelect = (suggestion) => {
    onChange(suggestion.address);
    setOpen(false);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setOpen(true);
  };

  const handleBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => setOpen(false), 200);
  };

  return (
    <div className="venue-autocomplete">
      <input
        type="text"
        className="wizard-input"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
      />

      {loading && <div className="venue-hint">Searching locations...</div>}

      {open && suggestions.length > 0 && (
        <ul className="venue-dropdown">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="venue-item"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur
                handleSelect(s);
              }}
            >
              <div className="venue-name">{s.name}</div>
              <div className="venue-address">{s.address}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
