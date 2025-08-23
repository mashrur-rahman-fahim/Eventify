import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export const CreateEventPage = () => {
    const navigate = useNavigate();

    // State for the list of clubs and the selected club
    const [clubs, setClubs] = useState([]);
    const [selectedClubId, setSelectedClubId] = useState(''); // New state for the selected club ID
    const [clubsLoading, setClubsLoading] = useState(true); // State to track if clubs are being fetched

    // State for form fields
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        maxAttendees: '',
        registrationDeadline: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // State for submission status and errors
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

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
        fetchClubs();
    }, []);

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
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImageFile(null);
            setImagePreview('');
        }
    };

    const validateForm = () => {
        const errors = {};
        // Add validation for club selection
        if (!selectedClubId) errors.club = 'You must select a club.';
        if (!formData.title.trim()) errors.title = 'Title is required.';
        if (!formData.description.trim()) errors.description = 'Description is required.';
        if (!formData.date) errors.date = 'Date is required.';
        if (new Date(formData.date) < new Date().setHours(0,0,0,0)) errors.date = 'Event date cannot be in the past.';
        if (!formData.time) errors.time = 'Time is required.';
        if (!formData.location.trim()) errors.location = 'Location is required.';
        if (!formData.category.trim()) errors.category = 'Category is required.';
        if (!formData.registrationDeadline) errors.registrationDeadline = 'Registration deadline is required.';
        if (new Date(formData.registrationDeadline) > new Date(formData.date)) errors.registrationDeadline = 'Deadline cannot be after the event date.';
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const dataToSubmit = new FormData();
        for (const key in formData) {
            dataToSubmit.append(key, formData[key]);
        }
        if (imageFile) {
            dataToSubmit.append('image', imageFile);
        }

        try {

            // Use the selectedClubId to build the dynamic URL
            await api.post(`/api/event/create/${selectedClubId}`, dataToSubmit);
            console.log(dataToSubmit);
            navigate('/dashboard');


        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8 flex justify-center items-center">
            <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center mb-6">Create New Event</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* --- NEW: Club Selection Dropdown --- */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Organizing Club</span></label>
                            <select
                                name="club"
                                value={selectedClubId}
                                onChange={handleClubChange}
                                className={`select select-bordered w-full ${validationErrors.club && 'select-error'}`}
                                disabled={clubsLoading}
                            >
                                <option value="" disabled>{clubsLoading ? 'Loading clubs...' : 'Select a club'}</option>
                                {clubs.map((club) => (
                                    <option key={club._id} value={club._id}>{club.name}</option>
                                ))}
                            </select>
                            {validationErrors.club && <span className="text-error text-xs mt-1">{validationErrors.club}</span>}
                        </div>
                        
                        {/* Title */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Event Title</span></label>
                            <input type="text" name="title" onChange={handleChange} placeholder="e.g., Annual Tech Summit" className={`input input-bordered w-full ${validationErrors.title && 'input-error'}`} />
                            {validationErrors.title && <span className="text-error text-xs mt-1">{validationErrors.title}</span>}
                        </div>

                        {/* ... (rest of the form fields remain exactly the same) ... */}
                        
                        {/* Description */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Description</span></label>
                            <textarea name="description" onChange={handleChange} className={`textarea textarea-bordered h-28 ${validationErrors.description && 'textarea-error'}`} placeholder="Provide details about the event..."></textarea>
                            {validationErrors.description && <span className="text-error text-xs mt-1">{validationErrors.description}</span>}
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Event Date</span></label>
                                <input type="date" name="date" onChange={handleChange} className={`input input-bordered w-full ${validationErrors.date && 'input-error'}`} />
                                {validationErrors.date && <span className="text-error text-xs mt-1">{validationErrors.date}</span>}
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Event Time</span></label>
                                <input type="time" name="time" onChange={handleChange} className={`input input-bordered w-full ${validationErrors.time && 'input-error'}`} />
                                {validationErrors.time && <span className="text-error text-xs mt-1">{validationErrors.time}</span>}
                            </div>
                        </div>

                        {/* Location & Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Location</span></label>
                                <input type="text" name="location" onChange={handleChange} placeholder="e.g., University Auditorium" className={`input input-bordered w-full ${validationErrors.location && 'input-error'}`} />
                                {validationErrors.location && <span className="text-error text-xs mt-1">{validationErrors.location}</span>}
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Category</span></label>
                                <input type="text" name="category" onChange={handleChange} placeholder="e.g., Workshop, Social, Tech Talk" className={`input input-bordered w-full ${validationErrors.category && 'input-error'}`} />
                                {validationErrors.category && <span className="text-error text-xs mt-1">{validationErrors.category}</span>}
                            </div>
                        </div>
                        
                        {/* Max Attendees & Registration Deadline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Max Attendees (Optional)</span></label>
                                <input type="number" name="maxAttendees" onChange={handleChange} placeholder="Leave blank for unlimited" className="input input-bordered w-full" min="0" />
                            </div>
                             <div className="form-control">
                                <label className="label"><span className="label-text">Registration Deadline</span></label>
                                <input type="datetime-local" name="registrationDeadline" onChange={handleChange} className={`input input-bordered w-full ${validationErrors.registrationDeadline && 'input-error'}`} />
                                {validationErrors.registrationDeadline && <span className="text-error text-xs mt-1">{validationErrors.registrationDeadline}</span>}
                            </div>
                        </div>

                        {/* Image Upload & Preview */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Event Poster (Optional)</span></label>
                            <div className="flex items-center gap-4">
                                <input type="file" name="image" onChange={handleImageChange} className="file-input file-input-bordered w-full max-w-xs" accept="image/*" />
                                {imagePreview && (
                                    <div className="avatar">
                                        <div className="w-24 rounded">
                                            <img src={imagePreview} alt="Image Preview" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Global Error Message */}
                        {error && <div role="alert" className="alert alert-error text-sm"><span>{error}</span></div>}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-6">
                            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-ghost">Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : 'Create Event'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};