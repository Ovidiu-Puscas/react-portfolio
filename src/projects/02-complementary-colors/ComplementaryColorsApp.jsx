import React, { useState } from 'react';
import ColorPicker from './components/ColorPicker';
import HarmonyDisplay from './components/HarmonyDisplay';
import { calculateHarmony } from './utils/colorUtils';
import SEO from '../../components/SEO';

const ComplementaryColorsApp = () => {
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  const [selectedHarmony, setSelectedHarmony] = useState('complementary');
  const [harmonyColors, setHarmonyColors] = useState(['#ff0000', '#00ffff']);

  // Handle color change
  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    updateHarmonyColors(color.hex, selectedHarmony);
  };

  // Handle harmony change
  const handleHarmonyChange = (harmonyType) => {
    setSelectedHarmony(harmonyType);
    updateHarmonyColors(selectedColor, harmonyType);
  };

  // Update harmony colors
  const updateHarmonyColors = (color, harmonyType) => {
    const colors = calculateHarmony(color, harmonyType);
    setHarmonyColors(colors);
  };

  return (
    <>
      <SEO
        title="Complementary Colors Tool - Color Harmony Generator"
        description="Explore color harmonies with our interactive complementary colors tool. Generate complementary, monochromatic, analogous, triadic, and tetradic color schemes."
        keywords="color harmony, complementary colors, color theory, color wheel, color schemes, design tools"
        type="website"
        author="Ovidiu Alexandru Pușcaș"
      />

      <div className="bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Color Picker Section */}
            <div className="space-y-6">
              <ColorPicker
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
                onHarmonyChange={handleHarmonyChange}
                selectedHarmony={selectedHarmony}
              />
            </div>

            {/* Harmony Display Section */}
            <div className="space-y-6">
              <HarmonyDisplay
                colors={harmonyColors}
                harmonyType={selectedHarmony}
                selectedColor={selectedColor}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplementaryColorsApp;
