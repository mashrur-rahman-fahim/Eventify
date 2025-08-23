import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const AdminDashboard = () => {
    
    const [clubs, setClubs] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [stats, setStats] = useState({ total: 0, upcoming: 0, attendees: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);

                // Fetch clubs and events in parallel for better performance
                const [clubResponse, eventResponse] = await Promise.all([
                    api.get('/api/club/getClubByUserId'),
                    api.get('/api/event/admin/events')
                ]);

                setClubs(clubResponse.data.clubs);

                const events = eventResponse.data.events;
                setMyEvents(events);

                // Calculate stats based on the fetched events
                const upcomingCount = events.filter(e => new Date(e.date) >= new Date()).length;
                const totalAttendeesCount = events.reduce((sum, e) => sum + e.attendees.length, 0);
                setStats({ total: events.length, upcoming: upcomingCount, attendees: totalAttendeesCount });

            } catch (err) {
                setError('Failed to load your dashboard data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to permanently delete this event?')) {
            try {
                await api.delete(`/api/event/delete/${eventId}`);
                setMyEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
            } catch (err) {
                console.error("Failed to delete event", err);
                alert("Could not delete the event.");
            }
        }
    };

    if (loading) {
        return <div className="text-center py-10"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (error) {
        return <div role="alert" className="alert alert-error"><span>{error}</span></div>;
    }

    return (
        <div>
            {/* Header and Create Button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Link to="/create-event" className="btn btn-primary mt-4 md:mt-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Create New Event
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="stats shadow w-full stats-vertical md:stats-horizontal mb-8">
                <div className="stat">
                    <div className="stat-title">My Total Events</div>
                    <div className="stat-value text-primary">{stats.total}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">My Upcoming Events</div>
                    <div className="stat-value text-secondary">{stats.upcoming}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Total Registrations</div>
                    <div className="stat-value">{stats.attendees}</div>
                </div>
            </div>

            {/* --- NEW: My Clubs Section --- */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">My Clubs</h2>
                {clubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {clubs.map(club => (
                            <div key={club._id} className="card bg-base-100 shadow">
                                <div className="card-body">
                                    <h3 className="card-title">{club.name}</h3>
                                    {/* You can add more club details here in the future */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-base-100 rounded-lg p-4 text-center">
                        <p>You are not yet an admin of any clubs.</p>
                    </div>
                )}
            </div>


            {/* Event Management Table */}
            <h2 className="text-2xl font-bold mb-4">Manage My Events</h2>
            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Date & Time</th>
                            <th>Location</th>
                            <th>Attendees</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myEvents.length > 0 ? myEvents.map(event => (
                            <tr key={event._id} className="hover">
                                <td className="font-medium">{event.title}</td>
                                <td>{new Date(event.date).toLocaleDateString()} at {event.time}</td>
                                <td>{event.location}</td>
                                <td>{event.attendees.length} / {event.maxAttendees || '∞'}</td>
                                <td className="flex gap-2 justify-center">
                                    <Link to={`/event/edit/${event._id}`} className="btn btn-sm btn-outline btn-info">Edit</Link>
                                    <button onClick={() => handleDelete(event._id)} className="btn btn-sm btn-outline btn-error">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center py-4">You have not created any events yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;