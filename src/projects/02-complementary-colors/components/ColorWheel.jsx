import React from 'react';
import Wheel from '@uiw/react-color-wheel';

const ColorWheel = ({ selectedColor, onColorChange, size = 300 }) => {
  // Custom pointer component with bigger border and darker color
  const CustomPointer = ({ color, style }) => {
    return (
      <div style={style}>
        <div
          style={{
            width: 20,
            height: 20,
            transform: 'translate(-10px, -10px)',
            backgroundColor: color,
            border: '4px solid #ffffff',
            borderRadius: '50%',
            boxShadow: '0 0 0 2px #000000, 0 0 0 4px #ffffff',
            position: 'relative',
          }}
        >
          {/* Inner circle with darker color for better contrast */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '8px',
              height: '8px',
              backgroundColor: color,
              borderRadius: '50%',
              border: '2px solid #ffffff',
              boxShadow: '0 0 0 1px #000000',
              filter: 'brightness(0.7) contrast(1.2)',
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      <Wheel
        color={selectedColor}
        onChange={onColorChange}
        width={size}
        height={size}
        pointer={CustomPointer}
      />
    </div>
  );
};

export default ColorWheel; 