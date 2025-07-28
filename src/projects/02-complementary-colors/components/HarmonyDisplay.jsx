import React from 'react';

const HarmonyDisplay = ({ colors, harmonyType, selectedColor }) => {
  const getHarmonyLabel = (type) => {
    switch (type) {
      case 'complementary': return 'Complementary';
      case 'monochromatic': return 'Monochromatic';
      case 'analogous': return 'Analogous';
      case 'triadic': return 'Triadic';
      case 'tetradic': return 'Tetradic';
      default: return 'Color Harmony';
    }
  };

  const getHarmonyDescription = (type) => {
    switch (type) {
      case 'complementary': return 'Two colors opposite each other on the color wheel';
      case 'monochromatic': return 'Different shades and tints of the same color';
      case 'analogous': return 'Colors that are next to each other on the color wheel';
      case 'triadic': return 'Three colors equally spaced around the color wheel';
      case 'tetradic': return 'Four colors forming a rectangle on the color wheel';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-700">
        {getHarmonyLabel(harmonyType)} Colors
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {getHarmonyDescription(harmonyType)}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <div key={index} className="text-center">
            <div 
              className="w-full h-20 rounded-lg mb-2 shadow-md border-2 border-gray-200"
              style={{ backgroundColor: color }}
            ></div>
            <p className="text-xs text-gray-600 mb-1">
              {index === 0 ? 'Base Color' : `Color ${index + 1}`}
            </p>
            <p className="font-mono text-xs text-gray-700">{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HarmonyDisplay; 