import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {

  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleSearch(event) {

    event.preventDefault();

    const params = new URLSearchParams();

    if (location) {
      params.set("location", location);
    }

    if (propertyType) {
      params.set("type", propertyType);
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    }

    navigate(
      `/properties?${params.toString()}`
    );
  }

  return (
    <form
      className="search-bar"
      onSubmit={handleSearch}
    >

      <div className="search-field">

        <label>Location</label>

        <input
          type="text"
          placeholder="e.g. Kampala"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />

      </div>

      <div className="search-field">

        <label>Property Type</label>

        <select
          value={propertyType}
          onChange={(e) =>
            setPropertyType(e.target.value)
          }
        >
          <option value="">
            Any Type
          </option>

          <option value="House">
            House
          </option>

          <option value="Apartment">
            Apartment
          </option>

          <option value="Room">
            Room
          </option>

          <option value="Hostel">
            Hostel
          </option>

          <option value="Self Contained">
            Self Contained
          </option>

        </select>

      </div>

      <div className="search-field">

        <label>Maximum Rent</label>

        <input
          type="number"
          placeholder="e.g. 800000"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value)
          }
        />

      </div>

      <button
        type="submit"
        className="search-button"
      >
        🔍 Search
      </button>

    </form>
  );
}

export default SearchBar;