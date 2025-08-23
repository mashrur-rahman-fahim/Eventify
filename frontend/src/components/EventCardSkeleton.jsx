import React from 'react';

export const EventCardSkeleton = () => {
  return (
    <div className="card w-full bg-base-100 shadow-xl border border-transparent">
        {/* Skeleton for the image */}
        <div className="skeleton h-56 w-full"></div>

        <div className="card-body p-6">
            {/* Skeleton for badge and date */}
            <div className="flex justify-between items-center">
                <div className="skeleton h-5 w-24 rounded-full"></div>
                <div className="skeleton h-4 w-32"></div>
            </div>

            {/* Skeleton for the title */}
            <div className="skeleton h-7 w-3/4 mt-2"></div>
            
            {/* Skeleton for time and location info */}
            <div className="skeleton h-4 w-1/2 mt-2"></div>
            <div className="skeleton h-4 w-2/3"></div>

            {/* Skeleton for the button */}
            <div className="card-actions justify-end mt-4">
                <div className="skeleton h-12 w-32"></div>
            </div>
        </div>
    </div>
  );
};