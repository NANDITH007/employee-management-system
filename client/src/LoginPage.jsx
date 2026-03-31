import { useState } from "react";
import { AUTH_API } from "./lib/api";
import "./LoginPage.css";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        onLoginSuccess();
      } else {
        const data = await res.json();
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-brand">
            <div className="login-logo">🔐</div>
            <h1>Welcome Back</h1>
            <p>Sign in to access the management dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading || !email || !password}
            >
              <span>
                {loading && <span className="login-spinner" />}
                {loading ? "Signing in..." : "Sign In"}
              </span>
            </button>
          </form>

          <div className="login-footer">
            <p>Protected access • Authorized personnel only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
