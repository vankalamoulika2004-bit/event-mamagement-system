import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");

    if (!token || !cachedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(cachedUser));
    fetchBookings(token);
  }, [navigate]);

  const fetchBookings = async (token) => {
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
      console.log("Error loading dashboard bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const total = bookings.length;
  const active = bookings.filter(b => b.status !== "Cancelled").length;
  const cancelled = bookings.filter(b => b.status === "Cancelled").length;

  return (
    <div className="home-wrapper" style={{ paddingTop: "140px" }}>
      <div className="container">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>User Dashboard</h2>

          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>

        {/* USER INFO */}
        {user && (
          <div className="glass-panel p-3 mb-4">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        )}

        {/* STATS */}
        <div className="row mb-4">
          <div className="col">
            <div className="glass-panel p-3 text-center">
              <h3>{total}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="col">
            <div className="glass-panel p-3 text-center">
              <h3>{active}</h3>
              <p>Active</p>
            </div>
          </div>

          <div className="col">
            <div className="glass-panel p-3 text-center">
              <h3>{cancelled}</h3>
              <p>Cancelled</p>
            </div>
          </div>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="glass-panel p-4">
          <h4 className="mb-3">Recent Bookings</h4>

          {loading ? (
            <p>Loading...</p>
          ) : (
            bookings.map((b) => (
              <div key={b._id} className="mb-3 border-bottom pb-2">

                <h5>{b.event?.title}</h5>

                <p>
                  📅 {b.event?.date} | 📍 {b.event?.location}
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

        {/* LINK BACK */}
        <div className="mt-4 text-center">
          <Link to="/events" className="btn-grad">
            Browse More Events
          </Link>
        </div>

      </div>
    </div>
  );
}

export default UserDashboard;