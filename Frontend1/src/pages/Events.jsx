import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Home.css"; // Reuse premium variables

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/events");
      setEvents(res.data);
    } catch (error) {
      console.log("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // High-fidelity fallback events if backend is empty or offline
  const fallbackEvents = [
    {
      id: "fallback-1",
      title: "Global Tech Summit 2026",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      description: "Join tech pioneers and global innovators to discuss generative intelligence, autonomous agents, and next-gen cloud structures.",
      location: "San Francisco, CA",
      date: "2026-06-15",
      category: "Workshops",
    },
    {
      id: "fallback-2",
      title: "Summer Symphony Orchestra",
      image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
      description: "Experience a breathtaking evening of classical symphonies and modern arrangements under the starry Boston sky.",
      location: "Symphony Hall, Boston",
      date: "2026-07-08",
      category: "Concerts",
    },
    {
      id: "fallback-3",
      title: "health camps",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q",
      description: "Access free health diagnostics, professional wellness workshops, nutrition guidance, and yoga masterclasses.",
      location: "Central Park, NY",
      date: "2026-08-22",
      category: "Health Camps",
    },
    {
      id: "fallback-4",
      title: "Decentralized Startup Summit",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
      description: "Accelerate your project with Venture Capitalist panels, investment roundtables, pitch boards, and incubator connections.",
      location: "Silicon Valley, CA",
      date: "2026-09-10",
      category: "Seminars",
    },
    {
      id: "fallback-5",
      title: "Elysium College Carnivals",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
      description: "Join the ultimate collegiate celebration with live concerts, inter-college drama stages, competitive sports, and DJ night.",
      location: "State University Gym",
      date: "2026-10-04",
      category: "College Fests",
    },
    {
      id: "fallback-6",
      title: "Tree plantation drive",
      image: "https://media.istockphoto.com/id/2221018480/photo/two-people-are-planting-a-tree-in-the-dirt.webp?a=1&b=1&s=612x612&w=0&k=20&c=_CCyjgyhw0tFf0Dl8OGZlXizCr7QOuGwXO7ujY8zEzM=",
      description: "a collaborative community initiative aimed at planting saplings to combat climate change, restore ecosystems, and promote environmental awareness.",
      location: "Aditya Institute Techonology And Management",
      date: "2026-11-04",
      category: "Tree plantation",
    }
  ];

  const allEvents = events.length > 0 ? events : fallbackEvents;

  // Filter events based on search query and category tab
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" ||
      (event.category && event.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      // Handle fallback category tags vs exact matches
      (event.category === undefined && selectedCategory === "Workshops");

    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Workshops", "Concerts", "Seminars", "Health Camps", "College Fests"];

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
          <div className="section-tag">Catalog</div>
          <h1 className="section-title">Sparkling Occasions</h1>
          <p className="section-subtitle" style={{ marginBottom: "30px" }}>
            Explore workshops, executive summits, medical gatherings, and cultural stages. Filter and book your tickets instantly.
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
                placeholder="Search event title, venue, descriptors..."
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
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat) {
                    e.target.style.background = "rgba(255,255,255,0.09)";
                    e.target.style.borderColor = "var(--glass-border-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat) {
                    e.target.style.background = "rgba(255,255,255,0.04)";
                    e.target.style.borderColor = "var(--glass-border)";
                  }
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
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-5 glass-panel p-5" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <span style={{ fontSize: "3rem" }}>🧐</span>
            <h3 className="mt-3 font-heading" style={{ fontWeight: 800 }}>No Events Found</h3>
            <p className="text-secondary mt-2 mb-0">
              We couldn't find any events matching your search or category choice. Try checking spelling or using a different tab!
            </p>
          </div>
        ) : (
          <div className="events-flex-grid">
            {filteredEvents.map((event) => (
              <div className="glass-panel premium-event-card" key={event.id || event._id}>
                <div className="event-img-wrapper">
                  <img src={event.image} alt={event.title} />
                  <span className="event-category-tag">{event.category || "Featured"}</span>
                </div>
                <div className="event-card-body text-start">
                  <div className="event-date-loc">
                    <span>📅 {event.date}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <h3 className="event-card-title">{event.title}</h3>
                  <p className="event-card-desc">
                    {event.description && event.description.length > 120
                      ? `${event.description.substring(0, 115)}...`
                      : event.description}
                  </p>
                  <div className="event-card-footer">
                    <Link to={`/event/${event.id || event._id}`} className="event-btn-detail">
                      More Details
                    </Link>
                    <Link to={`/bookingEvent/${event.id || event._id}`} className="event-btn-book">
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