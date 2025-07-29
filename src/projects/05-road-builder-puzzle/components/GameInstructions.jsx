import React from 'react';
import Title from '../../../projects/components/Title';

const GameInstructions = () => {
  return (
    <div className="game-instructions">
      <Title title={{ heading: 'h3', text: 'How to Play:', class: '' }} />
      <ul>
        <li>Click tiles adjacent to the empty space to move them</li>
        <li>Arrange road tiles to create a connected path</li>
        <li>Click "Drive!" to test if your road works</li>
        <li>Get the F1 car (top-left) to connect to the checkered flag (bottom-right)</li>
        <li>Roads must connect properly to form a valid path</li>
      </ul>
    </div>
  );
};

export default GameInstructions;
