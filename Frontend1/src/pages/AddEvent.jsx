import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Home.css";

function AddEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Cultural Events",
    date: "",
    time: "10:00 AM",
    location: "",
    image: "",
    description: "",
    price: "",
    maxParticipants: 100,
    status: "Open"
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");

    if (!token || !cachedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(cachedUser);

      if (!parsedUser || parsedUser.role !== "admin") {
        alert("⚠️ Access Denied: Admin only!");
        navigate("/admin");
      }
    } catch (e) {
      console.log("User parse error:", e);
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const submissionData = {
      ...formData,
      price: Number(formData.price),
      maxParticipants: Number(formData.maxParticipants) || 100,
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    };

    try {
      await API.post("/events/event", submissionData);

      alert("🎉 Event Published Successfully!");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message ||
          "Failed to add event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper" style={{ paddingTop: "140px", paddingBottom: "80px" }}>
      <div className="container d-flex justify-content-center">

        <div className="glass-panel p-4" style={{ maxWidth: "650px", width: "100%" }}>

          <h2 className="text-center mb-3">➕ Add College Event</h2>

          {errorMsg && (
            <div className="alert alert-danger text-center">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="text-start">

            <div className="mb-2">
              <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Event Title</label>
              <input
                name="title"
                placeholder="e.g. Dance Competition"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="row mb-2">
              <div className="col-md-6">
                <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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

              <div className="col-md-6">
                <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Ticket Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 200"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="form-control"
                  min="0"
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-md-6">
                <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Time</label>
                <input
                  type="text"
                  name="time"
                  placeholder="e.g. 10:00 AM"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-md-6">
                <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Location / Venue</label>
                <input
                  name="location"
                  placeholder="e.g. Main Auditorium"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Max Seats / Capacity</label>
                <input
                  type="number"
                  name="maxParticipants"
                  placeholder="100"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  required
                  className="form-control"
                  min="1"
                />
              </div>
            </div>

            <div className="mb-2">
              <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Image URL</label>
              <input
                name="image"
                placeholder="https://..."
                value={formData.image}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Description</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Event rules, guidelines, and schedule..."
                value={formData.description}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-grad w-100 py-3"
            >
              {loading ? "Publishing..." : "Publish Event &rarr;"}
            </button>

          </form>

          <div className="text-center mt-3">
            <Link to="/admin" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem" }}>
              &larr; Back to Admin Dashboard
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddEvent;