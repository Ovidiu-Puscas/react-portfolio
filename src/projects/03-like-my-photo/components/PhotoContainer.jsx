import React from 'react';
import PhotoImage from './PhotoImage';
import HeartAnimation from './HeartAnimation';
import LikeIndicator from './LikeIndicator';

export default function PhotoContainer({ photo, isLiked, showHeart, onDoubleClick, onUnlike }) {
  return (
    <div onDoubleClick={onDoubleClick} className="relative">
      <PhotoImage photo={photo} />

      <HeartAnimation show={showHeart} />
      <LikeIndicator isLiked={isLiked} onUnlike={onUnlike} />
    </div>
  );
}
