import { useState, useEffect, useRef } from 'react';

export default function useLikePhoto(initialLikes, onLikesChange) {
    const [isLiked, setIsLiked] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    const [currentLikes, setCurrentLikes] = useState(initialLikes);
    const timeoutRef = useRef(null);

    const handleLike = () => {
        if (!isLiked) {
            const newLikes = currentLikes + 1;
            setCurrentLikes(newLikes);
            onLikesChange(newLikes);
            setIsLiked(true);
            setShowHeart(true);
            timeoutRef.current = setTimeout(() => setShowHeart(false), 1000);
        }
    };

    const handleUnlike = () => {
        if (isLiked) {
            const newLikes = currentLikes - 1;
            setCurrentLikes(newLikes);
            onLikesChange(newLikes);
            setIsLiked(false);
        }
    };

    // Sync with parent when initialLikes changes
    useEffect(() => {
        setCurrentLikes(initialLikes);
    }, [initialLikes]);

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
