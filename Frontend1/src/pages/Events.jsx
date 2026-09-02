import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../services/api";
import "./Home.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");

  async function fetchEvents() {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.log("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchEvents();
    }, 0);
  }, []);

  const categories = [
    "All",
    "Cultural",
    "Technical",
    "Academic",
    "Sports",
    "Arts & Literature",
    "Social & Environmental"
  ];

  // Category matching helper
  const matchesCategoryTag = (eventCat, selectedCat) => {
    if (selectedCat === "All") return true;
    if (!eventCat) return false;
    const catLower = eventCat.toLowerCase();
    switch (selectedCat) {
      case "Cultural":
        return catLower.includes("cultural");
      case "Technical":
        return catLower.includes("technical");
      case "Academic":
        return catLower.includes("academic");
      case "Sports":
        return catLower.includes("sports");
      case "Arts & Literature":
        return catLower.includes("arts") || catLower.includes("literature");
      case "Social & Environmental":
        return catLower.includes("social") || catLower.includes("environmental");
      default:
        return catLower.includes(selectedCat.toLowerCase());
    }
  };

  // Filter events based on search query and category tab
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = matchesCategoryTag(event.category, selectedCategory);

    return matchesSearch && matchesCat;
  });

  return (
    <div
      className="home-wrapper"
      style={{
        paddingTop: "140px",
        paddingBottom: "100px",
      }}
    >
      {/* Background glow blobs */}
      <div className="glow-blob-container">
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-2" style={{ bottom: "-10%" }}></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="text-center mb-5">
          <div className="section-tag">College Catalog</div>
          <h1 className="section-title">Evinto Events Directory</h1>
          <p className="section-subtitle" style={{ marginBottom: "30px" }}>
            Explore Cultural, Technical, Academic, Sports, Arts, and Environmental competitions. Filter and book your seats instantly.
          </p>

          {/* Search bar console */}
          <div className="d-flex justify-content-center mb-4">
            <div
              className="glass-panel search-bar-container w-100"
              style={{ maxWidth: "600px", padding: "8px" }}
            >
              <span style={{ fontSize: "1.2rem", paddingLeft: "15px", color: "#64748b" }}>🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by event name, location, keyword..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchParams({ search: e.target.value });
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchParams({});
                  }}
                  className="btn btn-sm text-secondary me-2 border-0 bg-transparent"
                  style={{ fontSize: "0.95rem" }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Selector Tabs */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="btn"
                style={{
                  background: selectedCategory === cat ? "var(--grad-primary)" : "rgba(255,255,255,0.04)",
                  border: selectedCategory === cat ? "none" : "1px solid var(--glass-border)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "100px",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  transition: "all 0.3s ease",
                  boxShadow: selectedCategory === cat ? "0 4px 15px rgba(168, 85, 247, 0.35)" : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading events...</span>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-5 glass-panel p-5" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <span style={{ fontSize: "3rem" }}>🧐</span>
            <h3 className="mt-3 font-heading" style={{ fontWeight: 800 }}>No Events Found</h3>
            <p className="text-secondary mt-2 mb-0">
              We couldn't find any events matching your search or category choice. Try selecting a different tab!
            </p>
          </div>
        ) : (
          <div className="events-flex-grid">
            {filteredEvents.map((event) => (
              <div className="glass-panel premium-event-card d-flex flex-column" key={event._id || event.id}>
                <div className="event-img-wrapper" style={{ position: "relative" }}>
                  <img src={event.image} alt={event.title} />
                  <span className="event-category-tag">{event.category || "General"}</span>
                  <span
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      background: "rgba(16, 185, 129, 0.9)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.88rem",
                      padding: "4px 12px",
                      borderRadius: "100px",
                      backdropFilter: "blur(10px)"
                    }}
                  >
                    ₹{event.price}
                  </span>
                </div>
                <div className="event-card-body text-start d-flex flex-column flex-grow-1">
                  <div className="event-date-loc mb-2" style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                    <span>📅 {event.date}</span>
                    <span>⏰ {event.time || "10:00 AM"}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <h3 className="event-card-title mb-2">{event.title}</h3>
                  <p className="event-card-desc flex-grow-1">
                    {event.description && event.description.length > 110
                      ? `${event.description.substring(0, 105)}...`
                      : event.description}
                  </p>
                  <div className="event-card-footer mt-auto pt-3">
                    <Link to={`/event/${event._id || event.id}`} className="event-btn-detail">
                      More Details
                    </Link>
                    <Link to={`/bookingEvent/${event._id || event.id}`} className="event-btn-book">
                      Book Seat
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;