import React from 'react';

export default function PhotoImage({ photo }) {
  return (
    <>
      <img
        src={photo?.url || 'https://placehold.co/300x600'}
        alt={photo?.alt || 'Photo'}
        className="w-full h-auto object-cover"
      />
    </>
  );
}
