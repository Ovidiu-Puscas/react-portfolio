import React, { useState, useEffect } from 'react';
import f1Car from './assets/f1.png';
import explosion from './assets/explosion.gif';
import roadTopEndBottom from './assets/roadsTopEndBottom.jpg';
import roadHorizontalStraight from './assets/roadsHorizontalStraight.jpg';
import roadVerticalStraight from './assets/roadsVerticalStraight.jpg';
import roadTopTurnRight from './assets/roadsTopTurnRight.jpg';
import roadLeftTurnTop from './assets/roadsLeftTurnTop.jpg';
import roadLeftTurnBottom from './assets/roadsLeftTurnBottom.jpg';
import roadBottomTurnRight from './assets/roadsBottomTurnRight.jpg';
import roadRightEndLeft from './assets/roadsRightEndLeft.jpg';
import roadLeftEndRight from './assets/roadsLeftEndRight.jpg';
import roadBottomTopEnd from './assets/roadsBottomTopEnd.jpg';
import roadConnectionsData from './assets/road_tile_connections_with_sides.json';
import './RoadBuilderPuzzleApp.css';

// Global Components
import SEO from '../../components/SEO';

// Project Components
import Title from '../components/Title';
import Description from '../components/Description';
import GameStats from '../components/GameStats';

// App-specific Components
import PuzzleBoard from './components/PuzzleBoard';
import ConnectionEditor from './components/ConnectionEditor';
import AnimationOverlay from './components/AnimationOverlay';
import GameOverlay from './components/GameOverlay';
import GameInstructions from './components/GameInstructions';

