import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { VerifyContext } from "../context/VerifyContext";
import { Navbar } from "../components/Navbar";
import api from "../utils/api";

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const { isVerified, checkLogin, isAdmin, isLoading } =
    useContext(VerifyContext);

  // State for the list of clubs and the selected club
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(""); // New state for the selected club ID
  const [clubsLoading, setClubsLoading] = useState(true); // State to track if clubs are being fetched

  // State for form fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    maxAttendees: "",
    registrationDeadline: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // State for submission status and errors
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Check authentication
  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (!isVerified && !isLoading && !isAdmin) {
      navigate("/login");
    }
  }, [isVerified, isLoading, navigate, isAdmin]);

  // Fetch the admin's clubs
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setClubsLoading(true);
        const response = await api.get("/api/club/getClubByUserId");
        setClubs(response.data.clubs);
      } catch (error) {
        console.log(error);
        setError("Could not load your clubs. Please try again later.");
      } finally {
        setClubsLoading(false);
      }
    };

    if (isVerified) {
      fetchClubs();
    }
  }, [isVerified]);

  const handleLogout = async () => {
    try {
      const res = await api.get("/api/logout");
      if (res.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: null });
    }
  };

  // New handler for the club dropdown
  const handleClubChange = (e) => {
    setSelectedClubId(e.target.value);
    if (validationErrors.club) {
      setValidationErrors({ ...validationErrors, club: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (JPG, PNG, GIF)");
        e.target.value = ""; // Clear the input
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        e.target.value = ""; // Clear the input
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(""); // Clear any previous errors
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const validateForm = () => {
    const errors = {};
    // Add validation for club selection
    if (!selectedClubId) errors.club = "You must select a club.";
    if (!formData.title.trim()) errors.title = "Title is required.";
    if (!formData.description.trim())
      errors.description = "Description is required.";
    if (!formData.date) errors.date = "Date is required.";
    if (new Date(formData.date) < new Date().setHours(0, 0, 0, 0))
      errors.date = "Event date cannot be in the past.";
    if (!formData.time) errors.time = "Time is required.";
    if (!formData.location.trim()) errors.location = "Location is required.";
    if (!formData.category.trim()) errors.category = "Category is required.";
    if (!formData.registrationDeadline)
      errors.registrationDeadline = "Registration deadline is required.";
    if (new Date(formData.registrationDeadline) > new Date(formData.date))
      errors.registrationDeadline = "Deadline cannot be after the event date.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setUploading(true);

    const dataToSubmit = new FormData();
    for (const key in formData) {
      dataToSubmit.append(key, formData[key]);
    }
    if (imageFile) {
      dataToSubmit.append("image", imageFile);
      console.log(
        "Image file added to FormData:",
        imageFile.name,
        imageFile.size
      );
    }

    // Debug: Log FormData contents
    console.log("FormData contents:");
    for (let [key, value] of dataToSubmit.entries()) {
      console.log(key, value);
    }

    try {
      // Use the selectedClubId to build the dynamic URL
      await api.post(`/api/event/create/${selectedClubId}`, dataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(dataToSubmit);
      navigate("/dashboard");
    } catch (err) {
      console.error("Event creation error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to create event. Please try again.");
      }
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // Show loading or redirect if not authenticated
  if (!isVerified && isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar handleLogout={handleLogout} />

      <main className="container mx-auto p-4 md:p-8 flex justify-center items-center">
        <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center mb-6">
              Create New Event
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* --- NEW: Club Selection Dropdown --- */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Organizing Club</span>
                </label>
                <select
                  name="club"
                  value={selectedClubId}
                  onChange={handleClubChange}
                  className={`select select-bordered w-full ${
                    validationErrors.club && "select-error"
                  }`}
                  disabled={clubsLoading}
                >
                  <option value="" disabled>
                    {clubsLoading ? "Loading clubs..." : "Select a club"}
                  </option>
                  {clubs.map((club) => (
                    <option key={club._id} value={club._id}>
                      {club.name}
                    </option>
                  ))}
                </select>
                {validationErrors.club && (
                  <span className="text-error text-xs mt-1">
                    {validationErrors.club}
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Event Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  placeholder="e.g., Annual Tech Summit"
                  className={`input input-bordered w-full ${
                    validationErrors.title && "input-error"
                  }`}
                />
                {validationErrors.title && (
                  <span className="text-error text-xs mt-1">
                    {validationErrors.title}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  onChange={handleChange}
                  className={`textarea textarea-bordered h-28 ${
                    validationErrors.description && "textarea-error"
                  }`}
                  placeholder="Provide details about the event..."
                ></textarea>
                {validationErrors.description && (
                  <span className="text-error text-xs mt-1">
                    {validationErrors.description}
                  </span>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Event Date</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    onChange={handleChange}
                    className={`input input-bordered w-full ${
                      validationErrors.date && "input-error"
                    }`}
                  />
                  {validationErrors.date && (
                    <span className="text-error text-xs mt-1">
                      {validationErrors.date}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Event Time</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    onChange={handleChange}
                    className={`input input-bordered w-full ${
                      validationErrors.time && "input-error"
                    }`}
                  />
                  {validationErrors.time && (
                    <span className="text-error text-xs mt-1">
                      {validationErrors.time}
                    </span>
                  )}
                </div>
              </div>

              {/* Location & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    onChange={handleChange}
                    placeholder="e.g., University Auditorium"
                    className={`input input-bordered w-full ${
                      validationErrors.location && "input-error"
                    }`}
                  />
                  {validationErrors.location && (
                    <span className="text-error text-xs mt-1">
                      {validationErrors.location}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    onChange={handleChange}
                    placeholder="e.g., Workshop, Social, Tech Talk"
                    className={`input input-bordered w-full ${
                      validationErrors.category && "input-error"
                    }`}
                  />
                  {validationErrors.category && (
                    <span className="text-error text-xs mt-1">
                      {validationErrors.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Max Attendees & Registration Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Max Attendees (Optional)</span>
                  </label>
                  <input
                    type="number"
                    name="maxAttendees"
                    onChange={handleChange}
                    placeholder="Leave blank for unlimited"
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Registration Deadline</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    onChange={handleChange}
                    className={`input input-bordered w-full ${
                      validationErrors.registrationDeadline && "input-error"
                    }`}
                  />
                  {validationErrors.registrationDeadline && (
                    <span className="text-error text-xs mt-1">
                      {validationErrors.registrationDeadline}
                    </span>
                  )}
                </div>
              </div>

              {/* Image Upload & Preview */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Event Poster (Optional)</span>
                </label>
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      className="file-input file-input-bordered w-full"
                      accept="image/*"
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/70">
                        Supported formats: JPG, PNG, GIF. Max size: 5MB
                      </span>
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="avatar">
                        <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-base-300">
                          <img
                            src={imagePreview}
                            alt="Image Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                          // Clear the file input
                          const fileInput = document.querySelector(
                            'input[name="image"]'
                          );
                          if (fileInput) fileInput.value = "";
                        }}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
                {imageFile && (
                  <div className="mt-2 p-2 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 text-success text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Image selected: {imageFile.name} (
                      {(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  </div>
                )}
              </div>

              {/* Global Error Message */}
              {error && (
                <div role="alert" className="alert alert-error text-sm">
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Create Event"
                  )}
                  {uploading && imageFile && (
                    <span className="ml-2 text-sm">(Uploading image...)</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateEventPage;
