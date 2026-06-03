import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  let user = null;
  if (adminOnly) {
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      user = null;
    }
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && (!user || user.role !== "admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;