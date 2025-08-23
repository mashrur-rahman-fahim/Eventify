import React from 'react';
import { Link } from 'react-router-dom';

export const ClubCard = ({ club, onLeave, onDelete }) => {
    return (
        <div className="card bg-base-100 shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="card-body p-4">
                <Link to={`/club/${club._id}`} className="flex-grow">
                    <h3 className="card-title text-lg">{club.name}</h3>
                    <p className="text-sm text-base-content/60">Click to view details</p>
                </Link>


                <div className="card-actions justify-end mt-2 border-t border-base-200 pt-3">
                    <button onClick={() => onLeave(club._id)} className="btn btn-xs btn-outline btn-warning">Leave</button>
                    <Link to={`/club/edit/${club._id}`} className="btn btn-xs btn-outline btn-info">Edit</Link>
                    <button onClick={() => onDelete(club._id)} className="btn btn-xs btn-outline btn-error">Delete</button>
                </div>
            </div>
        </div>
    );
};