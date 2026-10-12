
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";
const BACKEND_URL = "http://127.0.0.1:8000";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/properties/${id}/`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "This property could not be found."
              : "Unable to load this property."
          );
        }

        const data = await response.json();
        setProperty(data);
        setSelectedImage(0);
      } catch (err) {
        console.error("Property details error:", err);
        setError(
          err.message ||
            "Unable to load property. Check that Django is running."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProperty();
    } else {
      setError("No property ID was provided.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!property) return;

    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    setIsFavorite(
      favorites.some(
        (item) => Number(item.id) === Number(property.id)
      )
    );
  }, [property]);

  function getImages() {
    if (Array.isArray(property?.images)) {
      return property.images;
    }

    return [];
  }

  function getImageUrl(image) {
    if (!image) return "";

    const value =
      typeof image === "string"
        ? image
        : image.image_url ||
          image.image ||
          image.url ||
          image.image_file ||
          "";

    if (!value) return "";

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    return `${BACKEND_URL}${value.startsWith("/") ? "" : "/"}${value}`;
  }

  
function getPropertyType() {
  return (
    <h1>{property.name || "Property Name Not Available"}</h1>
  );
}


  function getStatus() {
    const status = String(property?.status || "").toLowerCase();

    if (status === "available") return "Available";
    if (status === "occupied") return "Occupied";
    if (status === "under_review") return "Under Review";

    return property?.status || "Unknown";
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("en-UG").format(
      Number(price) || 0
    );
  }

  function toggleFavorite() {
    if (!property) return;

    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    const alreadySaved = favorites.some(
      (item) => Number(item.id) === Number(property.id)
    );

    let updatedFavorites;

    if (alreadySaved) {
      updatedFavorites = favorites.filter(
        (item) => Number(item.id) !== Number(property.id)
      );
      setIsFavorite(false);
    } else {
      const images = getImages();

      updatedFavorites = [
        ...favorites,
        {
          id: property.id,
          name: property.name,
          location: property.location,
          price: property.price,
          status: property.status,
          image: images.length > 0 ? getImageUrl(images[0]) : "",
          property_type_details: property.property_type_details,
        },
      ];

      setIsFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event("storage"));
  }

  if (loading) {
    return (
      <main className="page">
        <section className="page-header">
          <span className="page-label">PROPERTY DETAILS</span>
          <h1>Loading property...</h1>
          <p>Please wait while the accommodation details load.</p>
        </section>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="page">
        <section className="page-header">
          <span className="page-label">PROPERTY DETAILS</span>
          <h1>Property not found</h1>
          <p>
            {error || "The requested property is not available."}
          </p>
          <Link to="/properties" className="btn btn-primary">
            ← Back to Accommodation
          </Link>
        </section>
      </main>
    );
  }

  const images = getImages();
  const mainImage = getImageUrl(images[selectedImage]);
  const isAvailable =
    String(property.status || "").toLowerCase() === "available";

  return (
    <main className="page">
      <div style={{ marginBottom: "20px" }}>
        <Link to="/properties">← Back to Accommodation</Link>
      </div>

      <section className="page-header">
        <div>
          <span className="page-label">{getPropertyType()}</span>
          <h1>{property.name}</h1>
          <p>📍 {property.location || "Location not specified"}</p>
        </div>

        <button
          type="button"
          onClick={toggleFavorite}
          className="btn btn-light"
          aria-pressed={isFavorite}
        >
          {isFavorite ? "♥ Saved" : "♡ Add to Favorites"}
        </button>
      </section>

      {/* Main property photo */}
      <section style={{ marginBottom: "40px" }}>
        <div
          style={{
            width: "100%",
            height: "clamp(250px, 48vw, 480px)",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#f3f4f6",
            position: "relative",
          }}
        >
          {mainImage ? (
            <img
              src={mainImage}
              alt={property.name || "Accommodation"}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
              }}
            >
              <span style={{ fontSize: "55px" }}>🏠</span>
              <p>No property photo available</p>
            </div>
          )}

          <span
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              padding: "8px 14px",
              borderRadius: "20px",
              background: isAvailable ? "#15803d" : "#6b7280",
              color: "white",
              fontWeight: "600",
            }}
          >
            {getStatus()}
          </span>
        </div>

        {/* Selectable photo thumbnails */}
        {images.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "15px",
              overflowX: "auto",
              paddingBottom: "6px",
            }}
          >
            {images.map((image, index) => {
              const imageUrl = getImageUrl(image);

              return (
                <button
                  key={image.id || index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View property photo ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  style={{
                    width: "100px",
                    height: "75px",
                    flexShrink: 0,
                    padding: 0,
                    border:
                      selectedImage === index
                        ? "3px solid #2563eb"
                        : "2px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "#f3f4f6",
                  }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={
                        image.caption || `Property photo ${index + 1}`
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span>🏠</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Property information and rent */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "25px",
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              padding: "25px",
              borderRadius: "15px",
              background: "white",
              marginBottom: "25px",
            }}
          >
            <span className="page-label">PROPERTY INFORMATION</span>
            <h2>{property.name}</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "22px",
                marginTop: "20px",
              }}
            >
              <div>
                <small>Property Type</small>
                <strong style={{ display: "block", marginTop: "5px" }}>
                  {getPropertyType()}
                </strong>
              </div>

              <div>
                <small>Location</small>
                <strong style={{ display: "block", marginTop: "5px" }}>
                  {property.location || "Not specified"}
                </strong>
              </div>

              <div>
                <small>Availability</small>
                <strong style={{ display: "block", marginTop: "5px" }}>
                  {getStatus()}
                </strong>
              </div>

              <div>
                <small>Property Photos</small>
                <strong style={{ display: "block", marginTop: "5px" }}>
                  {images.length}
                </strong>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "25px",
              borderRadius: "15px",
              background: "white",
            }}
          >
            <span className="page-label">CONTACT</span>
            <h2>Property Agent</h2>

            {property.agent && (
              <p>
                <strong>Agent:</strong> {property.agent}
              </p>
            )}

            {property.contact && (
              <>
                <p>
                  <strong>Phone:</strong> {property.contact}
                </p>
                <a
                  href={`tel:${property.contact}`}
                  className="btn btn-primary"
                  style={{ display: "inline-block", marginTop: "10px" }}
                >
                  📞 Call Agent
                </a>
              </>
            )}

            {!property.agent && !property.contact && (
              <p>Contact information is not available for this property.</p>
            )}
          </div>
        </div>

        <aside
          style={{
            padding: "25px",
            borderRadius: "15px",
            background: "white",
            position: "sticky",
            top: "20px",
          }}
        >
          <span className="page-label">MONTHLY RENT</span>
          <h2 style={{ fontSize: "30px", marginBottom: "5px" }}>
            UGX {formatPrice(property.price)}
          </h2>
          <p>per month</p>

          <hr style={{ margin: "20px 0" }} />

          <p>
            <strong>Availability:</strong> {getStatus()}
          </p>

          {property.contact && (
            <a
              href={`tel:${property.contact}`}
              className="btn btn-primary"
              style={{
                width: "100%",
                display: "block",
                boxSizing: "border-box",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              📞 Contact Agent
            </a>
          )}

          <button
            type="button"
            onClick={toggleFavorite}
            className="btn btn-light"
            style={{ width: "100%", marginTop: "10px" }}
            aria-pressed={isFavorite}
          >
            {isFavorite ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
          </button>
        </aside>
      </section>
    </main>
  );
}

export default PropertyDetails;
