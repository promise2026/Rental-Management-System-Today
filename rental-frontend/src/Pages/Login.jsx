
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.detail ||
          data.non_field_errors?.[0] ||
          data.username?.[0] ||
          data.password?.[0] ||
          Object.values(data).flat().find(
            (value) => typeof value === "string"
          ) ||
          "Login failed. Check your username and password.";

        throw new Error(message);
      }

      if (!data.token || !data.user) {
        throw new Error("The server returned an unexpected login response.");
      }

      // Save the token for authenticated API requests.
      localStorage.setItem("authToken", data.token);

      // Save basic user details for the frontend.
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));

      // Notify other components that authentication has changed.
      window.dispatchEvent(new Event("storage"));

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.message ||
          "Unable to connect to the server. Check that Django is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🏠</div>

        <span className="page-label">RENTALHUB</span>

        <h1>Welcome Back</h1>

        <p>Login to find and manage accommodation.</p>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
