import React from 'react';

const ColorPreview = ({ color, label, size = 'w-48 h-48' }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div 
          className={`${size} rounded-full border-4 border-gray-300 shadow-lg`}
          style={{ backgroundColor: color }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{label}:</p>
      <span className="font-mono text-lg">{color}</span>
    </div>
  );
};

export default ColorPreview; 