import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

function Home() {

  return (
    <div className="home-page">

      <section className="home-hero">

        <div className="hero-overlay"></div>

        <div className="home-hero-content">

          <span className="hero-badge">
            RENTALHUB UGANDA
          </span>

          <h1>
            Find a Place
            <br />
            <span>You Can Call Home</span>
          </h1>

          <p>
            Search for houses, apartments, rooms and
            other accommodation available for rent.
          </p>

          <SearchBar />

        </div>

      </section>

      <section className="popular-section">

        <div className="section-heading">

          <span>
            EXPLORE ACCOMMODATION
          </span>

          <h2>
            Find Your Perfect Accommodation
          </h2>

          <p>
            Browse available rental properties and find
            accommodation that matches your needs and budget.
          </p>

        </div>

        <div className="category-grid">

          <Link
            to="/properties?type=House"
            className="category-card"
          >
            <div className="category-icon">
              🏠
            </div>

            <h3>Houses</h3>

            <p>
              Find houses for families and individuals.
            </p>

          </Link>

          <Link
            to="/properties?type=Apartment"
            className="category-card"
          >
            <div className="category-icon">
              🏢
            </div>

            <h3>Apartments</h3>

            <p>
              Modern apartments in convenient locations.
            </p>

          </Link>

          <Link
            to="/properties?type=Room"
            className="category-card"
          >
            <div className="category-icon">
              🛏️
            </div>

            <h3>Rooms</h3>

            <p>
              Affordable rooms for individuals and students.
            </p>

          </Link>

          <Link
            to="/properties?type=Hostel"
            className="category-card"
          >
            <div className="category-icon">
              🏫
            </div>

            <h3>Hostels</h3>

            <p>
              Convenient accommodation for students.
            </p>

          </Link>

        </div>

      </section>

      <section className="how-section">

        <div className="section-heading">

          <span>
            HOW IT WORKS
          </span>

          <h2>
            Find Accommodation in Three Steps
          </h2>

        </div>

        <div className="steps-grid">

          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              🔍
            </div>

            <h3>Search</h3>

            <p>
              Search accommodation by location,
              property type and budget.
            </p>

          </div>

          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              👀
            </div>

            <h3>Compare</h3>

            <p>
              View property details and compare
              available accommodation.
            </p>

          </div>

          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              📞
            </div>

            <h3>Contact</h3>

            <p>
              Contact the property owner or agent
              when you find a suitable place.
            </p>

          </div>

        </div>

      </section>

      <section className="owner-section">

        <div className="owner-content">

          <span className="page-label">
            PROPERTY OWNERS & AGENTS
          </span>

          <h2>
            Have a Property to Rent?
          </h2>

          <p>
            List your house, apartment, room or hostel
            and connect with people looking for accommodation.
          </p>

          <Link
            to="/list-property"
            className="btn btn-primary"
          >
            List Your Property
          </Link>

        </div>

        <div className="owner-icon">
          🏘️
        </div>

      </section>

    </div>
  );
}

export default Home;