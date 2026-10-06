import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "http://127.0.0.1:8000/api";

function MyProperties() {

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadProperties();

  }, []);

  async function loadProperties() {

    try {

      const response =
        await fetch(
          `${API_URL}/properties/`
        );

      const data =
        await response.json();

      setProperties(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  async function deleteProperty(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this property?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await fetch(
        `${API_URL}/properties/${id}/`,
        {
          method: "DELETE",
        }
      );

      setProperties(
        properties.filter(
          (property) =>
            property.id !== id
        )
      );

      alert(
        "Property deleted successfully."
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete property."
      );

    }

  }

  return (
    <div className="page">

      <div className="page-header">

        <div>

          <span className="page-label">
            PROPERTY OWNER
          </span>

          <h1>
            My Properties
          </h1>

          <p>
            Manage accommodation you have listed.
          </p>

        </div>

        <Link
          to="/list-property"
          className="btn btn-primary"
        >
          + List Property
        </Link>

      </div>

      {loading ? (

        <div className="loading-box">

          <div className="spinner"></div>

          <h2>
            Loading Properties...
          </h2>

        </div>

      ) : properties.length === 0 ? (

        <div className="empty-state">

          <div>
            🏠
          </div>

          <h3>
            You Have No Properties
          </h3>

          <p>
            Start by listing your first property.
          </p>

          <Link
            to="/list-property"
            className="btn btn-primary"
          >
            List Your Property
          </Link>

        </div>

      ) : (

        <div className="property-grid">

          {properties.map(
            (property) => (

              <div
                className="management-card"
                key={property.id}
              >

                <div className="management-icon">
                  🏠
                </div>

                <h3>
                  {property.name}
                </h3>

                <p>
                  📍 {property.location}
                </p>

                <strong>
                  UGX{" "}
                  {Number(
                    property.price
                  ).toLocaleString()}
                  {" "}/ month
                </strong>

                <span className="status available">
                  {property.status}
                </span>

                <div className="management-actions">

                  <Link
                    to={`/properties/${property.id}`}
                    className="btn btn-light"
                  >
                    View
                  </Link>

                  <button
                    className="btn btn-delete"
                    onClick={() =>
                      deleteProperty(
                        property.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default MyProperties;