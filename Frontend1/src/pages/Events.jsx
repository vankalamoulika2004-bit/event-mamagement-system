import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import "./Home.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;
    API.get("/events")
      .then((res) => {
        if (isMounted) {
          setEvents(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((error) => {
        console.log("Error fetching events:", error);
        if (isMounted) {
          setEvents([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
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
    const catLower = String(eventCat).toLowerCase();
    switch (selectedCat) {
      case "Cultural":
        return catLower.includes("cultural") || catLower.includes("fest") || catLower.includes("concert") || catLower.includes("dance") || catLower.includes("singing");
      case "Technical":
        return catLower.includes("technical") || catLower.includes("workshop") || catLower.includes("hackathon") || catLower.includes("tech");
      case "Academic":
        return catLower.includes("academic") || catLower.includes("seminar") || catLower.includes("conference");
      case "Sports":
        return catLower.includes("sports") || catLower.includes("tournament") || catLower.includes("athletic");
      case "Arts & Literature":
        return catLower.includes("arts") || catLower.includes("literature") || catLower.includes("drama") || catLower.includes("rangoli");
      case "Social & Environmental":
        return catLower.includes("social") || catLower.includes("environmental") || catLower.includes("camp") || catLower.includes("plantation") || catLower.includes("health");
      default:
        return catLower.includes(selectedCat.toLowerCase());
    }
  };

  // Filter events based on search query and category tab (fully guarded against null/undefined)
  const filteredEvents = (Array.isArray(events) ? events : []).filter((event) => {
    if (!event) return false;
    const q = (searchQuery || "").trim().toLowerCase();
    const title = (event.title || "").toLowerCase();
    const desc = (event.description || "").toLowerCase();
    const loc = (event.location || "").toLowerCase();
    const cat = (event.category || "").toLowerCase();

    const matchesSearch = !q || title.includes(q) || desc.includes(q) || loc.includes(q) || cat.includes(q);
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
                  setSearchParams(e.target.value ? { search: e.target.value } : {});
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
          <Loader message="Loading events catalog..." />
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
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;