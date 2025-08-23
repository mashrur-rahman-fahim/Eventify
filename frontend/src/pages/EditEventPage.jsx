import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

// Helper to format date from ISO string (e.g., 2023-10-27T...) to YYYY-MM-DD for the date input
const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
};

// Helper for the datetime-local input
const formatDateTimeForInput = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().slice(0, 16);
};

export const EditEventPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/event/getEvent/${eventId}`);
                const event = response.data.event;
                
                // Pre-format the data to correctly populate the form inputs
                const formattedEvent = {
                    ...event,
                    date: formatDateForInput(event.date),
                    registrationDeadline: formatDateTimeForInput(event.registrationDeadline)
                };
                setFormData(formattedEvent);
            } catch (err) {
                setError('Failed to fetch event data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: null });
        }
    };

    // --- VALIDATION LOGIC ---
    const validateForm = () => {
        const errors = {};
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
        try {
            await api.put(`/api/event/update/${eventId}`, formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update event.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData) {
        return <div className="text-center py-10"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (error && !formData) {
        return <div role="alert" className="alert alert-error m-8"><span>{error}</span></div>;
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8 flex justify-center items-center">
            <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center mb-6">Edit Event</h1>
                    {formData && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* Title */}
                            <div className="form-control">
                                <label className="label"><span className="label-text">Event Title</span></label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} className={`input input-bordered w-full ${validationErrors.title && 'input-error'}`} />
                                {validationErrors.title && <span className="text-error text-xs mt-1">{validationErrors.title}</span>}
                            </div>

                            {/* Description */}
                            <div className="form-control">
                                <label className="label"><span className="label-text">Description</span></label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className={`textarea textarea-bordered h-28 ${validationErrors.description && 'textarea-error'}`} ></textarea>
                                {validationErrors.description && <span className="text-error text-xs mt-1">{validationErrors.description}</span>}
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Event Date</span></label>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} className={`input input-bordered w-full ${validationErrors.date && 'input-error'}`} />
                                    {validationErrors.date && <span className="text-error text-xs mt-1">{validationErrors.date}</span>}
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Event Time</span></label>
                                    <input type="time" name="time" value={formData.time} onChange={handleChange} className={`input input-bordered w-full ${validationErrors.time && 'input-error'}`} />
                                    {validationErrors.time && <span className="text-error text-xs mt-1">{validationErrors.time}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Location</span></label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className={`input input-bordered w-full ${validationErrors.location && 'input-error'}`} />
                                    {validationErrors.location && <span className="text-error text-xs mt-1">{validationErrors.location}</span>}
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Category</span></label>
                                    <input type="text" name="category" value={formData.category} onChange={handleChange} className={`input input-bordered w-full ${validationErrors.category && 'input-error'}`} />
                                    {validationErrors.category && <span className="text-error text-xs mt-1">{validationErrors.category}</span>}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Max Attendees (Optional)</span></label>
                                    <input type="number" name="maxAttendees" value={formData.maxAttendees} onChange={handleChange} className="input input-bordered w-full" min="0" />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Registration Deadline</span></label>
                                    <input type="datetime-local" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} className={`input input-bordered w-full ${validationErrors.registrationDeadline && 'input-error'}`} />
                                    {validationErrors.registrationDeadline && <span className="text-error text-xs mt-1">{validationErrors.registrationDeadline}</span>}
                                </div>
                            </div>

                             {error && <div role="alert" className="alert alert-error text-sm"><span>{error}</span></div>}

                            <div className="flex justify-end gap-4 mt-6">
                                <Link to="/dashboard" className="btn btn-ghost">Cancel</Link>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};