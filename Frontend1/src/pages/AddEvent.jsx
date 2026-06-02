import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function AddEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Workshops",
    date: "",
    location: "",
    image: "",
    description: "",
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

      // SAFE ROLE CHECK
      if (!parsedUser || parsedUser.role !== "admin") {
        alert("⚠️ Access Denied: Admin only!");
        navigate("/admin");   // ✅ FIXED HERE
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

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const submissionData = {
      ...formData,
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    };

    try {
      await axios.post(
        "http://localhost:8080/api/events/event",
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("🎉 Event Added Successfully!");
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
    <div className="home-wrapper" style={{ paddingTop: "140px" }}>
      <div className="container d-flex justify-content-center">

        <div className="glass-panel p-4" style={{ maxWidth: "650px", width: "100%" }}>

          <h2 className="text-center mb-3">➕ Add Event</h2>

          {errorMsg && (
            <div className="alert alert-danger text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <input
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-control mb-2"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-control mb-2"
            >
              <option>Workshops</option>
              <option>Concerts</option>
              <option>Seminars</option>
              <option>Health Camps</option>
              <option>College Fests</option>
            </select>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="form-control mb-2"
            />

            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
              className="form-control mb-2"
            />

            <input
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              className="form-control mb-2"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="form-control mb-3"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-grad w-100"
            >
              {loading ? "Publishing..." : "Publish Event"}
            </button>

          </form>

          <div className="text-center mt-3">
            <Link to="/admin">Back to Admin</Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddEvent;