import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("user");
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.error("Failed to parse cached user:", e);
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Sync token to API headers whenever token changes
  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Handle cross-tab storage changes and custom state updates
  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem("token");
      const currentUserStr = localStorage.getItem("user");
      setToken(currentToken);
      try {
        setUser(currentUserStr ? JSON.parse(currentUserStr) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("loginStateChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStateChange", handleStorageChange);
    };
  }, []);

  const login = (userData) => {
    if (!userData) return;
    const authToken = userData.token;
    if (authToken) {
      localStorage.setItem("token", authToken);
      setToken(authToken);
      API.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    window.dispatchEvent(new Event("loginStateChange"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    delete API.defaults.headers.common["Authorization"];
    window.dispatchEvent(new Event("loginStateChange"));
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    token,
    loading,
    setLoading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
