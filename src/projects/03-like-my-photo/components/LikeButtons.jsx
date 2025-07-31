import React from 'react';

export default function LikeButtons({ likes, setLikes }) {
    return (
        <>
            <button className="text-red-500 px-4 py-2 rounded-md" onClick={() => setLikes(likes + 1)}>❤️ {likes}</button>
        </>
    );
}