function FilterBar({
  location,
  setLocation,
  propertyType,
  setPropertyType,
  maxPrice,
  setMaxPrice,
  status,
  setStatus,
}) {

  function clearFilters() {

    setLocation("");
    setPropertyType("");
    setMaxPrice("");
    setStatus("");

  }

  return (
    <div className="filter-bar">

      <div className="filter-group">

        <label>Location</label>

        <input
          type="text"
          placeholder="Search location"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />

      </div>

      <div className="filter-group">

        <label>Property Type</label>

        <select
          value={propertyType}
          onChange={(e) =>
            setPropertyType(e.target.value)
          }
        >

          <option value="">
            All Types
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

      <div className="filter-group">

        <label>Maximum Rent</label>

        <input
          type="number"
          placeholder="Maximum UGX"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value)
          }
        />

      </div>

      <div className="filter-group">

        <label>Availability</label>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >

          <option value="">
            Any Status
          </option>

          <option value="available">
            Available
          </option>

          <option value="occupied">
            Occupied
          </option>

          <option value="under_review">
            Under Review
          </option>

        </select>

      </div>

      <button
        className="clear-filter-button"
        onClick={clearFilters}
      >
        Clear Filters
      </button>

    </div>
  );
}

export default FilterBar;