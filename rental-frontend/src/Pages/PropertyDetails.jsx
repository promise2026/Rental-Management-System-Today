import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

const API_URL =
  "http://127.0.0.1:8000/api";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [favorite, setFavorite] =
    useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  function checkFavorite(data) {
    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    return favorites.some(
      (item) => item.id === data.id
    );
  }

  async function loadProperty() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/properties/${id}/`
      );

      if (!response.ok) {
        throw new Error(
          "Property not found"
        );
      }

      const data =
        await response.json();

      setProperty(data);

      setFavorite(
        checkFavorite(data)
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load property details."
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleFavorite() {
    if (!property) {
      return;
    }

    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    const exists = favorites.some(
      (item) => item.id === property.id
    );

    let updated;

    if (exists) {
      updated = favorites.filter(
        (item) =>
          item.id !== property.id
      );
    } else {
      updated = [
        ...favorites,
        property,
      ];
    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );

    setFavorite(!exists);
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading-box">
          <div className="spinner"></div>

          <h2>
            Loading Property...
          </h2>

          <p>
            Please wait while we load the
            accommodation details.
          </p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="page">
        <div className="empty-state">
          <div>🏠</div>

          <h2>
            Property Not Found
          </h2>

          <p>
            The accommodation you are looking
            for could not be found.
          </p>

          <Link
            to="/properties"
            className="btn btn-primary"
          >
            Browse Accommodation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="details-container">

        <Link
          to="/properties"
          className="back-link"
        >
          ← Back to Accommodation
        </Link>

        <section className="property-details-page">

          <div className="details-image">

            <div className="large-property-placeholder">
              🏠
            </div>

          </div>

          <div className="details-content">

            <div className="details-top">

              <span className="page-label">
                {property.property_type_name ||
                  "ACCOMMODATION"}
              </span>

              <button
                className={
                  favorite
                    ? "details-favorite favorite-active"
                    : "details-favorite"
                }
                onClick={toggleFavorite}
              >
                {favorite
                  ? "❤️ Saved"
                  : "♡ Save"}
              </button>

            </div>

            <h1>
              {property.name}
            </h1>

            <p className="details-location">
              📍 {property.location}
            </p>

            <div className="details-price">

              UGX{" "}
              {Number(
                property.price || 0
              ).toLocaleString()}

              <span>
                {" "}/ month
              </span>

            </div>

            <div className="details-status">

              <span
                className={
                  property.status ===
                  "available"
                    ? "status available"
                    : property.status ===
                      "occupied"
                    ? "status occupied"
                    : "status review"
                }
              >
                {property.status ===
                "under_review"
                  ? "Under Review"
                  : property.status
                  ? property.status
                  : "Available"}
              </span>

            </div>

            <div className="details-features">

              <div>
                🛏️

                <strong>
                  {property.bedrooms || 1}
                </strong>

                <span>
                  Bedrooms
                </span>
              </div>

              <div>
                🚿

                <strong>
                  {property.bathrooms || 1}
                </strong>

                <span>
                  Bathrooms
                </span>
              </div>

              <div>
                🅿️

                <strong>
                  Available
                </strong>

                <span>
                  Parking
                </span>
              </div>

            </div>

            <div className="details-section">

              <h2>
                Description
              </h2>

              <p>
                {property.description ||
                  "This accommodation is available for rent. Contact the property agent or owner for more information and to arrange a viewing."}
              </p>

            </div>

            <div className="details-section">

              <h2>
                Contact Property Agent
              </h2>

              <div className="agent-card">

                <div className="agent-avatar">
                  👤
                </div>

                <div>

                  <strong>
                    {property.agent ||
                      "Property Agent"}
                  </strong>

                  <p>
                    📞{" "}
                    {property.contact ||
                      "Contact available"}
                  </p>

                </div>

              </div>

              <a
                href={`tel:${property.contact || ""}`}
                className="btn btn-primary contact-button"
              >
                📞 Contact Agent
              </a>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default PropertyDetails;