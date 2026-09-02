import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Home.css";

function UserDashboard() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchBookings() {
    try {
      const res = await API.get("/bookings/my");
      setBookings(res.data);
    } catch {
      console.log("Error loading dashboard bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");

    if (!token || !cachedUser) {
      navigate("/login");
      return;
    }

    setTimeout(() => {
      fetchBookings();
    }, 0);
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("🚪 Are you sure you want to log out?")) {
      localStorage.clear();
      window.dispatchEvent(new Event("loginStateChange"));
      navigate("/login");
    }
  };

  const total = bookings.length;
  const active = bookings.filter(b => b.status !== "Cancelled").length;
  const cancelled = bookings.filter(b => b.status === "Cancelled").length;

  return (
    <div className="home-wrapper" style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      <div className="container" style={{ maxWidth: "850px" }}>

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-start">
            <div className="section-tag">Student Portal</div>
            <h2 className="font-heading fw-bold m-0">User Dashboard</h2>
          </div>

          <button onClick={handleLogout} className="btn btn-outline-danger px-4" style={{ borderRadius: "8px", fontWeight: 600 }}>
            Logout 🚪
          </button>
        </div>

        {/* USER INFO */}
        {user && (
          <div className="glass-panel p-4 mb-4 text-start">
            <h4 className="font-heading fw-bold mb-1">👤 {user.name}</h4>
            <p className="text-secondary mb-0">📧 {user.email} &nbsp;|&nbsp; 🏷️ Role: <span className="badge bg-info text-dark">{user.role || "student"}</span></p>
          </div>
        )}

        {/* STATS */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="glass-panel p-3 text-center" style={{ borderLeft: "4px solid var(--accent-purple)" }}>
              <h3 className="font-heading fw-bold mb-1">{total}</h3>
              <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>Total Bookings</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-panel p-3 text-center" style={{ borderLeft: "4px solid #10b981" }}>
              <h3 className="font-heading fw-bold mb-1 text-success">{active}</h3>
              <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>Active Bookings</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-panel p-3 text-center" style={{ borderLeft: "4px solid #ef4444" }}>
              <h3 className="font-heading fw-bold mb-1 text-danger">{cancelled}</h3>
              <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>Cancelled</p>
            </div>
          </div>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="glass-panel p-4 text-start">
          <h4 className="font-heading fw-bold mb-4">🗓️ Recent Bookings</h4>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-4 text-secondary">
              No event registrations found.
            </div>
          ) : (
            bookings.map((b) => {
              const ticketPrice = b.event?.price || 0;
              const totalAmount = ticketPrice * (b.ticketsCount || 1);
              return (
                <div key={b._id} className="mb-3 border-bottom pb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="font-heading fw-bold mb-1">{b.event?.title || "Event"}</h5>
                      <p className="text-secondary mb-1" style={{ fontSize: "0.85rem" }}>
                        📅 {b.event?.date} | 📍 {b.event?.location}
                      </p>
                      <p className="mb-0" style={{ fontSize: "0.88rem" }}>
                        🎟 {b.ticketsCount} Ticket(s) &nbsp;|&nbsp; 💰 Total: <strong className="text-success">₹{totalAmount}</strong>
                      </p>
                    </div>

                    <div className="text-end">
                      <span
                        className={
                          b.status === "Cancelled"
                            ? "badge bg-danger"
                            : b.status === "Paid"
                            ? "badge bg-success"
                            : "badge bg-warning text-dark"
                        }
                        style={{ padding: "5px 12px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600 }}
                      >
                        {b.status || "Booked"}
                      </span>

                      {b.status === "Booked" && (
                        <div className="mt-2">
                          <Link
                            to={`/payment/${b._id}`}
                            className="btn btn-sm text-white"
                            style={{
                              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              padding: "4px 12px"
                            }}
                          >
                            💳 Pay Now
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* LINK BACK */}
        <div className="mt-4 text-center">
          <Link to="/events" className="btn-grad text-decoration-none py-2 px-4">
            Browse More Events &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}

export default UserDashboard;