import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const loggedInUser = localStorage.getItem("loggedInUser");

  function isActive(path) {
    return location.pathname === path
      ? "nav-link active"
      : "nav-link";
  }

  function logout() {
    localStorage.removeItem("loggedInUser");

    alert("You have been logged out.");

    navigate("/");
  }

  return (
    <nav className="navbar">

      <div className="navbar-container">

        <Link to="/" className="brand">
          <span className="brand-icon">🏠</span>
          Rental<span>Hub</span>
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div
          className={
            menuOpen
              ? "nav-links mobile-open"
              : "nav-links"
          }
        >

          <Link
            to="/"
            className={isActive("/")}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/properties"
            className={isActive("/properties")}
            onClick={() => setMenuOpen(false)}
          >
            Find Accommodation
          </Link>

          <Link
            to="/list-property"
            className={isActive("/list-property")}
            onClick={() => setMenuOpen(false)}
          >
            List Your Property
          </Link>

          <Link
            to="/favorites"
            className={isActive("/favorites")}
            onClick={() => setMenuOpen(false)}
          >
            Favorites
          </Link>

          <Link
            to="/about"
            className={isActive("/about")}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>

          {loggedInUser ? (
            <>
              <Link
                to="/profile"
                className={isActive("/profile")}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>

              <button
                className="nav-login-button logout-button"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="nav-login-button"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;