import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Favorites() {

  const [favorites, setFavorites] =
    useState([]);

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

    const saved =
      JSON.parse(
        localStorage.getItem(
          "favorites"
        ) || "[]"
      );

    setFavorites(saved);

  }

  function removeFavorite(id) {

    const updated =
      favorites.filter(
        (property) =>
          property.id !== id
      );

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );

    setFavorites(updated);

  }

  return (
    <div className="page">

      <div className="page-header">

        <div>

          <span className="page-label">
            RENTALHUB
          </span>

          <h1>
            Saved Accommodation
          </h1>

          <p>
            Properties you have saved for later.
          </p>

        </div>

      </div>

      {favorites.length === 0 ? (

        <div className="empty-state">

          <div>
            ❤️
          </div>

          <h3>
            No Saved Properties
          </h3>

          <p>
            When you find accommodation you like,
            save it here for easy access.
          </p>

          <Link
            to="/properties"
            className="btn btn-primary"
          >
            Find Accommodation
          </Link>

        </div>

      ) : (

        <div className="property-grid">

          {favorites.map(
            (property) => (

              <div
                className="property-card"
                key={property.id}
              >

                <div className="property-image">

                  <div className="property-image-placeholder">
                    🏠
                  </div>

                  <span className="status available">
                    {property.status ||
                      "Available"}
                  </span>

                </div>

                <div className="property-card-content">

                  <h3>
                    {property.name}
                  </h3>

                  <p className="property-location">
                    📍 {property.location}
                  </p>

                  <div className="property-price">

                    <strong>
                      UGX{" "}
                      {Number(
                        property.price ||
                          0
                      ).toLocaleString()}
                    </strong>

                    <span>
                      / month
                    </span>

                  </div>

                  <div className="management-actions">

                    <Link
                      to={`/properties/${property.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>

                    <button
                      className="btn btn-delete"
                      onClick={() =>
                        removeFavorite(
                          property.id
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Favorites;