const RoadBuilderPuzzleApp = () => {
  const [gameBoard, setGameBoard] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'testing', 'failed', 'editor'
  const [moves, setMoves] = useState(0);
  const [emptyPosition, setEmptyPosition] = useState({ row: 3, col: 3 });
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState(''); // 'explosion', 'confetti'
  const [editorMode, setEditorMode] = useState(false);
  const [selectedTileType, setSelectedTileType] = useState(Object.keys(roadConnectionsData)[0] || '');
  const [editableConnections, setEditableConnections] = useState(roadConnectionsData);

  // Create puzzle tiles
  const puzzleTiles = [
    { id: 1, image: roadBottomTopEnd, type: 'road', roadType: 'roadsBottomTopEnd' },
    { id: 2, image: roadHorizontalStraight, type: 'road', roadType: 'roadsHorizontalStraight' },
    { id: 3, image: roadVerticalStraight, type: 'road', roadType: 'roadsVerticalStraight' },
    { id: 4, image: roadTopTurnRight, type: 'road', roadType: 'roadsTopTurnRight' },
    { id: 5, image: roadLeftTurnTop, type: 'road', roadType: 'roadsTopTurnLeft' },
    { id: 6, image: roadLeftTurnBottom, type: 'road', roadType: 'roadsRightTurnRight' },
    { id: 7, image: roadBottomTurnRight, type: 'road', roadType: 'roadsRightTurnLeft' },
    { id: 8, image: roadLeftEndRight, type: 'road', roadType: 'roadsLeftEndRight' },
    { id: 9, image: roadTopEndBottom, type: 'road', roadType: 'roadsTopEndBottom' },
    { id: 10, image: roadHorizontalStraight, type: 'road', roadType: 'roadsHorizontalStraight' },
    { id: 11, image: roadVerticalStraight, type: 'road', roadType: 'roadsVerticalStraight' },
    { id: 12, image: roadTopTurnRight, type: 'road', roadType: 'roadsTopTurnRight' },
    { id: 13, image: roadLeftTurnTop, type: 'road', roadType: 'roadsTopTurnLeft' },
    { id: 14, image: roadLeftTurnBottom, type: 'road', roadType: 'roadsRightTurnRight' },
    { id: 15, image: roadRightEndLeft, type: 'road', roadType: 'roadsRightEndLeft' }
  ];

  // Use the imported road connections data
  const roadConnections = roadConnectionsData;

  // Initialize game board
  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeGame = () => {
    const boardSize = 4;
    const board = [];

    // Shuffle the tiles
    const shuffledTiles = [...puzzleTiles];
    for (let i = shuffledTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTiles[i], shuffledTiles[j]] = [shuffledTiles[j], shuffledTiles[i]];
    }

    // Build board with shuffled tiles, leaving one empty space
    let tileIndex = 0;
    for (let i = 0; i < boardSize; i++) {
      board[i] = [];
      for (let j = 0; j < boardSize; j++) {
        if (tileIndex < shuffledTiles.length) {
          // Place shuffled tiles
          const tile = shuffledTiles[tileIndex];
          board[i][j] = { ...tile, row: i, col: j };
          tileIndex++;
        } else {
          // One empty space (initially at bottom-right but can move)
          board[i][j] = { id: 0, image: null, type: 'empty', roadType: null, row: i, col: j };
          setEmptyPosition({ row: i, col: j });
        }
      }
    }

    // Ensure car starts on a valid start tile (randomly chosen)
    const validStartTiles = ['roadsBottomTopEnd', 'roadsRightEndLeft'];
    const randomStartTileType = validStartTiles[Math.floor(Math.random() * validStartTiles.length)];

    // Find the corresponding tile data and image
    const startTileData = puzzleTiles.find(tile => tile.roadType === randomStartTileType);
    board[0][0] = {
      ...startTileData,
      row: 0,
      col: 0
    };

    setGameBoard(board);
    setGameState('playing');
    setMoves(0);
  };

  const canMoveTile = (row, col) => {
    // Any tile adjacent to empty space can move
    const { row: emptyRow, col: emptyCol } = emptyPosition;
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const handleTileClick = (row, col) => {
    if (gameState !== 'playing') return;

    // Any tile can be clicked if it's movable
    if (canMoveTile(row, col)) {
      const newBoard = [...gameBoard];
      const { row: emptyRow, col: emptyCol } = emptyPosition;

      // Swap tile with empty space
      [newBoard[row][col], newBoard[emptyRow][emptyCol]] =
        [newBoard[emptyRow][emptyCol], newBoard[row][col]];

      // Update positions
      newBoard[row][col].row = row;
      newBoard[row][col].col = col;
      newBoard[emptyRow][emptyCol].row = emptyRow;
      newBoard[emptyRow][emptyCol].col = emptyCol;

      setGameBoard(newBoard);
      setEmptyPosition({ row, col });
      setMoves(moves + 1);

      // Check if path is complete
      if (checkWinCondition(newBoard)) {
        setGameState('won');
      }
    }
  };

  const checkWinCondition = (board) => {
    // Check if there's a connected path from car (top-left) to finish (bottom-right)
    const carPosition = { row: 0, col: 0 };
    const flagPosition = { row: 3, col: 3 };

    // First, validate that the car position has an appropriate start tile
    const carTile = board[carPosition.row][carPosition.col];
    const validStartTiles = ['roadsBottomTopEnd', 'roadsRightEndLeft'];

    if (!carTile.roadType || !validStartTiles.includes(carTile.roadType)) {
      return false; // Car position must have a start tile
    }

    // Second, validate that the flag position has an appropriate end tile
    const flagTile = board[flagPosition.row][flagPosition.col];
    const validEndTiles = ['roadsBottomTopEnd', 'roadsLeftEndRight', 'roadsTopEndBottom', 'roadsRightEndLeft'];

    if (!flagTile.roadType || !validEndTiles.includes(flagTile.roadType)) {
      return false; // Flag position must have an end tile
    }

    return checkPathExists(board, carPosition, flagPosition);
  };

  const checkPathExists = (board, start, end) => {
    const visited = new Set();
    const queue = [start];
    visited.add(`${start.row},${start.col}`);

    while (queue.length > 0) {
      const current = queue.shift();

      if (current.row === end.row && current.col === end.col) {
        return true;
      }

      // Check all adjacent positions
      const directions = [
        { row: -1, col: 0 }, // up
        { row: 1, col: 0 },  // down
        { row: 0, col: -1 }, // left
        { row: 0, col: 1 }   // right
      ];

      for (const dir of directions) {
        const newRow = current.row + dir.row;
        const newCol = current.col + dir.col;

        if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
          const key = `${newRow},${newCol}`;
          if (!visited.has(key)) {
            // For finish position (empty space), check if current tile can connect to it
            if (newRow === end.row && newCol === end.col) {
              // Check if the current road tile has a connection in the direction of the finish
              const currentTile = board[current.row][current.col];
              if (currentTile.roadType) {
                const connections = roadConnections[currentTile.roadType];
                let requiredSide;

                // Determine which side of current tile should connect to finish
                if (dir.row === -1) requiredSide = 'top';
                else if (dir.row === 1) requiredSide = 'bottom';
                else if (dir.col === -1) requiredSide = 'left';
                else if (dir.col === 1) requiredSide = 'right';

                // Check if current tile has any connections on the required side
                if (connections[requiredSide] && connections[requiredSide].length > 0) {
                  visited.add(key);
                  queue.push({ row: newRow, col: newCol });
                }
              }
            } else if (board[newRow][newCol].type !== 'empty') {
              // Check if roads connect properly
              if (roadsConnect(board, current, { row: newRow, col: newCol }, dir)) {
                visited.add(key);
                queue.push({ row: newRow, col: newCol });
              }
            }
          }
        }
      }
    }

    return false;
  };

  const roadsConnect = (board, from, to, direction) => {
    const fromTile = board[from.row][from.col];
    const toTile = board[to.row][to.col];

    if (!fromTile.roadType || !toTile.roadType) return false;

    const fromConnections = roadConnections[fromTile.roadType];
    const toConnections = roadConnections[toTile.roadType];

    // Determine which sides should connect based on direction
    let fromSide, toSide;
    if (direction.row === -1) { // up
      fromSide = 'top';
      toSide = 'bottom';
    } else if (direction.row === 1) { // down
      fromSide = 'bottom';
      toSide = 'top';
    } else if (direction.col === -1) { // left
      fromSide = 'left';
      toSide = 'right';
    } else if (direction.col === 1) { // right
      fromSide = 'right';
      toSide = 'left';
    }

    // Check if the roads can connect
    return fromConnections[fromSide]?.includes(toTile.roadType) &&
      toConnections[toSide]?.includes(fromTile.roadType);
  };

  const testRoad = () => {
    setGameState('testing');
    setShowAnimation(true);

    const carPosition = { row: 0, col: 0 };
    const flagPosition = { row: 3, col: 3 };

    // Validate that the car position has an appropriate start tile
    const carTile = gameBoard[carPosition.row][carPosition.col];
    const validStartTiles = ['roadsBottomTopEnd', 'roadsRightEndLeft'];

    if (!carTile.roadType || !validStartTiles.includes(carTile.roadType)) {
      // Invalid start tile - show explosion
      setTimeout(() => {
        setAnimationType('explosion');
        setTimeout(() => {
          setGameState('failed');
          setTimeout(() => {
            setGameState('playing');
            setShowAnimation(false);
          }, 1500);
        }, 1000);
      }, 500);
      return;
    }

    // Validate that the flag position has an appropriate end tile
    const flagTile = gameBoard[flagPosition.row][flagPosition.col];
    const validEndTiles = ['roadsBottomTopEnd', 'roadsLeftEndRight', 'roadsTopEndBottom', 'roadsRightEndLeft'];

    if (!flagTile.roadType || !validEndTiles.includes(flagTile.roadType)) {
      // Invalid end tile - show explosion
      setTimeout(() => {
        setAnimationType('explosion');
        setTimeout(() => {
          setGameState('failed');
          setTimeout(() => {
            setGameState('playing');
            setShowAnimation(false);
          }, 1500);
        }, 1000);
      }, 500);
      return;
    }

    // Check if there's a valid path
    const hasValidPath = checkPathExists(gameBoard, carPosition, flagPosition);

    // Simulate driving animation
    setTimeout(() => {
      if (hasValidPath) {
        // Success - show confetti and victory
        setAnimationType('confetti');
        setTimeout(() => {
          setGameState('won');
          setShowAnimation(false);
        }, 2000);
      } else {
        // Failure - show explosion
        setAnimationType('explosion');
        setTimeout(() => {
          setGameState('failed');
          setTimeout(() => {
            setGameState('playing');
            setShowAnimation(false);
          }, 1500);
        }, 1000);
      }
    }, 500);
  };

  const toggleConnectionEditor = () => {
    setEditorMode(!editorMode);
    setGameState(editorMode ? 'playing' : 'editor');
  };

  const exportConnections = () => {
    const jsonString = JSON.stringify(editableConnections, null, 2);

    // Create downloadable file
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'road_tile_connections.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleConnection = (fromTile, side, toTile) => {
    setEditableConnections(prev => {
      // Create deep copy to ensure React detects the change
      const newConnections = JSON.parse(JSON.stringify(prev));

      // Ensure the tile exists
      if (!newConnections[fromTile]) {
        return prev;
      }

      // Ensure the side exists
      if (!newConnections[fromTile][side]) {
        return prev;
      }

      const sideConnections = newConnections[fromTile][side];
      const connectionIndex = sideConnections.indexOf(toTile);

      if (connectionIndex !== -1) {
        // Remove connection
        newConnections[fromTile][side] = sideConnections.filter(tile => tile !== toTile);
      } else {
        // Add connection
        newConnections[fromTile][side] = [...sideConnections, toTile];
      }

      return newConnections;
    });
  };

  const resetConnections = () => {
    setEditableConnections(roadConnectionsData);
  };

  const getAllTileTypes = () => {
    return Object.keys(editableConnections);
  };

  const getTileImage = (tileType) => {
    const imageMap = {
      roadsBottomTopEnd: roadBottomTopEnd,
      roadsHorizontalStraight: roadHorizontalStraight,
      roadsVerticalStraight: roadVerticalStraight,
      roadsTopTurnRight: roadTopTurnRight,
      roadsLeftTurnTop: roadLeftTurnTop,
      roadsLeftTurnBottom: roadLeftTurnBottom,
      roadsBottomTurnRight: roadBottomTurnRight,
      roadsRightEndLeft: roadRightEndLeft,
      roadsLeftEndRight: roadLeftEndRight,
      roadsTopEndBottom: roadTopEndBottom,
      roadsTopTurnLeft: roadLeftTurnTop,
      roadsRightTurnRight: roadLeftTurnBottom,
      roadsRightTurnLeft: roadBottomTurnRight
    };
    return imageMap[tileType];
  };

  // Prepare stats and buttons for GameStats component
  const gameStatsData = {
    stats: [
      { label: 'Moves', value: moves }
    ],
    buttons: [
      {
        text: 'Drive!',
        icon: '🏎️',
        onClick: testRoad,
        disabled: gameState !== 'playing',
        variant: 'primary'
      },
      {
        text: editorMode ? 'Game Mode' : 'Editor Mode',
        icon: editorMode ? '🎮' : '🔧',
        onClick: toggleConnectionEditor,
        variant: 'secondary'
      },
      {
        text: 'New Game',
        onClick: initializeGame,
        variant: 'warning'
      }
    ]
  };

  return (
    <div className="road-builder-container">
      <SEO
        title="Road Builder Puzzle - React Portfolio"
        description="Slide tiles to create a road path for the car to reach the checkered flag in this interactive puzzle game!"
        keywords="puzzle game, road builder, sliding puzzle, react game, interactive"
      />

      <div className="game-header">
        <Title title={{ heading: 'h2', text: 'Road Builder Puzzle', class: 'text-white' }} />
        <Description description={{
          text: 'Slide tiles to create a road path for the car to reach the checkered flag!',
          class: ''
        }} />
        <GameStats
          stats={gameStatsData.stats}
          buttons={gameStatsData.buttons}
          className="game-stats"
        />
      </div>

      {/* Visual Connection Editor */}
      {editorMode && (
        <ConnectionEditor
          selectedTileType={selectedTileType}
          setSelectedTileType={setSelectedTileType}
          editableConnections={editableConnections}
          toggleConnection={toggleConnection}
          exportConnections={exportConnections}
          resetConnections={resetConnections}
          getTileImage={getTileImage}
          getAllTileTypes={getAllTileTypes}
        />
      )}

      {!editorMode && (
        <PuzzleBoard
          gameBoard={gameBoard}
          onTileClick={handleTileClick}
          canMoveTile={canMoveTile}
          gameState={gameState}
        />
      )}

      {/* Animation Overlay */}
      <AnimationOverlay
        showAnimation={showAnimation}
        animationType={animationType}
      />

      {/* Game Victory Overlay */}
      <GameOverlay
        gameState={gameState}
        moves={moves}
        onNewGame={initializeGame}
      />

      {/* Game Instructions */}
      <GameInstructions />
    </div>
  );
};

export default RoadBuilderPuzzleApp;
