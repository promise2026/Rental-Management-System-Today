import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  function handleRegister(event) {

    event.preventDefault();

    setError("");

    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;

    }

    const existingUser =
      localStorage.getItem(
        "rentalUser"
      );

    if (existingUser) {

      const user =
        JSON.parse(existingUser);

      if (
        user.email === email
      ) {

        setError(
          "An account with this email already exists."
        );

        return;

      }

    }

    const user = {
      name,
      email,
      password,
    };

    localStorage.setItem(
      "rentalUser",
      JSON.stringify(user)
    );

    alert(
      "Account created successfully!"
    );

    navigate("/login");

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
          Create Account
        </h1>

        <p>
          Join RentalHub and find your next home.
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleRegister}
        >

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              required
            />

          </div>

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

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />

          </div>

          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
            />

          </div>

          <button
            type="submit"
            className="btn btn-primary auth-button"
          >
            Create Account
          </button>

        </form>

        <p className="auth-switch">

          Already have an account?

          {" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;