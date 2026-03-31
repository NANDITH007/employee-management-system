import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import LoginPage from "./LoginPage";
import { AUTH_API } from "./lib/api";
import "./App.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (session still valid)
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${AUTH_API}/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        }
      }
    } catch (err) {
      // Server not reachable — stay on login
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${AUTH_API}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // ignore
    }
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        color: "#64748b",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 14,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 32,
            height: 32,
            border: "3px solid rgba(99, 102, 241, 0.2)",
            borderTopColor: "#6366f1",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px",
          }} />
          Loading...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}