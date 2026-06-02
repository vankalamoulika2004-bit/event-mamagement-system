import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
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
    } catch (err) {
      console.log("Error loading bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

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

              <span
                className={
                  b.status === "Cancelled"
                    ? "text-danger"
                    : "text-success"
                }
              >
                {b.status || "Confirmed"}
              </span>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default MyBookings;