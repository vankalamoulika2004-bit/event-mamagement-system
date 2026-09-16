import { Link } from "react-router-dom";

function EventCard({ event }) {
  if (!event) return null;

  const eventId = event._id || event.id;
  const image =
    event.image ||
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop";
  const title = event.title || "Untitled Event";
  const category = event.category || "General";
  const price = event.price !== undefined ? event.price : 0;
  const date = event.date || "Date TBA";
  const time = event.time || "10:00 AM";
  const location = event.location || "Venue TBA";
  const description = event.description || "";

  const availableSeats =
    event.availableSeats !== undefined ? event.availableSeats : (event.maxParticipants || 100);

  return (
    <div className="glass-panel premium-event-card d-flex flex-column" key={eventId}>
      <div className="event-img-wrapper" style={{ position: "relative" }}>
        <img src={image} alt={title} loading="lazy" />
        <span className="event-category-tag">{category}</span>
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
            backdropFilter: "blur(10px)",
          }}
        >
          ₹{price}
        </span>
      </div>
      <div className="event-card-body text-start d-flex flex-column flex-grow-1">
        <div className="event-date-loc mb-2" style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
          <span>📅 {date}</span>
          <span>⏰ {time}</span>
          <span>📍 {location}</span>
          <span style={{ color: availableSeats <= 10 ? "#f87171" : "#34d399", fontWeight: 600 }}>
            🎟️ {availableSeats} Seats Left
          </span>
        </div>
        <h3 className="event-card-title mb-2">{title}</h3>
        <p className="event-card-desc flex-grow-1">
          {description.length > 110 ? `${description.substring(0, 105)}...` : description}
        </p>
        <div className="event-card-footer mt-auto pt-3">
          <Link to={`/event/${eventId}`} className="event-btn-detail">
            More Details
          </Link>
          <Link to={`/bookingEvent/${eventId}`} className="event-btn-book">
            Book Event
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;