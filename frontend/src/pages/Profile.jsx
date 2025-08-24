import React, { useState, useEffect } from "react";
import api from "../utils/api";
import ConfirmationModal from "../components/ConfirmationModal";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Profile = () => {
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Error Modal
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append("name", formData.name);
      dataToSubmit.append("email", formData.email);
      if (imageFile) {
        dataToSubmit.append("image", imageFile);
      }

      const res = await api.put("/api/updateUserProfile", dataToSubmit, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      updateUser(res.data.user);
      setIsEditing(false);
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      console.error("Failed to update user", err);
      setErrorModal({
        isOpen: true,
        message: "Could not update your profile. Please try again later.",
      });
    }
  };

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, message: "" });
  };

  const handleLogout = async () => {
    try {
      await api.get("/api/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      navigate("/login");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="alert alert-error shadow-lg max-w-lg mx-auto mt-10"
      >
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar handleLogout={handleLogout} />

      <main className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto p-8 bg-base-100 rounded-2xl shadow-lg border border-base-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
              {user?.image?.url ? (
                <img
                  src={user.image.url}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-sm text-gray-500">
                Manage your personal information
              </p>
            </div>
          </div>

          {/* Profile Info */}
          {!isEditing ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-base-200 flex justify-between items-center">
                <span className="font-medium">Name</span>
                <span>{user?.name}</span>
              </div>
              <div className="p-4 rounded-lg bg-base-200 flex justify-between items-center">
                <span className="font-medium">Email</span>
                <span>{user?.email}</span>
              </div>
              <div className="p-4 rounded-lg bg-base-200 flex justify-between items-center">
                <span className="font-medium">Role</span>
                {user?.role
                  ? user.role.level === 0
                    ? "Student"
                    : user.role.level === 1
                    ? "Club Admin"
                    : user.role.name
                  : "N/A"}
              </div>
              <button
                onClick={handleEditToggle}
                className="btn btn-primary w-full mt-4"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-5">
              {/* Profile Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered w-full max-w-xs"
                    accept="image/*"
                  />
                  {(imagePreview || user?.image?.url) && (
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full">
                        <img
                          src={imagePreview || user.image.url}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <label className="label">
                  <span className="label-text-alt text-base-content/70">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Error Modal */}
          <ConfirmationModal
            isOpen={errorModal.isOpen}
            onClose={closeErrorModal}
            onConfirm={closeErrorModal}
            title="Error"
            message={errorModal.message}
            confirmText="OK"
            cancelText=""
            type="error"
            isLoading={false}
          />
        </div>
      </main>
    </div>
  );
};

export default Profile;
