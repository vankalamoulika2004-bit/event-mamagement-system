import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import "./Home.css";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await API.get(`/events/event/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.log("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    }

    setTimeout(() => {
      fetchEvent();
    }, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="home-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading event details...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="home-wrapper d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <h2>Event Not Found</h2>
        <Link to="/events" className="btn-grad mt-3">Back to catalog</Link>
      </div>
    );
  }

  const availableSeats = event.availableSeats !== undefined ? event.availableSeats : (event.maxParticipants || 100);
  const status = event.status || "Open";

  return (
    <div className="home-wrapper" style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      {/* Background glow blobs */}
      <div className="glow-blob-container">
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-3" style={{ bottom: "5%" }}></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="mb-4 text-start">
          <Link to="/events" style={{ color: "var(--accent-pink)", textDecoration: "none", fontWeight: 600 }}>
            &larr; Back to Events catalog
          </Link>
        </div>

        <div className="glass-panel p-0 overflow-hidden" style={{ borderRadius: "24px" }}>
          {/* Hero Banner */}
          <div style={{ height: "420px", position: "relative", width: "100%" }}>
            <img
              src={event.image}
              alt={event.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(7, 7, 18, 0.95) 0%, rgba(7, 7, 18, 0.4) 70%, transparent 100%)",
              }}
            ></div>

            <div className="position-absolute bottom-0 start-0 p-4 p-md-5 text-start w-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="event-category-tag">
                  {event.category || "General"}
                </span>
                <span
                  className={`badge ${status === "Open" ? "bg-success" : status === "Closed" ? "bg-danger" : "bg-secondary"}`}
                  style={{ borderRadius: "100px", padding: "6px 14px", fontSize: "0.85rem", fontWeight: 600 }}
                >
                  Status: {status}
                </span>
              </div>
              <h1 className="font-heading" style={{ fontSize: "3rem", fontWeight: 900, letterSpacing: "-1px", lineHeight: "1.1" }}>
                {event.title}
              </h1>
              <div className="d-flex flex-wrap gap-4 mt-3" style={{ fontSize: "0.95rem", color: "#cbd5e1" }}>
                <span>📅 {event.date}</span>
                <span>⏰ {event.time || "10:00 AM"}</span>
                <span>📍 {event.location}</span>
              </div>
            </div>
          </div>

          {/* Main Info Blocks */}
          <div className="p-4 p-md-5">
            <div className="row g-5">
              <div className="col-lg-8 text-start">
                <h3 className="font-heading fw-bold mb-3" style={{ color: "var(--accent-purple)" }}>About the Event</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: "1.8", whiteSpace: "pre-line" }}>
                  {event.description}
                </p>
              </div>

              {/* Sidebar Info & Booking Trigger */}
              <div className="col-lg-4 text-start">
                <div className="glass-panel p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <h4 className="font-heading fw-bold mb-4">Registration Summary</h4>

                  <div className="mb-3">
                    <div className="text-secondary" style={{ fontSize: "0.85rem" }}>TICKET PRICE</div>
                    <div className="font-heading" style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-cyan)" }}>
                      ₹{event.price}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-secondary" style={{ fontSize: "0.85rem" }}>AVAILABLE SEATS</div>
                    <div className="font-heading" style={{ fontSize: "1.4rem", fontWeight: 700, color: availableSeats > 0 ? "#10b981" : "#ef4444" }}>
                      {availableSeats} / {event.maxParticipants || 100} Seats Left
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-secondary" style={{ fontSize: "0.85rem" }}>ORGANIZER CONTACT</div>
                    <div className="mt-2" style={{ fontSize: "0.9rem" }}>
                      <strong>👤 Name:</strong> Campus Event Committee<br />
                      <strong>📧 Email:</strong> support@evinto.com<br />
                      <strong>📞 Phone:</strong> +91 98765 43210
                    </div>
                  </div>

                  {status === "Open" && availableSeats > 0 ? (
                    <Link to={`/bookingEvent/${event._id || event.id}`} className="btn-grad w-100 text-center justify-content-center py-3">
                      🎟️ Book Now &rarr;
                    </Link>
                  ) : (
                    <button disabled className="btn btn-secondary w-100 py-3 fw-bold">
                      Registration Closed / Sold Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;