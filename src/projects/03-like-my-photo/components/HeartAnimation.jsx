import React from 'react';

export default function HeartAnimation({ show }) {
    if (!show) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-red-500 text-4xl animate-ping">
                ❤️
            </div>
        </div>
    );
} 