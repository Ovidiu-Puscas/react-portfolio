import React, { useState } from 'react';
import ColorWheel from './ColorWheel';
import Title from '../../components/Title';
import Description from '../../components/Description';

const ColorPicker = ({ selectedColor, onColorChange, onHarmonyChange, selectedHarmony = 'complementary' }) => {
  const [customHex, setCustomHex] = useState(selectedColor);

  // Update customHex when selectedColor changes
  React.useEffect(() => {
    setCustomHex(selectedColor);
  }, [selectedColor]);

  const handleHexChange = (e) => {
    const value = e.target.value;
    setCustomHex(value);
    if (value.match(/^#[0-9A-F]{6}$/i)) {
      onColorChange({ hex: value });
    }
  };

  const presetColors = [
    '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00', '#ADFF2F',
    '#00FF00', '#00FA9A', '#00FFFF', '#00BFFF', '#0000FF', '#8A2BE2',
    '#FF00FF', '#FF1493', '#FF69B4', '#FFC0CB', '#FFFFFF', '#808080',
    '#000000', '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F5DEB3'
  ];

  const harmonyOptions = [
    { value: 'complementary', label: 'Complementary' },
    { value: 'monochromatic', label: 'Monochromatic' },
    { value: 'analogous', label: 'Analogous' },
    { value: 'triadic', label: 'Triadic' },
    { value: 'tetradic', label: 'Tetradic' },
    { value: 'square', label: 'Square' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <Title title={{ heading: 'h2', text: 'Color Picker', class: 'text-xl font-semibold mb-6 text-gray-700' }} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Color Wheel and Harmony */}
        <div className="space-y-6">
          {/* Color Harmony Selector */}
          <div>
            <Title title={{ heading: 'h3', text: 'Color Harmony', class: 'text-lg font-medium text-gray-700 mb-3' }} />
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              {harmonyOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-100 transition-colors ${
                    selectedHarmony === option.value ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => onHarmonyChange(option.value)}
                >
                  <span className="text-gray-700">{option.label}</span>
                  {selectedHarmony === option.value && (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Wheel */}
          <div className="flex justify-center">
            <ColorWheel 
              selectedColor={selectedColor}
              onColorChange={onColorChange}
              size={220}
            />
          </div>
        </div>

        {/* Right Column - Preset Colors and Custom Hex */}
        <div className="space-y-6">
          {/* Custom Hex Input */}
          <div>
            <Title title={{ heading: 'h3', text: 'Custom Color', class: 'text-lg font-medium text-gray-700 mb-3' }} />
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div 
                className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: customHex }}
              ></div>
              <div className="flex-1">
                <input
                  type="text"
                  value={customHex}
                  onChange={handleHexChange}
                  placeholder="#FF0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                <Description description={{ text: 'Enter a valid hex color code', class: 'text-xs text-gray-500 mt-1' }} />
              </div>
            </div>
          </div>

          {/* Preset Colors */}
          <div>
            <Title title={{ heading: 'h3', text: 'Quick Colors', class: 'text-lg font-medium text-gray-700 mb-3' }} />
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:scale-105 transition-all duration-200 shadow-sm"
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange({ hex: color })}
                  title={color}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker; 