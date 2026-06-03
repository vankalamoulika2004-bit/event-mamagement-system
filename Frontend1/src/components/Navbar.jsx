import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const updateNavbarState = () => {
    const activeToken = localStorage.getItem("token");
    const activeUserStr = localStorage.getItem("user");
    setToken(activeToken);

    if (activeToken && activeUserStr) {
      try {
        setUser(JSON.parse(activeUserStr));
      } catch (e) {
        console.log("Error parsing user cache in navbar:", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Populate user profile initially
    setTimeout(() => {
      updateNavbarState();
    }, 0);

    // Subscribe to custom auth state change events
    const handleAuthStateChange = () => {
      updateNavbarState();
    };

    window.addEventListener("loginStateChange", handleAuthStateChange);
    return () => {
      window.removeEventListener("loginStateChange", handleAuthStateChange);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm("🚪 Are you sure you want to log out of Evinto?")) {
      localStorage.clear();
      updateNavbarState();
      navigate("/");
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top px-4"
      style={{
        background: "rgba(7, 7, 18, 0.65)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        zIndex: 1000,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="container-fluid">
        {/* Brand Logo with Premium Branding */}
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: "1.6rem",
            letterSpacing: "-0.5px",
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ✨ Evinto
        </Link>

        {/* Responsive Hamburger Icon */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.15)",
            background: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <div
            className="navbar-nav align-items-center gap-2 mt-3 mt-lg-0"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
          >
            <Link
              className="nav-link px-3 py-2 text-white"
              to="/"
              style={{ transition: "all 0.3s ease", borderRadius: "8px" }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.05)";
                e.target.style.color = "#ec4899";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#fff";
              }}
            >
              Home
            </Link>

            <Link
              className="nav-link px-3 py-2 text-white"
              to="/events"
              style={{ transition: "all 0.3s ease", borderRadius: "8px" }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.05)";
                e.target.style.color = "#ec4899";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#fff";
              }}
            >
              Events
            </Link>

            {/* Dynamic links based on Auth State */}
            {token && user && user.role === "admin" && (
              <>
                <Link
                  className="nav-link px-3 py-2 text-white"
                  to="/admin"
                  style={{ transition: "all 0.3s ease", borderRadius: "8px" }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    e.target.style.color = "#ec4899";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#fff";
                  }}
                >
                  Admin Panel
                </Link>

                <Link
                  className="nav-link px-3 py-2 text-white"
                  to="/add-event"
                  style={{ transition: "all 0.3s ease", borderRadius: "8px" }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    e.target.style.color = "#ec4899";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#fff";
                  }}
                >
                  Add Event
                </Link>
              </>
            )}

            {token && user && user.role !== "admin" && (
              <>
                <Link
                  className="nav-link px-3 py-2 text-white"
                  to="/my-bookings"
                  style={{ transition: "all 0.3s ease", borderRadius: "8px" }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    e.target.style.color = "#ec4899";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#fff";
                  }}
                >
                  My Bookings
                </Link>

                <Link
                  className="nav-link px-3 py-2 text-white"
                  to="/dashboard"
                  style={{ transition: "all 0.3s ease", borderRadius: "8px" }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    e.target.style.color = "#ec4899";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#fff";
                  }}
                >
                  My Dashboard
                </Link>
              </>
            )}

            <Link
              className="nav-link px-3 py-2 text-white"
              to="/contact"
              style={{ transition: "all 0.3s ease", borderRadius: "8px" }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.05)";
                e.target.style.color = "#ec4899";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#fff";
              }}
            >
              Contact
            </Link>

            {/* Login State Action Buttons */}
            <div className="d-flex gap-2 ms-lg-3 mt-3 mt-lg-0">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="btn text-white px-4"
                  style={{
                    background: "rgba(220, 53, 69, 0.15)",
                    border: "1px solid rgba(220, 53, 69, 0.4)",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(220, 53, 69, 0.3)";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(220, 53, 69, 0.15)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Logout 🚪
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn text-white px-4"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.12)";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.05)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    className="btn px-4 text-white"
                    style={{
                      background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(168, 85, 247, 0.25)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = "0 6px 18px rgba(168, 85, 247, 0.4)";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = "0 4px 12px rgba(168, 85, 247, 0.25)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;