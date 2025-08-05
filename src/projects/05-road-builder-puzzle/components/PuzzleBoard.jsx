import React from 'react';
import PuzzleTile from './PuzzleTile';

const PuzzleBoard = ({ gameBoard, onTileClick, canMoveTile, gameState }) => (
  <div className="puzzle-board">
    {gameBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="puzzle-row">
        {row.map((tile, colIndex) => (
          <PuzzleTile
            key={`${rowIndex}-${colIndex}`}
            tile={tile}
            rowIndex={rowIndex}
            colIndex={colIndex}
            onTileClick={onTileClick}
            canMoveTile={canMoveTile}
            gameState={gameState}
          />
        ))}
      </div>
    ))}
  </div>
);

export default PuzzleBoard;
