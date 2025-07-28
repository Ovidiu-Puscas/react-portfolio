import React from 'react';

export default function LikeIndicator({ isLiked, onUnlike }) {
    if (!isLiked) return null;

    return (
        <div 
            className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-md hover:bg-white transition-colors duration-200 cursor-pointer"
            onClick={onUnlike}
        >
            <div className="text-red-500 text-lg">❤️</div>
        </div>
    );
} 