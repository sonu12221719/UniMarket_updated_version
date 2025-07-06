import React, { createContext, useEffect, useState } from "react";
import api from "../api/axiosConfig";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
    // Set token expiry in localStorage for client-side tracking
    const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 1 day from now
    localStorage.setItem("tokenExpiry", expiryTime.toString());
  };

  const logout = async () => {
    try {
      // Call logout endpoint to log the logout event
      await api.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear user state and localStorage regardless of API call success
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    // Check if token exists and is not expired
    if (!token || !tokenExpiry) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Check if token is expired
    if (new Date().getTime() > parseInt(tokenExpiry)) {
      console.log("Token expired, logging out user");
      logout();
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Auth check failed:", err.response?.data || err.message);
      // If token is invalid, clear it and logout
      if (err.response?.status === 401) {
        logout();
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
