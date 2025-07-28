import { useState } from 'react';

export default function useLikePhoto(initialLikes, onLikesChange) {
    const [isLiked, setIsLiked] = useState(false);
    const [showHeart, setShowHeart] = useState(false);

    const handleLike = () => {
        if (!isLiked) {
            onLikesChange(initialLikes + 1);
            setIsLiked(true);
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 1000);
        }
    };

    const handleUnlike = () => {
        if (isLiked) {
            onLikesChange(initialLikes - 1);
            setIsLiked(false);
        }
    };

    return {
        isLiked,
        showHeart,
        handleLike,
        handleUnlike
    };
} 