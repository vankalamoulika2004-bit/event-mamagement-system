import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchBookings() {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "http://localhost:8080/api/bookings/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    <div className="home-wrapper" style={{ paddingTop: "140px" }}>
      <div className="container">

        <h2 className="text-center mb-4">My Bookings</h2>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center glass-panel p-4">
            <p>No bookings found</p>

            <Link to="/events" className="btn-grad">
              Browse Events
            </Link>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b._id} className="glass-panel p-3 mb-3">

              <h4>{b.event?.title}</h4>

              <p>
                📅 {b.event?.date} <br />
                📍 {b.event?.location}
              </p>

              <p>🎟 Tickets: {b.ticketsCount}</p>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span
                  className={
                    b.status === "Cancelled"
                      ? "badge bg-danger"
                      : b.status === "Paid"
                      ? "badge bg-success"
                      : "badge bg-warning text-dark"
                  }
                  style={{ padding: "6px 12px", borderRadius: "8px", fontWeight: 600 }}
                >
                  {b.status || "Booked"}
                </span>

                {b.status === "Booked" && (
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
                    💳 Pay Now
                  </Link>
                )}
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default MyBookings;