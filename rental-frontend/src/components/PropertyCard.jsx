import { Link } from "react-router-dom";

function PropertyCard({ property, onFavorite }) {

  const isFavorite =
    JSON.parse(
      localStorage.getItem("favorites") || "[]"
    ).some((item) => item.id === property.id);

  const statusClass =
    property.status === "available"
      ? "status available"
      : property.status === "occupied"
      ? "status occupied"
      : "status review";

  const statusText =
    property.status === "under_review"
      ? "Under Review"
      : property.status
      ? property.status.charAt(0).toUpperCase() +
        property.status.slice(1)
      : "Available";

  return (
    <div className="property-card">

      <div className="property-image">

        <div className="property-image-placeholder">
          🏠
        </div>

        <button
          className={
            isFavorite
              ? "favorite-button favorite-active"
              : "favorite-button"
          }
          onClick={() => onFavorite(property)}
        >
          {isFavorite ? "❤️" : "♡"}
        </button>

        <span className={statusClass}>
          {statusText}
        </span>

      </div>

      <div className="property-card-content">

        <div className="property-type">
          {property.property_type_name ||
            property.property_type ||
            "Accommodation"}
        </div>

        <h3>{property.name}</h3>

        <p className="property-location">
          📍 {property.location}
        </p>

        <div className="property-features">

          <span>
            🏠 {property.bedrooms || 1} Bedroom
            {property.bedrooms > 1 ? "s" : ""}
          </span>

          <span>
            🚿 {property.bathrooms || 1} Bathroom
            {property.bathrooms > 1 ? "s" : ""}
          </span>

        </div>

        <div className="property-card-bottom">

          <div className="property-price">

            <strong>
              UGX{" "}
              {Number(property.price || 0).toLocaleString()}
            </strong>

            <span>/ month</span>

          </div>

          <Link
            to={`/properties/${property.id}`}
            className="view-button"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
}

export default PropertyCard;