import React from 'react';
import Title from '../../components/Title';

export default function PhotoOverlay({ title, likes }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <Title
          title={{
            heading: 'h3',
            text: title,
            class: 'text-sm font-semibold mb-1 line-clamp-2 text-white',
          }}
        />
        <p className="text-xs text-gray-200">{likes} likes</p>
      </div>
    </div>
  );
}
