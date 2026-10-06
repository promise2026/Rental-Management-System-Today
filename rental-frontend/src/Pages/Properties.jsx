import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PropertyCard from "../components/PropertyCard";
import FilterBar from "../components/FilterBar";

const API_URL =
  "http://127.0.0.1:8000/api";

function Properties() {

  const [searchParams] = useSearchParams();

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [location, setLocation] =
    useState(searchParams.get("location") || "");

  const [propertyType, setPropertyType] =
    useState(searchParams.get("type") || "");

  const [maxPrice, setMaxPrice] =
    useState(searchParams.get("maxPrice") || "");

  const [status, setStatus] =
    useState("");

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    loadProperties();

  }, []);

  async function loadProperties() {

    try {

      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_URL}/properties/`
        );

      if (!response.ok) {

        throw new Error(
          "Failed to load properties"
        );

      }

      const data =
        await response.json();

      setProperties(data);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load accommodation. Make sure the Django server is running."
      );

    } finally {

      setLoading(false);

    }

  }

  function addFavorite(property) {

    const favorites =
      JSON.parse(
        localStorage.getItem("favorites") ||
        "[]"
      );

    const exists =
      favorites.some(
        (item) => item.id === property.id
      );

    let updatedFavorites;

    if (exists) {

      updatedFavorites =
        favorites.filter(
          (item) =>
            item.id !== property.id
        );

    } else {

      updatedFavorites = [
        ...favorites,
        property,
      ];

    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(
        updatedFavorites
      )
    );

    window.dispatchEvent(
      new Event("storage")
    );

    setProperties([
      ...properties,
    ]);

  }

  const filteredProperties =
    properties.filter((property) => {

      const propertyName =
        (
          property.name || ""
        ).toLowerCase();

      const propertyLocation =
        (
          property.location || ""
        ).toLowerCase();

      const propertyStatus =
        (
          property.status || ""
        ).toLowerCase();

      const propertyTypeValue =
        String(
          property.property_type_name ||
          property.property_type ||
          ""
        ).toLowerCase();

      const searchValue =
        search.toLowerCase();

      const locationMatch =
        !location ||
        propertyLocation.includes(
          location.toLowerCase()
        );

      const typeMatch =
        !propertyType ||
        propertyTypeValue.includes(
          propertyType.toLowerCase()
        );

      const priceMatch =
        !maxPrice ||
        Number(property.price) <=
          Number(maxPrice);

      const statusMatch =
        !status ||
        propertyStatus ===
          status.toLowerCase();

      const searchMatch =
        !searchValue ||
        propertyName.includes(
          searchValue
        ) ||
        propertyLocation.includes(
          searchValue
        ) ||
        propertyTypeValue.includes(
          searchValue
        );

      return (
        locationMatch &&
        typeMatch &&
        priceMatch &&
        statusMatch &&
        searchMatch
      );

    });

  return (
    <div className="page">

      <section className="properties-header">

        <div>

          <span className="page-label">
            RENTALHUB
          </span>

          <h1>
            Find Accommodation
          </h1>

          <p>
            Discover houses, apartments, rooms and
            hostels available for rent.
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

            <h2>
              Available Accommodation
            </h2>

            <p>
              {filteredProperties.length}
              {" "}
              properties found
            </p>

          </div>

          <input
            className="property-search"
            type="text"
            placeholder="Search accommodation..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {loading && (

          <div className="loading-box">

            <div className="spinner"></div>

            <h2>
              Loading Accommodation...
            </h2>

            <p>
              Finding available properties.
            </p>

          </div>

        )}

        {error && (

          <div className="error-message">

            <strong>
              Error:
            </strong>

            {" "}

            {error}

            <button
              onClick={loadProperties}
            >
              Try Again
            </button>

          </div>

        )}

        {!loading &&
          !error &&
          filteredProperties.length === 0 && (

            <div className="empty-state">

              <div>
                🔍
              </div>

              <h3>
                No Accommodation Found
              </h3>

              <p>
                Try changing your search
                or filters.
              </p>

            </div>

          )}

        {!loading &&
          filteredProperties.length > 0 && (

            <div className="property-grid">

              {filteredProperties.map(
                (property) => (

                  <PropertyCard
                    key={property.id}
                    property={property}
                    onFavorite={addFavorite}
                  />

                )
              )}

            </div>

          )}

      </section>

    </div>
  );
}

export default Properties;