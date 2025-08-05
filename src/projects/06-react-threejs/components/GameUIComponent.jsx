import React, { useState, useEffect, useCallback } from 'react';
import { CHALLENGE_CONFIG } from '../config/settings.js';
import './GameUIComponent.css';

const GameUIComponent = ({ shapeChallenge, paintingSystem, isVisible = true }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: 'info', visible: false });
  const [challenges, setChallenges] = useState([]);

  // Define showFeedback first to avoid circular dependencies
  const showFeedback = useCallback((message, type = 'info') => {
    setFeedback({ message, type, visible: true });
    // Hide after 3 seconds
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  // Update state from game systems
  useEffect(() => {
    if (!shapeChallenge) return;

    const updateGameState = () => {
      setScore(shapeChallenge.getScore());
      setLevel(shapeChallenge.getLevel());
      setCurrentChallenge(shapeChallenge.getCurrentChallenge());
      setChallenges(shapeChallenge.getAvailableChallenges() || []);
    };

    // Initial update
    updateGameState();

    // Set up event listeners for game state changes
    const handleScoreChange = () => setScore(shapeChallenge.getScore());
    const handleLevelChange = () => setLevel(shapeChallenge.getLevel());
    const handleChallengeChange = () => {
      setCurrentChallenge(shapeChallenge.getCurrentChallenge());
      setChallenges(shapeChallenge.getAvailableChallenges() || []);
    };

    // Add event listeners if the shapeChallenge supports them
    if (shapeChallenge.addEventListener) {
      shapeChallenge.addEventListener('scoreChange', handleScoreChange);
      shapeChallenge.addEventListener('levelChange', handleLevelChange);
      shapeChallenge.addEventListener('challengeChange', handleChallengeChange);
    } else {
      // Fallback to polling if event system not available
      const interval = setInterval(updateGameState, 100);
      return () => clearInterval(interval);
    }

    // Cleanup event listeners
    return () => {
      if (shapeChallenge.removeEventListener) {
        shapeChallenge.removeEventListener('scoreChange', handleScoreChange);
        shapeChallenge.removeEventListener('levelChange', handleLevelChange);
        shapeChallenge.removeEventListener('challengeChange', handleChallengeChange);
      }
    };
  }, [shapeChallenge]);

  const startChallenge = useCallback(
    (shapeId) => {
      if (!shapeChallenge) return;

      const challenge = shapeChallenge.startChallenge(shapeId);
      if (challenge) {
        setCurrentChallenge(challenge);

        // Get current config to check if using custom coordinates
        const config = shapeChallenge.getChallengeConfig();
        const isCustomCoordinates =
          Math.abs(config.centerX - CHALLENGE_CONFIG.defaultCenterX) > CHALLENGE_CONFIG.tolerance ||
          Math.abs(config.centerY - CHALLENGE_CONFIG.defaultCenterY) > CHALLENGE_CONFIG.tolerance;

        // Show target shape immediately if using custom coordinates, otherwise with delay
        if (isCustomCoordinates) {
          console.log('Using custom coordinates, showing target immediately');
          shapeChallenge.showTargetDrawing(paintingSystem);
        } else {
          // Show target shape on the mesh for memorization with delay
          setTimeout(() => {
            shapeChallenge.showTargetDrawing(paintingSystem);
          }, 500);
        }

        showFeedback(
          `Started ${challenge.name} challenge! Watch the dots, then replicate!`,
          'info'
        );
      }
    },
    [shapeChallenge, paintingSystem, showFeedback]
  );

  const finishDrawing = useCallback(() => {
    if (!shapeChallenge) return;

    const result = shapeChallenge.finishDrawing();

    if (result.score > 0) {
      // Calculate dot connection accuracy for detailed feedback
      const dotConnectionScore = shapeChallenge.getDotConnectionAccuracy();
      const dotConnectionPercentage = Math.round(dotConnectionScore * 100);

      // Get detailed dot connection information
      const dotDetails = shapeChallenge.getDotConnectionDetails();

      let feedbackMessage = `${result.message}\nOverall Accuracy: ${Math.round(result.accuracy * 100)}%\nDots Connected: ${dotConnectionPercentage}% (${dotDetails.connected}/${dotDetails.total})\nPoints: +${result.score}`;

      // Add more detailed feedback for low accuracy
      if (dotConnectionPercentage < 50) {
        feedbackMessage += '\n💡 Tip: Try to connect more of the target dots!';
      } else if (dotConnectionPercentage < 80) {
        feedbackMessage += '\n💡 Good progress! Connect a few more dots for better score!';
      }

      showFeedback(feedbackMessage, result.accuracy >= 0.7 ? 'success' : 'warning');
    } else {
      showFeedback(result.message, 'error');
    }

    setScore(shapeChallenge.getScore());
  }, [shapeChallenge, showFeedback]);

  const showDotConnectionAnalysis = useCallback(() => {
    if (!shapeChallenge) return;

    if (!shapeChallenge.currentChallenge) {
      showFeedback('No active challenge to analyze!', 'error');
      return;
    }

    const dotDetails = shapeChallenge.getDotConnectionDetails();
    if (dotDetails.total === 0) {
      showFeedback('No drawing data to analyze!', 'error');
      return;
    }

    const connectedDots = dotDetails.details.filter((d) => d.connected).map((d) => d.index + 1);
    const missedDots = dotDetails.details.filter((d) => !d.connected).map((d) => d.index + 1);

    let analysisMessage = `Dot Connection Analysis:\nConnected: ${dotDetails.connected}/${dotDetails.total} (${Math.round(dotDetails.percentage * 100)}%)`;

    if (connectedDots.length > 0) {
      analysisMessage += `\n✅ Connected dots: ${connectedDots.slice(0, 10).join(', ')}${connectedDots.length > 10 ? '...' : ''}`;
    }

    if (missedDots.length > 0) {
      analysisMessage += `\n❌ Missed dots: ${missedDots.slice(0, 10).join(', ')}${missedDots.length > 10 ? '...' : ''}`;
    }

    showFeedback(analysisMessage, 'info');
  }, [shapeChallenge, showFeedback]);

  const resetCanvas = useCallback(() => {
    if (!shapeChallenge || !paintingSystem) return;

    shapeChallenge.reset();
    paintingSystem.clearCanvas();
    // Clear target shape if in always-show mode
    shapeChallenge.clearTargetShape(paintingSystem);
    setCurrentChallenge(null);
    showFeedback('Canvas reset! Start a new challenge.', 'info');
  }, [shapeChallenge, paintingSystem, showFeedback]);

  if (!isVisible) return null;

  // Removed unused getBackgroundColor function

  return (
    <div className="game-ui-container">
      {/* Title and Score */}
      <div className="game-ui-header">
        <h3 className="game-ui-title">🎯 Shape Drawing Game</h3>
        <div className="game-ui-stat">
          <span className="game-ui-stat-label">Score:</span>
          <span className="game-ui-stat-value">{score}</span>
        </div>
        <div className="game-ui-stat">
          <span className="game-ui-stat-label">Level:</span>
          <span className="game-ui-stat-value">{level}</span>
        </div>
      </div>

      {/* Current Challenge */}
      <div className="game-ui-section">
        <div className="game-ui-section-title">Current Challenge:</div>
        <div className="game-ui-challenge-name">
          {currentChallenge ? currentChallenge.name : 'No challenge active'}
        </div>
        <div className="game-ui-challenge-desc">
          {currentChallenge ? currentChallenge.description : 'Select a shape to start!'}
        </div>
      </div>

      {/* Challenge Buttons */}
      <div className="game-ui-section">
        <div className="game-ui-section-title">Available Challenges:</div>
        <div className="game-ui-challenge-list">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`game-ui-challenge-item ${currentChallenge?.id === challenge.id ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => startChallenge(challenge.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  startChallenge(challenge.id);
                }
              }}
            >
              <div className="game-ui-challenge-name">{challenge.name}</div>
              <div className="game-ui-challenge-desc">{challenge.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="game-ui-controls">
        <button onClick={finishDrawing} className="game-ui-button secondary">
          Finish Drawing
        </button>
        <button onClick={resetCanvas} className="game-ui-button danger">
          Reset Canvas
        </button>
        <button onClick={showDotConnectionAnalysis} className="game-ui-button warning">
          Analyze Dots
        </button>
      </div>

      {/* Feedback Display */}
      {feedback.visible && (
        <div className={`game-ui-feedback ${feedback.type}`}>{feedback.message}</div>
      )}
    </div>
  );
};

export default GameUIComponent;
