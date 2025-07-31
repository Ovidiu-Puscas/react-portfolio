import React, { useState, useEffect, useCallback } from 'react';
import { CHALLENGE_CONFIG } from '../config/settings.js';

const GameUIComponent = ({ shapeChallenge, paintingSystem, isVisible = true }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: 'info', visible: false });
  const [challenges, setChallenges] = useState([]);

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

    // Set up periodic updates (could be replaced with proper event system)
    const interval = setInterval(updateGameState, 100);
    return () => clearInterval(interval);
  }, [shapeChallenge]);

  const startChallenge = useCallback((shapeId) => {
    if (!shapeChallenge) return;

    const challenge = shapeChallenge.startChallenge(shapeId);
    if (challenge) {
      setCurrentChallenge(challenge);
      
      // Get current config to check if using custom coordinates
      const config = shapeChallenge.getChallengeConfig();
      const isCustomCoordinates = Math.abs(config.centerX - CHALLENGE_CONFIG.defaultCenterX) > CHALLENGE_CONFIG.tolerance || 
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
      
      showFeedback(`Started ${challenge.name} challenge! Watch the dots, then replicate!`, 'info');
    }
  }, [shapeChallenge, paintingSystem]);

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
      
      showFeedback(
        feedbackMessage,
        result.accuracy >= 0.7 ? 'success' : 'warning'
      );
    } else {
      showFeedback(result.message, 'error');
    }
    
    setScore(shapeChallenge.getScore());
  }, [shapeChallenge]);

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
    
    const connectedDots = dotDetails.details.filter(d => d.connected).map(d => d.index + 1);
    const missedDots = dotDetails.details.filter(d => !d.connected).map(d => d.index + 1);
    
    let analysisMessage = `Dot Connection Analysis:\nConnected: ${dotDetails.connected}/${dotDetails.total} (${Math.round(dotDetails.percentage * 100)}%)`;
    
    if (connectedDots.length > 0) {
      analysisMessage += `\n✅ Connected dots: ${connectedDots.slice(0, 10).join(', ')}${connectedDots.length > 10 ? '...' : ''}`;
    }
    
    if (missedDots.length > 0) {
      analysisMessage += `\n❌ Missed dots: ${missedDots.slice(0, 10).join(', ')}${missedDots.length > 10 ? '...' : ''}`;
    }
    
    showFeedback(analysisMessage, 'info');
  }, [shapeChallenge]);

  const resetCanvas = useCallback(() => {
    if (!shapeChallenge || !paintingSystem) return;

    shapeChallenge.reset();
    paintingSystem.clearCanvas();
    // Clear target shape if in always-show mode
    shapeChallenge.clearTargetShape(paintingSystem);
    setCurrentChallenge(null);
    showFeedback('Canvas reset! Start a new challenge.', 'info');
  }, [shapeChallenge, paintingSystem]);

  const showFeedback = useCallback((message, type = 'info') => {
    setFeedback({ message, type, visible: true });
    // Hide after 3 seconds
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  if (!isVisible) return null;

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success': return 'rgba(76, 175, 80, 0.9)';
      case 'warning': return 'rgba(255, 152, 0, 0.9)';
      case 'error': return 'rgba(244, 67, 54, 0.9)';
      default: return 'rgba(33, 150, 243, 0.9)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        width: '300px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        zIndex: 1000,
      }}
    >
      {/* Title and Score */}
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#ffd700' }}>
          🎯 Shape Drawing Game
        </h3>
        <div style={{ fontSize: '18px', marginBottom: '15px' }}>
          <strong>Score: </strong>
          <span>{score}</span>
        </div>
        <div style={{ fontSize: '14px', marginBottom: '15px' }}>
          <strong>Level: </strong>
          <span>{level}</span>
        </div>
      </div>

      {/* Current Challenge */}
      <div style={{ marginBottom: '15px' }}>
        <strong>Current Challenge:</strong>
        <div style={{ color: '#ffd700', marginTop: '5px' }}>
          {currentChallenge ? currentChallenge.name : 'No challenge active'}
        </div>
        <div style={{ fontSize: '12px', marginTop: '5px', color: '#ccc' }}>
          {currentChallenge ? currentChallenge.description : 'Select a shape to start!'}
        </div>
      </div>

      {/* Challenge Buttons */}
      <div style={{ marginBottom: '15px' }}>
        {challenges.map(challenge => (
          <button
            key={challenge.id}
            onClick={() => startChallenge(challenge.id)}
            style={{
              margin: '2px',
              padding: '8px 12px',
              border: 'none',
              borderRadius: '5px',
              background: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {challenge.name}
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={finishDrawing}
          style={{
            margin: '2px',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '5px',
            background: '#2196F3',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Finish Drawing
        </button>
        <button
          onClick={resetCanvas}
          style={{
            margin: '2px',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '5px',
            background: '#f44336',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Reset Canvas
        </button>
        <button
          onClick={showDotConnectionAnalysis}
          style={{
            margin: '2px',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '5px',
            background: '#FF9800',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Analyze Dots
        </button>
      </div>

      {/* Feedback Display */}
      {feedback.visible && (
        <div
          style={{
            padding: '10px',
            borderRadius: '5px',
            fontSize: '14px',
            background: getBackgroundColor(feedback.type),
            whiteSpace: 'pre-line',
            marginTop: '10px',
          }}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default GameUIComponent;