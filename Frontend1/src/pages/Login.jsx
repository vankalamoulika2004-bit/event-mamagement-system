import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      // Save user auth state via AuthContext
      login(res.data);

      // Navigate based on role
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(
        error.response?.data?.message || "Invalid credentials. Please check your email and password."
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

        <form className="login-box" onSubmit={handleLogin}>
          <h2>Sign In</h2>
          <p className="text-center text-secondary mb-4" style={{ fontSize: "0.88rem" }}>
            Welcome back! Enter your details to manage bookings and events.
          </p>

          {errorMsg && (
            <div className="alert alert-danger py-2 text-center" style={{ fontSize: "0.85rem", borderRadius: "8px" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1" }}>Email Address</label>
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In \u2192"}
          </button>

          <div className="text-center mt-4" style={{ fontSize: "0.88rem", color: "#94a3b8" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#ec4899", fontWeight: 600, textDecoration: "none" }}>
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;