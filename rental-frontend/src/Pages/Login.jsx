import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleLogin(event) {

    event.preventDefault();

    setError("");

    if (!email || !password) {

      setError(
        "Please enter your email and password."
      );

      return;

    }

    const savedUser =
      localStorage.getItem(
        "rentalUser"
      );

    if (savedUser) {

      const user =
        JSON.parse(savedUser);

      if (
        email === user.email &&
        password === user.password
      ) {

        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            name: user.name,
            email: user.email,
          })
        );

        alert(
          "Login successful!"
        );

        navigate("/");

        return;

      }

      setError(
        "Incorrect email or password."
      );

      return;

    }

    setError(
      "No account found. Please register first."
    );

  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          🏠
        </div>

        <span className="page-label">
          RENTALHUB
        </span>

        <h1>
          Welcome Back
        </h1>

        <p>
          Login to find and manage accommodation.
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
        >

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="password-button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          <button
            type="submit"
            className="btn btn-primary auth-button"
          >
            Login
          </button>

        </form>

        <p className="auth-switch">

          Don't have an account?

          {" "}

          <Link to="/register">
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;