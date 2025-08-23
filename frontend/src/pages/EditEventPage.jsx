import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

// Helper to format date from ISO string (2023-10-27T...) to YYYY-MM-DD for the input
const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
};

export const EditEventPage = () => {

    const { eventId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/event/getEvent/${eventId}`);
                // Pre-format the dates for the form inputs
                const event = response.data.event;
                event.date = formatDateForInput(event.date);
                event.registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().slice(0, 16) : '';
                setFormData(event);
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
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
                                <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered w-full" required />
                            </div>
                            {/* ... other form fields ... */}
                            <div className="form-control">
                                <label className="label"><span className="label-text">Description</span></label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered h-28" required></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Event Date</span></label>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="input input-bordered w-full" required />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Event Time</span></label>
                                    <input type="time" name="time" value={formData.time} onChange={handleChange} className="input input-bordered w-full" required />
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