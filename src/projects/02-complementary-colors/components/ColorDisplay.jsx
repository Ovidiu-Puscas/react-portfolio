import React from 'react';

const ColorDisplay = ({ color, label, size = 'w-12 h-12', showHex = true }) => {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-2">{label}:</p>
      <div className="flex items-center justify-center gap-4">
        <div 
          className={`${size} rounded-lg border-2 border-gray-300 shadow-sm`}
          style={{ backgroundColor: color }}
        ></div>
        {showHex && <span className="font-mono text-lg">{color}</span>}
      </div>
    </div>
  );
};

export default ColorDisplay; 