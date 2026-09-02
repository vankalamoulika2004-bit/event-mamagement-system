import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Home.css";

function BookingEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState(() => {
    let name = "";
    let email = "";
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        name = userData.name || "";
        email = userData.email || "";
      } catch (err) {
        console.log("Error parsing user cache:", err);
      }
    }
    return { name, email, phone: "", tickets: 1 };
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Authentication Required: Please sign in to book event seats!");
      navigate("/login");
      return;
    }

    async function fetchEvent() {
      try {
        const res = await API.get(`/events/event/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.log("Error querying event for booking:", err);
        setErrorMsg("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    }

    setTimeout(() => {
      fetchEvent();
    }, 0);
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/bookings", {
        eventId: id,
        ticketsCount: Number(form.tickets),
        attendeeName: form.name,
        attendeePhone: form.phone,
      });

      const bookingId = res.data?._id || res.data?.id;
      navigate(`/payment/${bookingId}`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading event...</span>
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

  const ticketPrice = event.price || 0;
  const totalAmount = ticketPrice * Number(form.tickets);

  return (
    <div className="home-wrapper" style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      {/* Background glow blobs */}
      <div className="glow-blob-container">
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-2" style={{ bottom: "5%" }}></div>
      </div>

      <div className="container position-relative d-flex justify-content-center" style={{ zIndex: 2 }}>
        <div className="glass-panel text-start p-4 p-md-5" style={{ width: "100%", maxWidth: "620px" }}>
          <div className="text-center mb-4">
            <span style={{ fontSize: "2.5rem" }}>🎟️</span>
            <h2 className="font-heading fw-bold mt-2" style={{ letterSpacing: "-0.5px" }}>Book Your Seat</h2>
            <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
              Confirm your registration and proceed to secure payment.
            </p>
          </div>

          <div
            className="d-flex align-items-center gap-3 p-3 mb-4"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--glass-border)",
              borderRadius: "12px",
            }}
          >
            <img
              src={event.image}
              alt={event.title}
              style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px" }}
            />
            <div className="flex-grow-1">
              <h5 className="font-heading fw-bold mb-1" style={{ fontSize: "1.1rem" }}>{event.title}</h5>
              <div className="text-secondary mb-1" style={{ fontSize: "0.82rem" }}>
                📅 {event.date} • ⏰ {event.time || "10:00 AM"}<br />
                📍 {event.location}
              </div>
              <span className="badge bg-secondary">{event.category}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="alert alert-danger py-2 text-center" style={{ fontSize: "0.85rem" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleBooking}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1" }}>Attendee Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="form-control mt-1"
                />
              </div>

              <div className="col-md-6">
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1" }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  required
                  className="form-control mt-1"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1" }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="form-control mt-1"
                />
              </div>

              <div className="col-md-6">
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1" }}>Number of Tickets</label>
                <select
                  name="tickets"
                  value={form.tickets}
                  onChange={handleChange}
                  className="form-control mt-1"
                >
                  <option value="1">1 Ticket</option>
                  <option value="2">2 Tickets</option>
                  <option value="3">3 Tickets</option>
                  <option value="4">4 Tickets</option>
                  <option value="5">5 Tickets</option>
                </select>
              </div>
            </div>

            {/* Price Breakdown Calculation Display */}
            <div
              className="p-3 mb-4"
              style={{
                background: "rgba(16, 185, 129, 0.05)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "12px"
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-secondary" style={{ fontSize: "0.88rem" }}>Ticket Price (From Database):</span>
                <span className="fw-bold">₹{ticketPrice}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary" style={{ fontSize: "0.88rem" }}>Quantity Selected:</span>
                <span className="fw-bold">{form.tickets}</span>
              </div>
              <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "8px 0" }} />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold" style={{ fontSize: "1rem" }}>Calculated Total Amount:</span>
                <span className="font-heading fw-bold text-success" style={{ fontSize: "1.4rem" }}>
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            <button type="submit" disabled={bookingLoading} className="btn-grad w-100 py-3 text-center justify-content-center">
              {bookingLoading ? "Creating booking..." : `PROCEED TO PAY ₹${totalAmount} &rarr;`}
            </button>

            <div className="text-center mt-3">
              <Link to={`/event/${id}`} style={{ fontSize: "0.88rem", color: "#64748b", textDecoration: "none" }}>
                Cancel registration
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingEvent;