
import { useState } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = "http://127.0.0.1:8000";

function getPropertyImages(property) {
  // Support common image fields returned by Django serializers.
  const images = Array.isArray(property.images)
    ? property.images
    : Array.isArray(property.image_urls)
    ? property.image_urls
    : [];

  const urls = images
    .map((item) => {
      if (typeof item === "string") return item;

      return (
        item?.image ||
        item?.image_url ||
        item?.url ||
        item?.image_file ||
        ""
      );
    })
    .filter(Boolean);

  // Also support a single-image field.
  const singleImage =
    property.image ||
    property.image_url ||
    property.main_image ||
    "";

  if (urls.length === 0 && singleImage) {
    urls.push(
      typeof singleImage === "string"
        ? singleImage
        : singleImage?.image || singleImage?.url || ""
    );
  }

  return [...new Set(urls)].filter(Boolean).map((url) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  });
}

function getPropertyType(property) {
  return (
    property.property_type_name ||
    property.property_type_details?.name ||
    (typeof property.property_type === "object"
      ? property.property_type?.name
      : "") ||
    "Accommodation"
  );
}

function PropertyCard({ property, onFavorite }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  let favorites = [];

  try {
    favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
  } catch {
    favorites = [];
  }

  const isFavorite = favorites.some(
    (item) => item.id === property.id
  );

  const images = getPropertyImages(property);
  const currentImage = images[imageIndex];

  const propertyStatus = (
    property.status || "available"
  ).toLowerCase();

  const statusClass =
    propertyStatus === "available"
      ? "status available"
      : propertyStatus === "occupied"
      ? "status occupied"
      : "status review";

  const statusText =
    propertyStatus === "under_review"
      ? "Under Review"
      : propertyStatus.charAt(0).toUpperCase() +
        propertyStatus.slice(1);

  const price = Number(property.price || 0).toLocaleString(
    "en-UG",
    { maximumFractionDigits: 0 }
  );

  function showNextImage(event) {
    event.preventDefault();
    event.stopPropagation();
    setImageFailed(false);
    setImageIndex((current) => (current + 1) % images.length);
  }

  function showPreviousImage(event) {
    event.preventDefault();
    event.stopPropagation();
    setImageFailed(false);
    setImageIndex(
      (current) => (current - 1 + images.length) % images.length
    );
  }

  return (
    <article className="property-card">
      <div
        className="property-image"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#f1f5f9",
        }}
      >
        {currentImage && !imageFailed ? (
          <img
            src={currentImage}
            alt={`${property.name || "Rental property"} in ${
              property.location || "Uganda"
            }`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              minHeight: "220px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            className="property-image-placeholder"
            style={{
              minHeight: "220px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "#64748b",
            }}
          >
            <span style={{ fontSize: "42px" }} aria-hidden="true">
              🏠
            </span>
            <span>
              {imageFailed
                ? "Image unavailable"
                : "No photo available"}
            </span>
          </div>
        )}

        {images.length > 1 && !imageFailed && (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              aria-label="Previous property photo"
              style={{
                position: "absolute",
                top: "50%",
                left: "8px",
                transform: "translateY(-50%)",
                border: 0,
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
              }}
            >
              ‹
            </button>

            <button
              type="button"
              onClick={showNextImage}
              aria-label="Next property photo"
              style={{
                position: "absolute",
                top: "50%",
                right: "8px",
                transform: "translateY(-50%)",
                border: 0,
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
              }}
            >
              ›
            </button>

            <span
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                padding: "4px 8px",
                background: "rgba(0,0,0,0.65)",
                color: "white",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            >
              {imageIndex + 1}/{images.length}
            </span>
          </>
        )}

        <button
          type="button"
          className={
            isFavorite
              ? "favorite-button favorite-active"
              : "favorite-button"
          }
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          aria-pressed={isFavorite}
          onClick={() => onFavorite(property)}
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        <span className={statusClass}>{statusText}</span>
      </div>

      <div className="property-card-content">
        <div className="property-type">{getPropertyType(property)}</div>

        <h3>{property.name || "Rental Accommodation"}</h3>

        <p className="property-location">
          <span aria-hidden="true">📍 </span>
          {property.location || "Location not specified"}
        </p>

        {(property.bedrooms != null ||
          property.bathrooms != null) && (
          <div className="property-features">
            {property.bedrooms != null && (
              <span>
                🛏 {property.bedrooms} Bedroom
                {Number(property.bedrooms) === 1 ? "" : "s"}
              </span>
            )}

            {property.bathrooms != null && (
              <span>
                🛁 {property.bathrooms} Bathroom
                {Number(property.bathrooms) === 1 ? "" : "s"}
              </span>
            )}
          </div>
        )}

        <div className="property-card-bottom">
          <div className="property-price">
            <strong>UGX {price}</strong>
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
    </article>
  );
}

export default PropertyCard;
