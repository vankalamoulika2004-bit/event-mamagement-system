import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Home.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchBookings() {
    try {
      const res = await API.get("/bookings/my");
      setBookings(res.data);
    } catch {
      console.log("Error loading bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setTimeout(() => {
      fetchBookings();
    }, 0);
  }, [navigate]);

  return (
    <div className="home-wrapper" style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      <div className="container" style={{ maxWidth: "800px" }}>

        <h2 className="text-center mb-4 font-heading fw-bold">🎟️ My Event Bookings</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading bookings...</span>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center glass-panel p-5">
            <span style={{ fontSize: "3rem" }}>🎫</span>
            <h4 className="mt-3 font-heading fw-bold">No Bookings Yet</h4>
            <p className="text-secondary mt-2 mb-4">You haven't reserved tickets for any college events yet.</p>

            <Link to="/events" className="btn-grad text-decoration-none py-2 px-4">
              Browse Events &rarr;
            </Link>
          </div>
        ) : (
          bookings.map((b) => {
            const ticketPrice = b.event?.price || 0;
            const totalAmount = ticketPrice * (b.ticketsCount || 1);
            return (
              <div key={b._id} className="glass-panel p-4 mb-3 text-start">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h4 className="font-heading fw-bold mb-1">{b.event?.title || "Event"}</h4>
                    <span className="badge bg-secondary mb-2" style={{ fontSize: "0.75rem" }}>
                      {b.event?.category || "College Event"}
                    </span>
                    <p className="text-secondary mb-1" style={{ fontSize: "0.85rem" }}>
                      📅 {b.event?.date} • 📍 {b.event?.location}
                    </p>
                    <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                      🎟 <strong>Tickets:</strong> {b.ticketsCount} Ticket(s) &nbsp;|&nbsp;
                      💰 <strong>Total:</strong> <span className="text-success fw-bold">₹{totalAmount}</span>
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
                      style={{ padding: "6px 12px", borderRadius: "8px", fontWeight: 600, fontSize: "0.85rem" }}
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
                            borderRadius: "8px",
                            fontWeight: 600,
                            padding: "6px 16px"
                          }}
                        >
                          💳 Pay ₹{totalAmount}
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
    </div>
  );
}

export default MyBookings;