import React from 'react';
import PhotoCard from './PhotoCard';

export default function PhotoGrid({ photos, onLikesChange }) {
    return (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 mt-6 space-y-4">
            {photos.map(photo => (
                <div key={photo.id} className="break-inside-avoid mb-4">
                    <PhotoCard
                        title={photo.title}
                        url={photo.url}
                        alt={photo.alt}
                        likes={photo.likes}
                        setLikes={(newLikes) => onLikesChange(photo.id, newLikes)}
                    />
                </div>
            ))}
        </div>
    );
} 