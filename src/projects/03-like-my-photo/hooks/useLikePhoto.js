import { useState, useEffect, useRef } from 'react';

export default function useLikePhoto(initialLikes, onLikesChange) {
    const [isLiked, setIsLiked] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    const timeoutRef = useRef(null);

    const handleLike = () => {
        if (!isLiked) {
            onLikesChange((currentLikes) => currentLikes + 1);
            setIsLiked(true);
            setShowHeart(true);
            timeoutRef.current = setTimeout(() => setShowHeart(false), 1000);
        }
    };

    const handleUnlike = () => {
        if (isLiked) {
            onLikesChange((currentLikes) => currentLikes - 1);
            setIsLiked(false);
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        isLiked,
        showHeart,
        handleLike,
        handleUnlike
    };
}
