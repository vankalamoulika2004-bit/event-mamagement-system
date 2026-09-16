import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user } = useAuth();

  // Fallback to localStorage check in case of hydration delay
  const activeToken = token || localStorage.getItem("token");
  let activeUser = user;
  if (!activeUser) {
    try {
      activeUser = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      activeUser = null;
    }
  }

  if (!activeToken) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && (!activeUser || activeUser.role !== "admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;