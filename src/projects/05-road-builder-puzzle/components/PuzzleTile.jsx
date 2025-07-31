import React from 'react';
import f1Car from '../assets/f1.png';

const PuzzleTile = ({
  tile,
  rowIndex,
  colIndex,
  onTileClick,
  canMoveTile,
  gameState
}) => {
  const getTileStyle = (tile) => {
    if (tile.type === 'empty') return {};

    return {
      backgroundImage: `url(${tile.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      imageRendering: 'pixelated'
    };
  };

  return (
    <div
      className={`
        puzzle-tile
        ${tile.type === 'empty' ? 'empty' : 'filled'}
        ${canMoveTile(rowIndex, colIndex) && gameState === 'playing' ? 'movable' : ''}
      `}
      onClick={() => onTileClick(rowIndex, colIndex)}
      style={getTileStyle(tile)}
    >
      {/* Static checkered flag background for finish position */}
      {rowIndex === 3 && colIndex === 3 && (
        <div className="flag-marker">🏁</div>
      )}

      {/* F1 car only shows on top-left position */}
      {rowIndex === 0 && colIndex === 0 && (
        <div className="car-overlay">
          <img
            src={f1Car}
            alt="F1 Car"
            className={`car-image ${tile.roadType === 'roadsRightEndLeft' ? 'car-rotated' : ''}`}
          />
        </div>
      )}
    </div>
  );
};

export default PuzzleTile;
