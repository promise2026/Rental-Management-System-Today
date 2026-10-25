
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PropertyCard from "../components/PropertyCard";
import FilterBar from "../components/FilterBar";

const API_URL = "http://127.0.0.1:8000/api";

function getPropertyTypeName(property) {
  return (
    property.property_type_name ||
    property.property_type_details?.name ||
    (typeof property.property_type === "object"
      ? property.property_type?.name
      : "") ||
    "Accommodation"
  );
}

function Properties() {
  const [searchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );
  const [propertyType, setPropertyType] = useState(
    searchParams.get("type") || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      setLoading(true);
      setError("");

      let nextUrl = `${API_URL}/properties/`;
      const allProperties = [];

      // Django REST Framework may return results in pages.
      while (nextUrl) {
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

      setProperties(allProperties);
    } catch (err) {
      console.error("Loading properties failed:", err);
      setError(
        "Unable to load accommodation. Check that Django is running and the API is available."
      );
    } finally {
      setLoading(false);
    }
  }

  function addFavorite(property) {
    try {
      const favorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );

      const exists = favorites.some(
        (item) => item.id === property.id
      );

      const updatedFavorites = exists
        ? favorites.filter((item) => item.id !== property.id)
        : [...favorites, property];

      localStorage.setItem(
        "favorites",
        JSON.stringify(updatedFavorites)
      );

      window.dispatchEvent(new Event("storage"));

      // Refresh cards so the heart icon updates immediately.
      setProperties((current) => [...current]);
    } catch (err) {
      console.error("Could not update favorites:", err);
    }
  }

  const filteredProperties = properties.filter((property) => {
    const propertyName = (property.name || "").toLowerCase();
    const propertyLocation = (property.location || "").toLowerCase();
    const propertyStatus = (property.status || "").toLowerCase();
    const propertyTypeValue = getPropertyTypeName(property).toLowerCase();
    const searchValue = search.trim().toLowerCase();

    const locationMatch =
      !location ||
      propertyLocation.includes(location.trim().toLowerCase());

    const typeMatch =
      !propertyType ||
      propertyTypeValue.includes(propertyType.trim().toLowerCase());

    const priceMatch =
      !maxPrice || Number(property.price || 0) <= Number(maxPrice);

    const statusMatch =
      !status || propertyStatus === status.toLowerCase();

    const searchMatch =
      !searchValue ||
      propertyName.includes(searchValue) ||
      propertyLocation.includes(searchValue) ||
      propertyTypeValue.includes(searchValue);

    return (
      locationMatch &&
      typeMatch &&
      priceMatch &&
      statusMatch &&
      searchMatch
    );
  });

  return (
    <main className="page">
      <section className="properties-header">
        <div>
          <span className="page-label">RENTALHUB</span>
          <h1>Find Accommodation</h1>
          <p>
            Discover houses, apartments, rooms and hostels
            available for rent across Uganda.
          </p>
        </div>
      </section>

      <section className="properties-content">
        <FilterBar
          location={location}
          setLocation={setLocation}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          status={status}
          setStatus={setStatus}
        />

        <div className="results-header">
          <div>
            <h2>Available Accommodation</h2>
            <p>
              {loading
                ? "Loading properties..."
                : `${filteredProperties.length} properties found`}
            </p>
          </div>

          <input
            className="property-search"
            type="search"
            placeholder="Search by name, location or type..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search accommodation"
          />
        </div>

        {loading && (
          <div className="loading-box">
            <div className="spinner" />
            <h2>Loading Accommodation...</h2>
            <p>Finding available properties for you.</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-message" role="alert">
            <strong>Error:</strong> {error}
            <button type="button" onClick={loadProperties}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredProperties.length === 0 && (
          <div className="empty-state">
            <div aria-hidden="true">⌕</div>
            <h3>No Accommodation Found</h3>
            <p>Try changing your search or filters.</p>
            <button
              type="button"
              onClick={() => {
                setLocation("");
                setPropertyType("");
                setMaxPrice("");
                setStatus("");
                setSearch("");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && filteredProperties.length > 0 && (
          <div className="property-grid">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorite={addFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Properties;
