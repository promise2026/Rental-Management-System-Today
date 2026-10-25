
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";

const API_URL = "http://127.0.0.1:8000/api";

// Images used for accommodation categories and the steps section.
const categoryImages = [
  {
    name: "Houses",
    description: "Find houses for families and individuals.",
    type: "House",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Apartments",
    description: "Explore apartments in convenient locations.",
    type: "Apartment",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Rooms",
    description: "Find affordable rooms for individuals and students.",
    type: "Room",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Hostels",
    description: "Explore convenient student accommodation.",
    type: "Hostel",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=700&q=80",
  },
];

const steps = [
  {
    number: "01",
    title: "Search",
    description:
      "Search accommodation by location, property type and budget.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80",
    alt: "Buildings in a city",
  },
  {
    number: "02",
    title: "Compare",
    description:
      "View property photos, details and rental prices before choosing.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=500&q=80",
    alt: "Interior of a comfortable home",
  },
  {
    number: "03",
    title: "Contact",
    description:
      "Contact the property owner or agent about a suitable place.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=500&q=80",
    alt: "People discussing an arrangement",
  },
];

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFeaturedProperties() {
      try {
        setLoading(true);
        setError("");

        let nextUrl = `${API_URL}/properties/`;
        const allProperties = [];

        // Support both paginated and non-paginated Django responses.
        while (nextUrl && !cancelled) {
          const response = await fetch(nextUrl);

          if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
          }

          const data = await response.json();

          if (Array.isArray(data)) {
            allProperties.push(...data);
            nextUrl = null;
          } else {
            allProperties.push(...(data.results || []));
            nextUrl = data.next || null;
          }
        }

        if (!cancelled) {
          const availableProperties = allProperties.filter(
            (property) =>
              (property.status || "available").toLowerCase() ===
              "available"
          );

          setProperties(availableProperties);
        }
      } catch (err) {
        console.error("Failed to load featured properties:", err);

        if (!cancelled) {
          setError(
            "We could not load accommodation. Please check your connection and try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFeaturedProperties();

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleFavorite(property) {
    try {
      const savedFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );

      const alreadySaved = savedFavorites.some(
        (item) => item.id === property.id
      );

      const updatedFavorites = alreadySaved
        ? savedFavorites.filter((item) => item.id !== property.id)
        : [...savedFavorites, property];

      localStorage.setItem(
        "favorites",
        JSON.stringify(updatedFavorites)
      );

      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Unable to update favorites:", err);
    }
  }

  return (
    <main className="home-page">
      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="hero-overlay"></div>

        <div className="home-hero-content">
          <span className="hero-badge">RENTALHUB UGANDA</span>

          <h1>
            Find a Place
            <br />
            <span>You Can Call Home</span>
          </h1>

          <p>
            Discover houses, apartments, rooms and hostels
            available for rent across Uganda.
          </p>

          <SearchBar />
        </div>
      </section>

      {/* ACCOMMODATION CATEGORIES */}
      <section className="popular-section">
        <div className="section-heading">
          <span>EXPLORE ACCOMMODATION</span>

          <h2>Find Your Perfect Accommodation</h2>

          <p>
            Browse available rental properties and find a place
            that matches your needs and budget.
          </p>
        </div>

        <div className="category-grid">
          {categoryImages.map((category) => (
            <Link
              key={category.type}
              to={`/properties?type=${encodeURIComponent(category.type)}`}
              className="category-card"
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="category-image"
                style={{
                  width: "100%",
                  height: "190px",
                  objectFit: "cover",
                  display: "block",
                  borderRadius: "10px",
                }}
              />

              <h3>{category.name}</h3>

              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED ACCOMMODATION */}
      <section className="popular-section featured-section">
        <div className="section-heading">
          <span>PLACES YOU CAN CALL HOME</span>

          <h2>Featured Accommodation</h2>

          <p>
            Explore available places and compare their locations,
            photographs and rental prices.
          </p>
        </div>

        {loading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <h3>Loading Accommodation...</h3>
            <p>Finding available properties for you.</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-message" role="alert">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="empty-state">
            <h3>No Available Accommodation Yet</h3>

            <p>
              There are currently no available properties to display.
              Please check again later.
            </p>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="property-grid">
            {properties.slice(0, 6).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        <div className="featured-actions">
          <Link to="/properties" className="btn btn-primary">
            View All Accommodation
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-heading">
          <span>HOW IT WORKS</span>

          <h2>Find Accommodation in Three Steps</h2>

          <p>
            Your journey to finding a suitable place to stay
            starts here.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <div className="step-number">{step.number}</div>

              <img
                src={step.image}
                alt={step.alt}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                  display: "block",
                  borderRadius: "10px",
                  marginBottom: "16px",
                }}
              />

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
