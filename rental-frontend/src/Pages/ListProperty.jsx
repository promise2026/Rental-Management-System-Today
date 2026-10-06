
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

const API_URL =
  "http://127.0.0.1:8000/api";

function ListProperty() {
  const navigate = useNavigate();

  const [propertyTypes, setPropertyTypes] =
    useState([]);

  const [owners, setOwners] =
    useState([]);

  const [form, setForm] = useState({
    name: "",
    property_type: "",
    location: "",
    price: "",
    owner: "",
    agent: "",
    status: "available",
    contact: "",
  });

  const [images, setImages] =
    useState([]);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions() {
    try {
      const [
        typesResponse,
        ownersResponse,
      ] = await Promise.all([
        fetch(
          `${API_URL}/property-types/`
        ),
        fetch(
          `${API_URL}/property-owners/`
        ),
      ]);

      if (!typesResponse.ok) {
        throw new Error(
          "Failed to load property types"
        );
      }

      if (!ownersResponse.ok) {
        throw new Error(
          "Failed to load property owners"
        );
      }

      const types =
        await typesResponse.json();

      const ownersData =
        await ownersResponse.json();

      setPropertyTypes(types);
      setOwners(ownersData);
    } catch (error) {
      console.error(
        "Error loading options:",
        error
      );

      alert(
        "Failed to load property types or owners."
      );
    }
  }

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleImageChange(event) {
    const selectedFiles =
      Array.from(event.target.files);

    if (selectedFiles.length === 0) {
      return;
    }

    const imageFiles =
      selectedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

    if (
      imageFiles.length !==
      selectedFiles.length
    ) {
      alert(
        "Only image files are allowed."
      );
    }

    setImages((previousImages) => [
      ...previousImages,
      ...imageFiles,
    ]);

    // Allows selecting the same file again
    event.target.value = "";
  }

  function removeImage(indexToRemove) {
    setImages((previousImages) =>
      previousImages.filter(
        (_, index) =>
          index !== indexToRemove
      )
    );
  }

  async function uploadImages(propertyId) {
    if (images.length === 0) {
      return;
    }

    for (
      let index = 0;
      index < images.length;
      index++
    ) {
      const imageFile = images[index];

      const imageData =
        new FormData();

      imageData.append(
        "property",
        propertyId
      );

      imageData.append(
        "image",
        imageFile
      );

      imageData.append(
        "caption",
        `Property photo ${index + 1}`
      );

      const response =
        await fetch(
          `${API_URL}/property-images/`,
          {
            method: "POST",
            body: imageData,
          }
        );

      if (!response.ok) {
        const errorData =
          await response.json();

        console.error(
          "Image upload error:",
          errorData
        );

        throw new Error(
          `Failed to upload image ${index + 1}`
        );
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      const propertyData = {
        name: form.name,

        property_type:
          Number(
            form.property_type
          ),

        location:
          form.location,

        price:
          Number(form.price),

        owner:
          Number(form.owner),

        agent:
          form.agent,

        status:
          form.status,

        contact:
          Number(form.contact),
      };

      // Step 1: Create the property
      const response =
        await fetch(
          `${API_URL}/properties/`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                propertyData
              ),
          }
        );

      if (!response.ok) {
        const data =
          await response.json();

        console.error(
          "Property creation error:",
          data
        );

        throw new Error(
          "Failed to add property"
        );
      }

      const createdProperty =
        await response.json();

      // Step 2: Upload selected images
      await uploadImages(
        createdProperty.id
      );

      alert(
        images.length > 0
          ? `Property listed successfully with ${images.length} photo(s)!`
          : "Property listed successfully!"
      );

      navigate("/properties");
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Failed to list property. Check your Django server."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">

      <section className="page-header">

        <div>

          <span className="page-label">
            PROPERTY OWNERS & AGENTS
          </span>

          <h1>
            List Your Property
          </h1>

          <p>
            Advertise your accommodation and
            connect with potential tenants.
          </p>

        </div>

      </section>


      <section className="listing-section">

        <div className="listing-intro">

          <div className="listing-icon">
            🏠
          </div>

          <h2>
            Property Information
          </h2>

          <p>
            Provide accurate information about
            your accommodation.
          </p>

        </div>


        <form
          className="listing-form"
          onSubmit={handleSubmit}
        >

          <div className="form-grid">


            {/* Property Name */}

            <div className="form-group">

              <label>
                Property Name
              </label>

              <input
                name="name"
                type="text"
                placeholder="e.g. Pearl Apartments"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* Property Type */}

            <div className="form-group">

              <label>
                Property Type
              </label>

              <select
                name="property_type"
                value={
                  form.property_type
                }
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Property Type
                </option>

                {propertyTypes.map(
                  (type) => (

                    <option
                      key={type.id}
                      value={type.id}
                    >
                      {type.name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Location */}

            <div className="form-group">

              <label>
                Location
              </label>

              <input
                name="location"
                type="text"
                placeholder="e.g. Ntinda, Kampala"
                value={form.location}
                onChange={handleChange}
                required
              />

            </div>


            {/* Monthly Rent */}

            <div className="form-group">

              <label>
                Monthly Rent (UGX)
              </label>

              <input
                name="price"
                type="number"
                min="0"
                placeholder="800000"
                value={form.price}
                onChange={handleChange}
                required
              />

            </div>


            {/* Property Owner */}

            <div className="form-group">

              <label>
                Property Owner
              </label>

              <select
                name="owner"
                value={form.owner}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Owner
                </option>

                {owners.map(
                  (owner) => (

                    <option
                      key={owner.id}
                      value={owner.id}
                    >
                      {owner.owner_name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Agent */}

            <div className="form-group">

              <label>
                Agent Name
              </label>

              <input
                name="agent"
                type="text"
                placeholder="Agent name"
                value={form.agent}
                onChange={handleChange}
                required
              />

            </div>


            {/* Contact */}

            <div className="form-group">

              <label>
                Contact Number
              </label>

              <input
                name="contact"
                type="number"
                placeholder="700000000"
                value={form.contact}
                onChange={handleChange}
                required
              />

            </div>


            {/* Availability */}

            <div className="form-group">

              <label>
                Availability
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >

                <option value="available">
                  Available
                </option>

                <option value="under_review">
                  Under Review
                </option>

                <option value="occupied">
                  Occupied
                </option>

              </select>

            </div>

          </div>


          {/* PROPERTY IMAGES */}

          <div className="property-images-section">

            <div className="images-heading">

              <h2>
                Property Photos
              </h2>

              <p>
                Add clear photos of the
                accommodation to help potential
                tenants see the property.
              </p>

            </div>


            <div className="form-group">

              <label htmlFor="property-images">
                Select Property Photos
              </label>

              <input
                id="property-images"
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleImageChange
                }
              />

              <small>
                You can select multiple photos
                at once.
              </small>

            </div>


            {/* IMAGE PREVIEWS */}

            {images.length > 0 && (

              <div className="image-preview-grid">

                {images.map(
                  (image, index) => {

                    const imagePreview =
                      URL.createObjectURL(
                        image
                      );

                    return (

                      <div
                        className="image-preview-card"
                        key={`${image.name}-${index}`}
                      >

                        <img
                          src={imagePreview}
                          alt={`Property preview ${index + 1}`}
                        />

                        <div className="image-preview-info">

                          <span>
                            {image.name}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </div>


          {/* FORM BUTTONS */}

          <div className="form-actions">

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >

              {saving
                ? "Publishing..."
                : "Publish Property"}

            </button>


            <Link
              to="/properties"
              className="btn btn-light"
            >
              Cancel
            </Link>

          </div>

        </form>

      </section>

    </div>
  );
}

export default ListProperty;

