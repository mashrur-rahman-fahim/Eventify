import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export const EditClubPage = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState(''); // New state for description

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClub = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/club/getClub/${clubId}`);
                const club = response.data.club;

                setName(club.name);
                setDescription(club.description || ''); 

            } catch (err) {
                setError('Failed to fetch club data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchClub();
    }, [clubId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.put(`/api/club/update/${clubId}`, { name, description });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update club.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !name && !description) {
        return <div className="text-center py-10"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8 flex justify-center items-center">
            <div className="card w-full max-w-lg bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center mb-6">Edit Club</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Input */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Club Name</span></label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="input input-bordered w-full" 
                                required 
                            />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Club Description</span></label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                className="textarea textarea-bordered h-24 w-full"
                                placeholder="What is this club about?"
                                required 
                            ></textarea>
                        </div>

                        {/* Error Display */}
                        {error && <div role="alert" className="alert alert-error text-sm"><span>{error}</span></div>}

                        <div className="flex justify-end gap-4 mt-6">
                            <Link to="/dashboard" className="btn btn-ghost">Cancel</Link>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};