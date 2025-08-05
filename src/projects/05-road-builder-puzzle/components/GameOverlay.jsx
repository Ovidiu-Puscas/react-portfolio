import React from 'react';
import Button from '../../components/Button';

const GameOverlay = ({ gameState, moves, onNewGame }) => {
  if (gameState !== 'won') return null;

  return (
    <div className="game-overlay won">
      <h2>🏆 Victory!</h2>
      <p>You built a perfect road in {moves} moves!</p>
      <div className="victory-stats">
        <div className="stat">
          <span className="stat-label">Total Moves:</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Status:</span>
          <span className="stat-value">Road Complete!</span>
        </div>
      </div>
      <Button onClick={onNewGame} variant="primary" size="large">
        Play Again
      </Button>
    </div>
  );
};

export default GameOverlay;
