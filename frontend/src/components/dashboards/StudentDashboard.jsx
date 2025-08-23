import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { EventCard } from '../EventCard';
import { EventCardSkeleton } from '../EventCardSkeleton';

const StudentDashboard = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/events/getAll');
                
                // Filter and sort the events directly after fetching
                const filteredAndSortedEvents = response.data
                    .filter(event => new Date(event.date) >= new Date()) // Keep events that are today or in the future
                    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort them with the latest first

                setUpcomingEvents(filteredAndSortedEvents);

            } catch (err) {
                setError('Failed to load events. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <EventCardSkeleton key={i} />)}
                </div>
            );
        }

        if (error) {
            return (
                <div role="alert" className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            );
        }

        if (upcomingEvents.length === 0) {
            return (
                <div className="text-center py-16 bg-base-100 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold">No Upcoming Events Found</h2>
                    <p className="text-base-content/60 mt-2">It's a quiet day! Check back later for new events.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                    <EventCard key={event._id} event={event} />
                ))}
            </div>
        );
    };

    return (
        <div>
            {/* Dashboard Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Featured Events</h1>
                <p className="text-base-content/70 mt-2">Discover what's happening across campus.</p>
            </div>
            
            {/* Main Content Area */}
            {renderContent()}
        </div>
    );
};

export default StudentDashboard;