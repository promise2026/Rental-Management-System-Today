import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="page">

      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-badge">
            RENTAL MANAGEMENT SYSTEM
          </span>

          <h1>
            Manage Your Properties
            <br />
            <span>Smarter & Easier</span>
          </h1>

          <p>
            A modern rental management platform for managing
            properties, tenants and payments in one place.
          </p>

          <div className="hero-buttons">

            <Link
              to="/properties"
              className="btn btn-primary"
            >
              Manage Properties
            </Link>

            <Link
              to="/login"
              className="btn btn-secondary"
            >
              Login
            </Link>

          </div>

        </div>

        <div className="hero-image">
          🏠
        </div>

      </section>

      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div>
            <span>Properties</span>
            <h2>Manage</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div>
            <span>Tenants</span>
            <h2>Manage</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div>
            <span>Payments</span>
            <h2>Track</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div>
            <span>Reports</span>
            <h2>Monitor</h2>
          </div>
        </div>

      </section>

      <section className="features-section">

        <div className="section-heading">
          <span>FEATURES</span>
          <h2>Everything You Need</h2>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🏘️</div>
            <h3>Property Management</h3>
            <p>
              Add, update, view and remove rental properties
              from one convenient system.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Tenant Management</h3>
            <p>
              Keep track of tenants and their rental
              information.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Payment Tracking</h3>
            <p>
              Monitor rental payments and keep financial
              records organized.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;