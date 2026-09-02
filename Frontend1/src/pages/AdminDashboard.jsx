import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Home.css";

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, events: 0, bookings: 0 });
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Edit Event Modal State
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "Workshops",
    date: "",
    location: "",
    price: 0,
    description: ""
  });
  const [editLoading, setEditLoading] = useState(false);

  async function fetchDashboardData() {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.log("Error querying admin metrics:", err);
      setStats({ users: 0, events: 0, bookings: 0 });
    }
  }

  async function fetchEventsList() {
    try {
      const res = await API.get("/events");
      setEventsList(res.data);
    } catch (err) {
      console.log("Error querying admin events catalog:", err);
      setEventsList([]);
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

    try {
      const parsedUser = JSON.parse(cachedUser);
      if (parsedUser.role !== "admin") {
        alert("⚠️ Access Denied: Administrator privileges required!");
        navigate("/dashboard");
        return;
      }
      setTimeout(() => {
        fetchDashboardData();
        fetchEventsList();
      }, 0);
    } catch (e) {
      console.log(e);
      navigate("/login");
    }
  }, [navigate]);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("⚠️ Danger: Are you sure you want to permanently delete this event? This action cannot be undone!")) {
      return;
    }

    try {
      await API.delete(`/events/deleteEvent/${eventId}`);
      alert("✅ Event deleted successfully!");
      fetchDashboardData();
      fetchEventsList();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert(err.response?.data?.message || "Failed to delete event.");
    }
  };

  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setEditFormData({
      title: evt.title || "",
      category: evt.category || "Workshops",
      date: evt.date || "",
      location: evt.location || "",
      price: evt.price !== undefined ? evt.price : 0,
      description: evt.description || ""
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    setEditLoading(true);

    try {
      await API.put(`/events/updateEvent/${editingEvent._id || editingEvent.id}`, editFormData);
      alert("✅ Event and price updated successfully!");
      setEditingEvent(null);
      fetchDashboardData();
      fetchEventsList();
    } catch (err) {
      console.error("Error updating event:", err);
      alert(err.response?.data?.message || "Failed to update event details.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("🚪 Are you sure you want to log out of Evinto Admin Portal?")) {
      localStorage.clear();
      window.dispatchEvent(new Event("loginStateChange"));
      navigate("/");
    }
  };

  return (
    <div className="home-wrapper" style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      {/* Background glow blobs */}
      <div className="glow-blob-container">
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-3" style={{ bottom: "5%" }}></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div className="text-start">
            <div className="section-tag">Management Console</div>
            <h1 className="font-heading fw-bold m-0" style={{ fontSize: "2.4rem", letterSpacing: "-0.5px" }}>
              Admin Dashboard
            </h1>
          </div>

          <div className="d-flex gap-3">
            <Link to="/add-event" className="btn-grad text-decoration-none py-2 px-4">
              ➕ Add Event
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger px-4"
              style={{ borderRadius: "10px", fontWeight: 600 }}
            >
              Logout 🚪
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="row g-4 mb-5 text-start">
          <div className="col-md-4">
            <div className="glass-panel p-4" style={{ background: "rgba(99, 102, 241, 0.05)", borderLeft: "4px solid var(--accent-purple)" }}>
              <div className="text-secondary" style={{ fontSize: "0.85rem", fontWeight: 600 }}>SYSTEM ACTIVE USERS</div>
              <h2 className="font-heading fw-bold mt-2 mb-0" style={{ fontSize: "2.5rem" }}>{stats.users || 0}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-panel p-4" style={{ background: "rgba(6, 182, 212, 0.05)", borderLeft: "4px solid var(--accent-cyan)" }}>
              <div className="text-secondary" style={{ fontSize: "0.85rem", fontWeight: 600 }}>HOSTED EVENTS</div>
              <h2 className="font-heading fw-bold mt-2 mb-0" style={{ fontSize: "2.5rem" }}>{stats.events || 0}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-panel p-4" style={{ background: "rgba(236, 72, 153, 0.05)", borderLeft: "4px solid var(--accent-pink)" }}>
              <div className="text-secondary" style={{ fontSize: "0.85rem", fontWeight: 600 }}>TOTAL REGISTRATIONS</div>
              <h2 className="font-heading fw-bold mt-2 mb-0" style={{ fontSize: "2.5rem" }}>{stats.bookings || 0}</h2>
            </div>
          </div>
        </div>

        {/* Dynamic Lists Section */}
        <div className="glass-panel p-4 text-start mb-5">
          <h4 className="font-heading fw-bold mb-4">🗓️ Active Events Directory</h4>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : eventsList.length === 0 ? (
            <div className="text-center py-4 text-secondary">No events created yet. Use "Add Event" above to create one.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover" style={{ background: "transparent" }}>
                <thead>
                  <tr style={{ color: "#64748b", borderColor: "rgba(255,255,255,0.06)" }}>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price (₹)</th>
                    <th>Schedule Date</th>
                    <th>Location</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {eventsList.map((evt) => (
                    <tr key={evt._id || evt.id} style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <td className="fw-bold">{evt.title}</td>
                      <td>
                        <span className="badge bg-secondary" style={{ fontSize: "0.75rem", borderRadius: "100px", padding: "5px 10px" }}>
                          {evt.category || "Workshops"}
                        </span>
                      </td>
                      <td className="fw-bold text-success">
                        ₹{evt.price !== undefined ? evt.price : 0}
                      </td>
                      <td>{evt.date || "N/A"}</td>
                      <td>📍 {evt.location || "N/A"}</td>
                      <td className="text-end">
                        <button
                          onClick={() => openEditModal(evt)}
                          className="btn btn-sm btn-outline-info me-2"
                          style={{ borderRadius: "8px", fontWeight: 600 }}
                        >
                          ✏️ Edit / Price
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(evt._id || evt.id)}
                          className="btn btn-sm btn-outline-danger"
                          style={{ borderRadius: "8px", fontWeight: 600 }}
                        >
                          ✕ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* EDIT EVENT MODAL */}
        {editingEvent && (
          <div
            className="modal-backdrop-custom d-flex align-items-center justify-content-center"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              zIndex: 9999,
              backdropFilter: "blur(5px)"
            }}
          >
            <div className="glass-panel p-4 text-start" style={{ width: "100%", maxWidth: "550px", background: "rgba(15, 23, 42, 0.95)" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="font-heading fw-bold m-0">✏️ Edit Event & Update Price</h4>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="btn btn-sm text-secondary border-0 bg-transparent fs-5"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="mb-2">
                  <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Event Title</label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    required
                    className="form-control"
                  />
                </div>

                <div className="row mb-2">
                  <div className="col-6">
                    <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Category</label>
                    <select
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      className="form-control"
                    >
                      <option>Workshops</option>
                      <option>Concerts</option>
                      <option>Seminars</option>
                      <option>Health Camps</option>
                      <option>College Fests</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-6">
                    <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Date</label>
                    <input
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="col-6">
                    <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Location</label>
                    <input
                      type="text"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Description</label>
                  <textarea
                    rows="3"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    required
                    className="form-control"
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="btn btn-secondary px-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="btn-grad px-4"
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;