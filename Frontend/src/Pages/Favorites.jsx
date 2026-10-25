
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();

    window.addEventListener(
      "storage",
      loadFavorites
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadFavorites
      );
    };
  }, []);

  function loadFavorites() {
    const savedFavorites =
      JSON.parse(
        localStorage.getItem("favorites")
      ) || [];

    setFavorites(savedFavorites);
  }

  function removeFavorite(id) {
    const updatedFavorites =
      favorites.filter(
        (property) =>
          Number(property.id) !== Number(id)
      );

    localStorage.setItem(
      "favorites",
      JSON.stringify(updatedFavorites)
    );

    setFavorites(updatedFavorites);
  }

  function clearFavorites() {
    localStorage.removeItem("favorites");

    setFavorites([]);
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("en-UG").format(
      Number(price) || 0
    );
  }

  function getStatusLabel(status) {
    if (status === "available") {
      return "Available";
    }

    if (status === "occupied") {
      return "Occupied";
    }

    if (status === "under_review") {
      return "Under Review";
    }

    return status || "Unknown";
  }

  return (
    <div className="page">

      {/* PAGE HEADER */}

      <section className="page-header">

        <div>

          <span className="page-label">
            SAVED PROPERTIES
          </span>

          <h1>
            My Favorites
          </h1>

          <p>
            Properties you have saved for
            later.
          </p>

        </div>

        {favorites.length > 0 && (
          <button
            type="button"
            className="btn btn-light"
            onClick={clearFavorites}
          >
            Clear All
          </button>
        )}

      </section>


      {/* EMPTY STATE */}

      {favorites.length === 0 && (

        <section
          style={{
            textAlign: "center",
            padding: "70px 20px",
            background: "#ffffff",
            borderRadius: "16px",
            marginTop: "30px",
          }}
        >

          <div
            style={{
              fontSize: "60px",
              marginBottom: "20px",
            }}
          >
            ♡
          </div>

          <h2>
            No Favorite Properties
          </h2>

          <p
            style={{
              maxWidth: "500px",
              margin:
                "10px auto 25px",
            }}
          >
            You have not saved any
            properties yet. Browse available
            accommodation and save properties
            you like.
          </p>

          <Link
            to="/properties"
            className="btn btn-primary"
          >
            Browse Properties
          </Link>

        </section>

      )}


      {/* FAVORITES */}

      {favorites.length > 0 && (

        <>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginTop: "30px",
              marginBottom: "20px",
            }}
          >

            <h2>
              Saved Properties
            </h2>

            <span>
              {favorites.length}{" "}
              {favorites.length === 1
                ? "property"
                : "properties"}
            </span>

          </div>


          <section className="property-grid">

            {favorites.map(
              (property) => (

                <article
                  className="property-card"
                  key={property.id}
                >

                  {/* PROPERTY IMAGE */}

                  <div className="property-image">

                    {property.image ? (

                      <img
                        src={property.image}
                        alt={
                          property.name
                        }
                      />

                    ) : (

                      <div
                        className="image-placeholder"
                      >

                        <span>
                          🏠
                        </span>

                        <p>
                          No image available
                        </p>

                      </div>

                    )}


                    {/* STATUS */}

                    <span
                      className={`property-status ${
                        property.status ||
                        ""
                      }`}
                    >
                      {getStatusLabel(
                        property.status
                      )}
                    </span>

                  </div>


                  {/* PROPERTY INFORMATION */}

                  <div className="property-card-content">

                    <span className="property-type">
                      Accommodation
                    </span>

                    <h3>
                      {property.name}
                    </h3>

                    <p className="property-location">
                      📍{" "}
                      {property.location}
                    </p>


                    <div className="property-price">

                      <strong>
                        UGX{" "}
                        {formatPrice(
                          property.price
                        )}
                      </strong>

                      <span>
                        / month
                      </span>

                    </div>


                    {/* ACTIONS */}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "15px",
                      }}
                    >

                      <Link
                        to={`/properties/${property.id}`}
                        className="btn btn-primary"
                        style={{
                          flex: 1,
                          textAlign:
                            "center",
                        }}
                      >
                        View Property
                      </Link>


                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() =>
                          removeFavorite(
                            property.id
                          )
                        }
                        title="Remove from favorites"
                      >
                        ♥
                      </button>

                    </div>

                  </div>

                </article>

              )
            )}

          </section>

        </>

      )}

    </div>
  );
}

export default Favorites;

