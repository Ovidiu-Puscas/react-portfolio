import React from 'react';
import PhotoContainer from './PhotoContainer';
import PhotoOverlay from './PhotoOverlay';
import useLikePhoto from '../hooks/useLikePhoto';

export default function PhotoCard({ title, url, alt, likes, setLikes }) {
    const { isLiked, showHeart, handleLike, handleUnlike } = useLikePhoto(likes, setLikes);

    const handleDoubleClick = (e) => {
        e.preventDefault();
        handleLike();
    };

    const handleUnlikeClick = (e) => {
        e.stopPropagation();
        handleUnlike();
    };

    return (
        <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 select-none">
            <PhotoContainer 
                photo={{ url, alt }}
                isLiked={isLiked}
                showHeart={showHeart}
                onDoubleClick={handleDoubleClick}
                onUnlike={handleUnlikeClick}
            />
            
            <PhotoOverlay title={title} likes={likes} />
        </div>
    );
}