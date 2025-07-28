import React from 'react';

const ColorCombination = ({ primaryColor, complementaryColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
        Color Combination Preview
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div 
            className="w-full h-32 rounded-lg mb-2 shadow-md"
            style={{ backgroundColor: primaryColor }}
          ></div>
          <p className="text-sm text-gray-600">Selected Color</p>
        </div>
        <div className="text-center">
          <div 
            className="w-full h-32 rounded-lg mb-2 shadow-md"
            style={{ backgroundColor: complementaryColor }}
          ></div>
          <p className="text-sm text-gray-600">Complementary Color</p>
        </div>
      </div>
    </div>
  );
};

export default ColorCombination; 