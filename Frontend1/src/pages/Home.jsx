import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchEvents() {
    try {
      const res = await axios.get("http://localhost:8080/api/events");
      // Pick first 3 events as featured ones
      if (Array.isArray(res.data) && res.data.length > 0) {
        setEvents(res.data.slice(0, 3));
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.log("Error fetching events, using fallbacks:", error);
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

  // High-fidelity fallback events if backend is empty or offline
  const fallbackEvents = [
    {
      id: "fallback-1",
      title: "Global Tech Summit 2026",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      description: "Join tech pioneers and global innovators to discuss generative intelligence, autonomous agents, and next-gen cloud structures.",
      location: "San Francisco, CA",
      date: "June 15, 2026",
      category: "Workshops",
    },
    {
      id: "fallback-2",
      title: "Summer Symphony Orchestra",
      image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
      description: "Experience a breathtaking evening of classical symphonies and modern arrangements under the starry Boston sky.",
      location: "Symphony Hall, Boston",
      date: "July 08, 2026",
      category: "Concerts",
    },
    {
      id: "fallback-3",
      title: "National Health & Wellness Expo",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop",
      description: "Access free health diagnostics, professional wellness workshops, nutrition guidance, and yoga masterclasses.",
      location: "Central Park, NY",
      date: "August 22, 2026",
      category: "Health Camps",
    },
  ];

  const displayedEvents = events.length > 0 ? events : fallbackEvents;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirect to events page with query parameter if desired, or standard events page
    window.location.href = `/events?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="home-wrapper">
      {/* Ambient background blur circles */}
      <div className="glow-blob-container">
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-2"></div>
        <div className="glow-blob blob-3"></div>
      </div>

      {/* 1. Hero Section */}
      <section className="container hero-section">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0 text-start">
            <div className="hero-badge">
              <span></span> Celebrating Life & Knowledge
            </div>
            <h1 className="hero-title">
              Crafting <br />
              <span className="text-gradient">Experiences</span> <br />
              That Inspire
            </h1>
            <p className="hero-desc">
              Discover and book premier seminars, high-energy college fests, corporate conferences, and medical wellness camps. Evinto brings celebrations and knowledge hubs right to your fingertips.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <Link to="/events" className="btn-grad">
                🎟️ Discover Events
              </Link>
              <Link to="/contact" className="btn-glass">
                Learn More
              </Link>
            </div>

            {/* Quick search panel */}
            <form onSubmit={handleSearchSubmit} className="glass-panel search-bar-container">
              <span style={{ fontSize: "1.2rem", paddingLeft: "15px", color: "#64748b" }}>🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search workshops, fests, concerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn-grad" style={{ padding: "8px 20px", fontSize: "0.9rem" }}>
                Search
              </button>
            </form>
          </div>

          <div className="col-lg-6 d-flex justify-content-center position-relative">
            <div className="hero-graphic-panel">
              {/* Floating element 1 */}
              <div className="glass-panel hero-floating-stat fs-1">
                <div className="stat-icon-circle sic-purple">🚀</div>
                <div>
                  <div className="floating-stat-num">50+</div>
                  <div className="floating-stat-lbl">Active Events</div>
                </div>
              </div>

              {/* Floating element 2 */}
              <div className="glass-panel hero-floating-stat fs-2">
                <div className="stat-icon-circle sic-pink">💖</div>
                <div>
                  <div className="floating-stat-num">12k+</div>
                  <div className="floating-stat-lbl">Happy Bookings</div>
                </div>
              </div>

              {/* Main premium illustration card */}
              <div className="hero-main-card">
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop"
                  alt="Premium Event Gathering"
                />
                <div className="hero-card-info">
                  <h4 style={{ fontWeight: 800, fontFamily: "Outfit, sans-serif" }}>Vibrant Networking Fests</h4>
                  <p style={{ color: "#cbd5e1", fontSize: "0.85rem", margin: 0 }}>
                    Experience ultimate collaborations, lively stages, and memorable milestones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Metrics Counter Section */}
      <section className="container section-container py-5">
        <div className="glass-panel p-5">
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">98%</div>
              <div className="metric-label">SATISFACTION RATING</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">150+</div>
              <div className="metric-label">HOSTED CONFERENCES</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">25k+</div>
              <div className="metric-label">REGISTERED USERS</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">0s</div>
              <div className="metric-label">BOOKING LATENCY</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Event Categories Showcase */}
      <section className="container section-container text-center">
        <div className="section-tag">Categories</div>
        <h2 className="section-title">Designed for Every Occasion</h2>
        <p className="section-subtitle">
          Whether you want to upgrade your skills, network with global industry pioneers, or rock out at a music festival, we have you covered.
        </p>

        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="glass-panel category-card cat-tech">
              <div className="category-icon cat-icon-1">💻</div>
              <h3 className="category-title">Tech & Workshops</h3>
              <p className="category-desc">Seminars, hackathons, and bootcamp labs discussing the state of the art.</p>
              <Link to="/events" className="category-link">Explore Workshops &rarr;</Link>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="glass-panel category-card cat-fest">
              <div className="category-icon cat-icon-2">🎸</div>
              <h3 className="category-title">Cultural Fests</h3>
              <p className="category-desc">Lively dance, musical stages, dramatic fests, and multi-collegiate carnivals.</p>
              <Link to="/events" className="category-link">Explore Festivals &rarr;</Link>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="glass-panel category-card cat-biz">
              <div className="category-icon cat-icon-3">📊</div>
              <h3 className="category-title">Seminars & Biz</h3>
              <p className="category-desc">Business summits, investment boards, pitch decks, and startup acceleration.</p>
              <Link to="/events" className="category-link">Explore Seminars &rarr;</Link>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="glass-panel category-card cat-camp">
              <div className="category-icon cat-icon-4">🩺</div>
              <h3 className="category-title">Health Camps</h3>
              <p className="category-desc">Community medical consultations, wellness workshops, and checkup camps.</p>
              <Link to="/events" className="category-link">Explore Camps &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Upcoming & Live Events Section */}
      <section className="container section-container text-center">
        <div className="section-tag">Upcoming Experiences</div>
        <h2 className="section-title">⚡ High-Energy Live Events</h2>
        <p className="section-subtitle">
          Grab your tickets before they sell out! Immerse yourself in our highly anticipated events hosted by certified organizations.
        </p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="events-flex-grid">
            {displayedEvents.map((event) => (
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
      </section>

      {/* 5. Features & Core Value Section */}
      <section className="container section-container">
        <div className="feature-row">
          <div className="col-lg-5 text-start">
            <div className="section-tag">Core Capabilities</div>
            <h2 className="section-title" style={{ fontSize: "2.4rem" }}>
              Simplifying Event Management For Everyone
            </h2>
            <p className="hero-desc" style={{ fontSize: "1.1rem" }}>
              Evinto provides a comprehensive toolkit for attendees to secure seating and event hosts to scale registration seamlessly. Experience top-tier operations and lightning-fast confirmations.
            </p>
            <div className="mt-4">
              <Link to="/register" className="btn-grad">
                Get Started Now &rarr;
              </Link>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="feature-cards-col">
              <div className="glass-panel feature-mini-card">
                <div className="feature-mini-icon fmic-1">⚡</div>
                <h4 className="feature-mini-title">Instant Seat Booking</h4>
                <p className="feature-mini-desc">Register and secure your badge in under 30 seconds with automatic ticket generation.</p>
              </div>

              <div className="glass-panel feature-mini-card">
                <div className="feature-mini-icon fmic-2">💳</div>
                <h4 className="feature-mini-title">Secure Payments</h4>
                <p className="feature-mini-desc">Top-grade card payment integrations ensuring your transactions are safe and encrypted.</p>
              </div>

              <div className="glass-panel feature-mini-card">
                <div className="feature-mini-icon fmic-3">📊</div>
                <h4 className="feature-mini-title">User Analytics Panel</h4>
                <p className="feature-mini-desc">Keep track of your upcoming workshops, download booking receipts, and view historic events.</p>
              </div>

              <div className="glass-panel feature-mini-card">
                <div className="feature-mini-icon fmic-4">🔔</div>
                <h4 className="feature-mini-title">Instant Notifications</h4>
                <p className="feature-mini-desc">Get prompt alerts and confirmation messages for successful registrations and cancellations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonial Section */}
      <section className="container section-container text-center">
        <div className="section-tag">Reviews</div>
        <h2 className="section-title">What Our Attendees Say</h2>
        <p className="section-subtitle">
          Join thousands of learners, leaders, and celebrators who have used Evinto to elevate their events.
        </p>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="glass-panel testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-quote">
                "Evinto transformed how our college organized the national hackathon. We handled 500+ registrations flawlessly in two days!"
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                  alt="Sarah Jenkins"
                  className="testimonial-avatar"
                />
                <div>
                  <div className="testimonial-name">Sarah Jenkins</div>
                  <div className="testimonial-role">Hackathon Organizer, MIT</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-panel testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-quote">
                "Booking seats for global business workshops has never been this simple. Smooth interface and instant payment receipt delivery."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                  alt="Marcus Vance"
                  className="testimonial-avatar"
                />
                <div>
                  <div className="testimonial-name">Marcus Vance</div>
                  <div className="testimonial-role">Director, TechVance Ltd</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-panel testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-quote">
                "Loved using this platform for booking medical health checkups. Fast, seamless, and highly responsive support team!"
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                  alt="Dr. Alisha Patel"
                  className="testimonial-avatar"
                />
                <div>
                  <div className="testimonial-name">Dr. Alisha Patel</div>
                  <div className="testimonial-role">Community Health Lead</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Section */}
      <section className="container section-container mb-5">
        <div className="glass-panel cta-panel">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience the Future?</h2>
            <p className="cta-desc">
              Sign up today and unlock complete access to workshops, fests, analytics Dashboards, and safe transactions.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/register" className="btn-grad" style={{ padding: "16px 36px" }}>
                Create Free Account
              </Link>
              <Link to="/events" className="btn-glass" style={{ padding: "16px 36px" }}>
                Explore Assemblies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;