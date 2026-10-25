import { Link } from "react-router-dom";

function Profile() {

  const savedUser =
    JSON.parse(
      localStorage.getItem(
        "loggedInUser"
      ) || "null"
    );

  if (!savedUser) {

    return (
      <div className="page">

        <div className="empty-state">

          <div>
            👤
          </div>

          <h2>
            Login Required
          </h2>

          <p>
            Please login to view your profile.
          </p>

          <Link
            to="/login"
            className="btn btn-primary"
          >
            Login
          </Link>

        </div>

      </div>
    );

  }

  return (
    <div className="page">

      <div className="profile-container">

        <div className="profile-header">

          <div className="profile-avatar">
            👤
          </div>

          <div>

            <span className="page-label">
              MY ACCOUNT
            </span>

            <h1>
              {savedUser.name ||
                "RentalHub User"}
            </h1>

            <p>
              {savedUser.email}
            </p>

          </div>

        </div>

        <div className="profile-grid">

          <Link
            to="/favorites"
            className="profile-option"
          >

            <div>
              ❤️
            </div>

            <h3>
              Saved Properties
            </h3>

            <p>
              View accommodation you saved.
            </p>

          </Link>

          <Link
            to="/my-properties"
            className="profile-option"
          >

            <div>
              🏠
            </div>

            <h3>
              My Properties
            </h3>

            <p>
              Manage your listed accommodation.
            </p>

          </Link>

          <Link
            to="/list-property"
            className="profile-option"
          >

            <div>
              ➕
            </div>

            <h3>
              List Property
            </h3>

            <p>
              Advertise a property for rent.
            </p>

          </Link>

        </div>

      </div>

    </div>
  );
}

export default Profile;