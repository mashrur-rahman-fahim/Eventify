import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({ totalEvents: 0, upcoming: 0, totalAttendees: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // NOTE: You'll need to create this backend endpoint
    const apiEndpoint = '/api/events/admin/my-events';

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);
                const response = await api.get(apiEndpoint); 
                const myEvents = response.data;
                setEvents(myEvents);

                // Calculate stats
                const upcomingCount = myEvents.filter(e => new Date(e.date) >= new Date()).length;
                const totalAttendeesCount = myEvents.reduce((acc, e) => acc + e.attendees.length, 0);
                setStats({ totalEvents: myEvents.length, upcoming: upcomingCount, totalAttendees: totalAttendeesCount });

            } catch (err) {
                setError('Failed to load dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);
    
    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/api/events/delete/${eventId}`);
                setEvents(events.filter(event => event._id !== eventId));
            } catch (err) {
                console.error("Failed to delete event", err);
                alert("Could not delete the event.");
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
            {/* Quick Stats */}
            <div className="stats shadow w-full stats-vertical md:stats-horizontal mb-8">
                <div className="stat">
                    <div className="stat-title">Total Events Created</div>
                    <div className="stat-value text-primary">{stats.totalEvents}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Upcoming Events</div>
                    <div className="stat-value text-secondary">{stats.upcoming}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Total Registrations</div>
                    <div className="stat-value">{stats.totalAttendees}</div>
                </div>
            </div>

            {/* Event Management Table */}
            <h2 className="text-2xl font-bold mb-4">Manage Your Events</h2>
             <div className="overflow-x-auto bg-base-100 rounded-lg">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Date</th>
                            <th>Attendees</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length > 0 ? events.map(event => (
                            <tr key={event._id}>
                                <td>{event.title}</td>
                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                <td>{event.attendees.length} / {event.maxAttendees || '∞'}</td>
                                <td className="flex gap-2">
                                    <Link to={`/event/edit/${event._id}`} className="btn btn-sm btn-outline btn-info">Edit</Link>
                                    <button onClick={() => handleDelete(event._id)} className="btn btn-sm btn-outline btn-error">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center">You have not created any events yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;