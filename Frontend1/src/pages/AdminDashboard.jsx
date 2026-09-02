import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Home.css";

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, events: 0, bookings: 0, payments: 0, revenue: 0 });
  const [eventsList, setEventsList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events"); // 'events', 'bookings', 'payments'
  const navigate = useNavigate();

  // Edit Event Modal State
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "Cultural Events",
    date: "",
    time: "10:00 AM",
    location: "",
    price: 0,
    maxParticipants: 100,
    status: "Open",
    description: ""
  });
  const [editLoading, setEditLoading] = useState(false);

  async function fetchDashboardData() {
    try {
      const res = await API.get("/admin/dashboard");
      setStats({
        users: res.data.users || 0,
        events: res.data.events || 0,
        bookings: res.data.bookings || 0,
        payments: res.data.payments || 0,
        revenue: res.data.revenue || 0
      });
      if (res.data.bookingsList) setBookingsList(res.data.bookingsList);
      if (res.data.paymentsList) setPaymentsList(res.data.paymentsList);
    } catch (err) {
      console.log("Error querying admin metrics:", err);
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
      category: evt.category || "Cultural Events",
      date: evt.date || "",
      time: evt.time || "10:00 AM",
      location: evt.location || "",
      price: evt.price !== undefined ? evt.price : 0,
      maxParticipants: evt.maxParticipants || 100,
      status: evt.status || "Open",
      description: evt.description || ""
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    setEditLoading(true);

    try {
      await API.put(`/events/updateEvent/${editingEvent._id || editingEvent.id}`, editFormData);
      alert("✅ Event & price updated successfully!");
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-start">
            <div className="section-tag">Management Console</div>
            <h1 className="font-heading fw-bold m-0" style={{ fontSize: "2.4rem", letterSpacing: "-0.5px" }}>
              Admin Control Center
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

        {/* Overview 5 Stats Cards */}
        <div className="row g-3 mb-5 text-start">
          <div className="col-md">
            <div className="glass-panel p-3" style={{ background: "rgba(99, 102, 241, 0.05)", borderLeft: "4px solid var(--accent-purple)" }}>
              <div className="text-secondary" style={{ fontSize: "0.75rem", fontWeight: 700 }}>ACTIVE USERS</div>
              <h3 className="font-heading fw-bold mt-1 mb-0">{stats.users || 0}</h3>
            </div>
          </div>

          <div className="col-md">
            <div className="glass-panel p-3" style={{ background: "rgba(6, 182, 212, 0.05)", borderLeft: "4px solid var(--accent-cyan)" }}>
              <div className="text-secondary" style={{ fontSize: "0.75rem", fontWeight: 700 }}>TOTAL EVENTS</div>
              <h3 className="font-heading fw-bold mt-1 mb-0">{stats.events || 0}</h3>
            </div>
          </div>

          <div className="col-md">
            <div className="glass-panel p-3" style={{ background: "rgba(236, 72, 153, 0.05)", borderLeft: "4px solid var(--accent-pink)" }}>
              <div className="text-secondary" style={{ fontSize: "0.75rem", fontWeight: 700 }}>TOTAL BOOKINGS</div>
              <h3 className="font-heading fw-bold mt-1 mb-0">{stats.bookings || 0}</h3>
            </div>
          </div>

          <div className="col-md">
            <div className="glass-panel p-3" style={{ background: "rgba(245, 158, 11, 0.05)", borderLeft: "4px solid #f59e0b" }}>
              <div className="text-secondary" style={{ fontSize: "0.75rem", fontWeight: 700 }}>PAYMENTS</div>
              <h3 className="font-heading fw-bold mt-1 mb-0">{stats.payments || 0}</h3>
            </div>
          </div>

          <div className="col-md">
            <div className="glass-panel p-3" style={{ background: "rgba(16, 185, 129, 0.05)", borderLeft: "4px solid #10b981" }}>
              <div className="text-secondary" style={{ fontSize: "0.75rem", fontWeight: 700 }}>TOTAL REVENUE</div>
              <h3 className="font-heading fw-bold mt-1 mb-0 text-success">₹{stats.revenue || 0}</h3>
            </div>
          </div>
        </div>

        {/* Management Tabs Navigation */}
        <div className="d-flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("events")}
            className={`btn px-4 py-2 fw-bold ${activeTab === "events" ? "btn-primary" : "btn-dark"}`}
            style={{ borderRadius: "10px" }}
          >
            🗓️ Event Management ({eventsList.length})
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`btn px-4 py-2 fw-bold ${activeTab === "bookings" ? "btn-primary" : "btn-dark"}`}
            style={{ borderRadius: "10px" }}
          >
            🎟️ Booking Management ({bookingsList.length})
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`btn px-4 py-2 fw-bold ${activeTab === "payments" ? "btn-primary" : "btn-dark"}`}
            style={{ borderRadius: "10px" }}
          >
            💳 Payment Management ({paymentsList.length})
          </button>
        </div>

        {/* TAB 1: EVENT MANAGEMENT */}
        {activeTab === "events" && (
          <div className="glass-panel p-4 text-start mb-5">
            <h4 className="font-heading fw-bold mb-4">🗓️ College Events Directory</h4>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading events...</span>
                </div>
              </div>
            ) : eventsList.length === 0 ? (
              <div className="text-center py-4 text-secondary">No events created yet. Use "Add Event" to publish one.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle" style={{ background: "transparent" }}>
                  <thead>
                    <tr style={{ color: "#64748b", borderColor: "rgba(255,255,255,0.06)", fontSize: "0.85rem" }}>
                      <th>Event Title</th>
                      <th>Category</th>
                      <th>Price (₹)</th>
                      <th>Date & Time</th>
                      <th>Venue</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsList.map((evt) => (
                      <tr key={evt._id || evt.id} style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <td className="fw-bold">{evt.title}</td>
                        <td>
                          <span className="badge bg-secondary" style={{ fontSize: "0.75rem", borderRadius: "100px", padding: "5px 10px" }}>
                            {evt.category || "General"}
                          </span>
                        </td>
                        <td className="fw-bold text-success">
                          ₹{evt.price !== undefined ? evt.price : 0}
                        </td>
                        <td style={{ fontSize: "0.85rem" }}>
                          📅 {evt.date} <br />
                          ⏰ {evt.time || "10:00 AM"}
                        </td>
                        <td style={{ fontSize: "0.85rem" }}>📍 {evt.location || "N/A"}</td>
                        <td>
                          <span
                            className={`badge ${evt.status === "Open" ? "bg-success" : evt.status === "Closed" ? "bg-danger" : "bg-secondary"}`}
                            style={{ borderRadius: "100px", fontSize: "0.75rem", padding: "4px 8px" }}
                          >
                            {evt.status || "Open"}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => openEditModal(evt)}
                            className="btn btn-sm btn-outline-info me-2"
                            style={{ borderRadius: "8px", fontWeight: 600 }}
                          >
                            ✏️ Edit
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
        )}

        {/* TAB 2: BOOKING MANAGEMENT */}
        {activeTab === "bookings" && (
          <div className="glass-panel p-4 text-start mb-5">
            <h4 className="font-heading fw-bold mb-4">🎟️ All Student & User Bookings</h4>

            {bookingsList.length === 0 ? (
              <div className="text-center py-4 text-secondary">No bookings submitted yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle" style={{ background: "transparent" }}>
                  <thead>
                    <tr style={{ color: "#64748b", borderColor: "rgba(255,255,255,0.06)", fontSize: "0.85rem" }}>
                      <th>Attendee</th>
                      <th>Event Name</th>
                      <th>Ticket Quantity</th>
                      <th>Ticket Price</th>
                      <th>Calculated Total</th>
                      <th>Status</th>
                      <th>Booking Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsList.map((b) => {
                      const ticketPrice = b.event?.price || 0;
                      const totalAmount = ticketPrice * (b.ticketsCount || 1);
                      return (
                        <tr key={b._id} style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                          <td>
                            <strong>{b.attendeeName || b.user?.name || "User"}</strong><br />
                            <small className="text-secondary">{b.user?.email}</small>
                          </td>
                          <td className="fw-bold">{b.event?.title || "Event"}</td>
                          <td>{b.ticketsCount || 1} Ticket(s)</td>
                          <td>₹{ticketPrice}</td>
                          <td className="fw-bold text-success">₹{totalAmount}</td>
                          <td>
                            <span
                              className={`badge ${b.status === "Paid" ? "bg-success" : b.status === "Cancelled" ? "bg-danger" : "bg-warning text-dark"}`}
                              style={{ borderRadius: "8px", padding: "5px 10px" }}
                            >
                              {b.status || "Booked"}
                            </span>
                          </td>
                          <td style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                            {new Date(b.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAYMENT MANAGEMENT */}
        {activeTab === "payments" && (
          <div className="glass-panel p-4 text-start mb-5">
            <h4 className="font-heading fw-bold mb-4">💳 All Verified Payment Transactions</h4>

            {paymentsList.length === 0 ? (
              <div className="text-center py-4 text-secondary">No payments recorded yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle" style={{ background: "transparent" }}>
                  <thead>
                    <tr style={{ color: "#64748b", borderColor: "rgba(255,255,255,0.06)", fontSize: "0.85rem" }}>
                      <th>Transaction ID</th>
                      <th>User</th>
                      <th>Event</th>
                      <th>Payment Method</th>
                      <th>Amount Paid</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsList.map((p) => (
                      <tr key={p._id} style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <td className="fw-bold text-info" style={{ fontSize: "0.85rem" }}>{p.transactionId || p._id}</td>
                        <td>
                          <strong>{p.user?.name || "User"}</strong><br />
                          <small className="text-secondary">{p.user?.email}</small>
                        </td>
                        <td>{p.event?.title || "Event"}</td>
                        <td>
                          <span className="badge bg-secondary">{p.paymentMethod}</span>
                        </td>
                        <td className="fw-bold text-success">₹{p.amount}</td>
                        <td>
                          <span className="badge bg-success" style={{ borderRadius: "8px", padding: "5px 10px" }}>
                            {p.paymentStatus || "Successful"}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

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
            <div className="glass-panel p-4 text-start" style={{ width: "100%", maxWidth: "600px", background: "rgba(15, 23, 42, 0.95)" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="font-heading fw-bold m-0">✏️ Edit Event Details & Price</h4>
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
                      <option value="Cultural Events">Cultural Events</option>
                      <option value="Technical Events">Technical Events</option>
                      <option value="Academic Events">Academic Events</option>
                      <option value="Sports Events">Sports Events</option>
                      <option value="Arts and Literature Events">Arts and Literature Events</option>
                      <option value="Social and Environmental Events">Social and Environmental Events</option>
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
                    <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Time</label>
                    <input
                      type="text"
                      value={editFormData.time}
                      onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-6">
                    <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Location / Venue</label>
                    <input
                      type="text"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="col-6">
                    <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Max Seats / Capacity</label>
                    <input
                      type="number"
                      min="1"
                      value={editFormData.maxParticipants}
                      onChange={(e) => setEditFormData({ ...editFormData, maxParticipants: Number(e.target.value) })}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Registration Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="form-control"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Completed">Completed</option>
                  </select>
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