import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

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
    setSuccessMsg("");

    try {
      await axios.post(
        "http://localhost:8080/api/auth/register",
        formData
      );

      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message || "Something went wrong. Please check fields and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="overlay">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 className="title">✨ EVINTO</h1>
        </Link>

        <form className="login-box" onSubmit={handleSubmit} style={{ maxWidth: "450px" }}>
          <h2>Create Account</h2>
          <p className="text-center text-secondary mb-4" style={{ fontSize: "0.88rem" }}>
            Join Evinto today to discover events and secure fast bookings.
          </p>

          {errorMsg && (
            <div className="alert alert-danger py-2 text-center" style={{ fontSize: "0.85rem", borderRadius: "8px" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success py-2 text-center" style={{ fontSize: "0.85rem", borderRadius: "8px" }}>
              ✅ {successMsg}
            </div>
          )}

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1" }}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1" }}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1" }}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Create Account &rarr;"}
          </button>

          <div className="text-center mt-4" style={{ fontSize: "0.88rem", color: "#94a3b8" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#ec4899", fontWeight: 600, textDecoration: "none" }}>
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;