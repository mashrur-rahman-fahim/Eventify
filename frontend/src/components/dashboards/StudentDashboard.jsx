import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const StudentDashboard = () => {
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // NOTE: You'll need to create this backend endpoint
    const apiEndpoint = '/api/users/my-registered-events';

    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            try {
                setLoading(true);
                const response = await api.get(apiEndpoint);
                setRegisteredEvents(response.data);
            } catch (err) {
                setError('Failed to load your events.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRegisteredEvents();
    }, []);
    
    const handleUnregister = async (eventId) => {
         if (window.confirm('Are you sure you want to unregister from this event?')) {
            try {
                // NOTE: You'll need to create this backend endpoint
                await api.post(`/api/events/unregister/${eventId}`);
                setRegisteredEvents(registeredEvents.filter(event => event._id !== eventId));
            } catch (err) {
                 console.error("Failed to unregister", err);
                alert("Could not unregister from the event.");
            }
         }
    };

    if (loading) {
        return <div className="text-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;
    }
    
    if (error) {
         return <div role="alert" className="alert alert-error"><span>{error}</span></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Registered Events</h1>
            {registeredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredEvents.map(event => (
                        <div key={event._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">{event.title}</h2>
                                <p>{new Date(event.date).toDateString()} at {event.time}</p>
                                <p>{event.location}</p>
                                <div className="card-actions justify-end mt-4">
                                    <button onClick={() => handleUnregister(event._id)} className="btn btn-outline btn-warning">Unregister</button>
                                    <Link to={`/event/${event._id}`} className="btn btn-primary">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-base-100 rounded-lg">
                    <p className="text-lg">You haven't registered for any events yet.</p>
                    <Link to="/events" className="btn btn-primary mt-4">Browse Events</Link>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;