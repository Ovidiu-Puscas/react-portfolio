import { CHALLENGE_CONFIG } from '../config/settings.js';

export class GameUI {
  constructor(shapeChallenge, paintingSystem) {
    this.shapeChallenge = shapeChallenge;
    this.paintingSystem = paintingSystem;
    this.container = null;
    this.scoreDisplay = null;
    this.challengeDisplay = null;
    this.feedbackDisplay = null;
    this.createUI();
  }

  createUI() {
    // Create main container
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.top = '50%';
    this.container.style.left = '10px';
    this.container.style.transform = 'translateY(-50%)';
    this.container.style.width = '300px';
    this.container.style.background = 'rgba(0, 0, 0, 0.8)';
    this.container.style.color = 'white';
    this.container.style.padding = '15px';
    this.container.style.borderRadius = '10px';
    this.container.style.fontFamily = 'Arial, sans-serif';
    this.container.style.zIndex = '1000';

    // Score display
    this.scoreDisplay = document.createElement('div');

    // Create title
    const title = document.createElement('h3');
    title.style.margin = '0 0 10px 0';
    title.style.color = '#ffd700';
    title.textContent = '🎯 Shape Drawing Game';
    this.scoreDisplay.appendChild(title);

    // Create score section
    const scoreSection = document.createElement('div');
    scoreSection.style.fontSize = '18px';
    scoreSection.style.marginBottom = '15px';
    const scoreLabel = document.createElement('strong');
    scoreLabel.textContent = 'Score: ';
    const scoreValue = document.createElement('span');
    scoreValue.id = 'current-score';
    scoreValue.textContent = '0';
    scoreSection.appendChild(scoreLabel);
    scoreSection.appendChild(scoreValue);
    this.scoreDisplay.appendChild(scoreSection);

    // Create level section
    const levelSection = document.createElement('div');
    levelSection.style.fontSize = '14px';
    levelSection.style.marginBottom = '15px';
    const levelLabel = document.createElement('strong');
    levelLabel.textContent = 'Level: ';
    const levelValue = document.createElement('span');
    levelValue.id = 'current-level';
    levelValue.textContent = '1';
    levelSection.appendChild(levelLabel);
    levelSection.appendChild(levelValue);
    this.scoreDisplay.appendChild(levelSection);

    this.container.appendChild(this.scoreDisplay);

    // Challenge display
    this.challengeDisplay = document.createElement('div');

    // Create challenge container
    const challengeContainer = document.createElement('div');
    challengeContainer.style.marginBottom = '15px';

    // Create challenge title
    const challengeTitle = document.createElement('strong');
    challengeTitle.textContent = 'Current Challenge:';
    challengeContainer.appendChild(challengeTitle);

    // Create challenge name
    const challengeName = document.createElement('div');
    challengeName.id = 'challenge-name';
    challengeName.style.color = '#ffd700';
    challengeName.style.marginTop = '5px';
    challengeName.textContent = 'No challenge active';
    challengeContainer.appendChild(challengeName);

    // Create challenge description
    const challengeDescription = document.createElement('div');
    challengeDescription.id = 'challenge-description';
    challengeDescription.style.fontSize = '12px';
    challengeDescription.style.marginTop = '5px';
    challengeDescription.style.color = '#ccc';
    challengeDescription.textContent = 'Select a shape to start!';
    challengeContainer.appendChild(challengeDescription);

    this.challengeDisplay.appendChild(challengeContainer);
    this.container.appendChild(this.challengeDisplay);

    // Challenge buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginBottom = '15px';

    const challenges = this.shapeChallenge.getAvailableChallenges() || [];
    challenges.forEach(challenge => {
      const button = document.createElement('button');
      button.textContent = challenge.name;
      button.style.margin = '2px';
      button.style.padding = '8px 12px';
      button.style.border = 'none';
      button.style.borderRadius = '5px';
      button.style.background = '#4CAF50';
      button.style.color = 'white';
      button.style.cursor = 'pointer';
      button.style.fontSize = '12px';

      const startChallengeHandler = () => {
        this.startChallenge(challenge.id);
      };
      button.addEventListener('click', startChallengeHandler);
      // Store reference for cleanup
      if (!this.eventListeners) this.eventListeners = [];
      this.eventListeners.push({ element: button, event: 'click', handler: startChallengeHandler });

      buttonContainer.appendChild(button);
    });

    this.container.appendChild(buttonContainer);

    // Control buttons
    const controlContainer = document.createElement('div');
    controlContainer.style.marginBottom = '15px';

    const finishButton = document.createElement('button');
    finishButton.textContent = 'Finish Drawing';
    finishButton.style.margin = '2px';
    finishButton.style.padding = '8px 12px';
    finishButton.style.border = 'none';
    finishButton.style.borderRadius = '5px';
    finishButton.style.background = '#2196F3';
    finishButton.style.color = 'white';
    finishButton.style.cursor = 'pointer';
    finishButton.style.fontSize = '12px';
    const finishDrawingHandler = () => {
      this.finishDrawing();
    };
    finishButton.addEventListener('click', finishDrawingHandler);
    // Store reference for cleanup
    if (!this.eventListeners) this.eventListeners = [];
    this.eventListeners.push({ element: finishButton, event: 'click', handler: finishDrawingHandler });

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Canvas';
    resetButton.style.margin = '2px';
    resetButton.style.padding = '8px 12px';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '5px';
    resetButton.style.background = '#f44336';
    resetButton.style.color = 'white';
    resetButton.style.cursor = 'pointer';
    resetButton.style.fontSize = '12px';
    const resetCanvasHandler = () => {
      this.resetCanvas();
    };
    resetButton.addEventListener('click', resetCanvasHandler);
    // Store reference for cleanup
    if (!this.eventListeners) this.eventListeners = [];
    this.eventListeners.push({ element: resetButton, event: 'click', handler: resetCanvasHandler });

    const analysisButton = document.createElement('button');
    analysisButton.textContent = 'Analyze Dots';
    analysisButton.style.margin = '2px';
    analysisButton.style.padding = '8px 12px';
    analysisButton.style.border = 'none';
    analysisButton.style.borderRadius = '5px';
    analysisButton.style.background = '#FF9800';
    analysisButton.style.color = 'white';
    analysisButton.style.cursor = 'pointer';
    analysisButton.style.fontSize = '12px';
    const analysisHandler = () => {
      this.showDotConnectionAnalysis();
    };
    analysisButton.addEventListener('click', analysisHandler);
    // Store reference for cleanup
    if (!this.eventListeners) this.eventListeners = [];
    this.eventListeners.push({ element: analysisButton, event: 'click', handler: analysisHandler });

    controlContainer.appendChild(finishButton);
    controlContainer.appendChild(resetButton);
    controlContainer.appendChild(analysisButton);
    this.container.appendChild(controlContainer);

    // Feedback display
    this.feedbackDisplay = document.createElement('div');
    this.feedbackDisplay.id = 'feedback-display';
    this.feedbackDisplay.style.padding = '10px';
    this.feedbackDisplay.style.borderRadius = '5px';
    this.feedbackDisplay.style.fontSize = '14px';
    this.feedbackDisplay.style.display = 'none';
    this.container.appendChild(this.feedbackDisplay);

    document.body.appendChild(this.container);
    this.updateDisplay();
  }

  startChallenge(shapeId) {
    const challenge = this.shapeChallenge.startChallenge(shapeId);
    if (challenge) {
      this.updateDisplay();

      // Get current config to check if using custom coordinates
      const config = this.shapeChallenge.getChallengeConfig();
      const isCustomCoordinates = Math.abs(config.centerX - CHALLENGE_CONFIG.defaultCenterX) > CHALLENGE_CONFIG.tolerance || Math.abs(config.centerY - CHALLENGE_CONFIG.defaultCenterY) > CHALLENGE_CONFIG.tolerance;

      // Show target shape immediately if using custom coordinates, otherwise with delay
      if (isCustomCoordinates) {
        console.log('Using custom coordinates, showing target immediately');
        this.shapeChallenge.showTargetDrawing(this.paintingSystem);
      } else {
        // Show target shape on the mesh for memorization with delay
        setTimeout(() => {
          this.shapeChallenge.showTargetDrawing(this.paintingSystem);
        }, 500);
      }

      this.showFeedback(`Started ${challenge.name} challenge! Watch the dots, then replicate!`, 'info');
    }
  }

  finishDrawing() {
    const result = this.shapeChallenge.finishDrawing();

    if (result.score > 0) {
      // Calculate dot connection accuracy for detailed feedback
      const dotConnectionScore = this.shapeChallenge.getDotConnectionAccuracy();
      const dotConnectionPercentage = Math.round(dotConnectionScore * 100);

      // Get detailed dot connection information
      const dotDetails = this.shapeChallenge.getDotConnectionDetails();

      let feedbackMessage = `${result.message}<br>Overall Accuracy: ${Math.round(result.accuracy * 100)}%<br>Dots Connected: ${dotConnectionPercentage}% (${dotDetails.connected}/${dotDetails.total})<br>Points: +${result.score}`;

      // Add more detailed feedback for low accuracy
      if (dotConnectionPercentage < 50) {
        feedbackMessage += '<br><small>💡 Tip: Try to connect more of the target dots!</small>';
      } else if (dotConnectionPercentage < 80) {
        feedbackMessage += '<br><small>💡 Good progress! Connect a few more dots for better score!</small>';
      }

      this.showFeedback(
        feedbackMessage,
        result.accuracy >= 0.7 ? 'success' : 'warning'
      );
    } else {
      this.showFeedback(result.message, 'error');
    }

    this.updateDisplay();
  }

  // Method to show detailed dot connection analysis
  showDotConnectionAnalysis() {
    if (!this.shapeChallenge.currentChallenge) {
      this.showFeedback('No active challenge to analyze!', 'error');
      return;
    }

    const dotDetails = this.shapeChallenge.getDotConnectionDetails();
    if (dotDetails.total === 0) {
      this.showFeedback('No drawing data to analyze!', 'error');
      return;
    }

    const connectedDots = dotDetails.details.filter(d => d.connected).map(d => d.index + 1);
    const missedDots = dotDetails.details.filter(d => !d.connected).map(d => d.index + 1);

    let analysisMessage = `Dot Connection Analysis:<br>Connected: ${dotDetails.connected}/${dotDetails.total} (${Math.round(dotDetails.percentage * 100)}%)`;

    if (connectedDots.length > 0) {
      analysisMessage += `<br>✅ Connected dots: ${connectedDots.slice(0, 10).join(', ')}${connectedDots.length > 10 ? '...' : ''}`;
    }

    if (missedDots.length > 0) {
      analysisMessage += `<br>❌ Missed dots: ${missedDots.slice(0, 10).join(', ')}${missedDots.length > 10 ? '...' : ''}`;
    }

    this.showFeedback(analysisMessage, 'info');
  }

  resetCanvas() {
    this.shapeChallenge.reset();
    if (this.paintingSystem) {
      this.paintingSystem.clearCanvas();
      // Clear target shape if in always-show mode
      this.shapeChallenge.clearTargetShape(this.paintingSystem);
    }
    this.updateDisplay();
    this.showFeedback('Canvas reset! Start a new challenge.', 'info');
  }

  updateDisplay() {
    // Update score
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
      scoreElement.textContent = this.shapeChallenge.getScore();
    }

    // Update level
    const levelElement = document.getElementById('current-level');
    if (levelElement) {
      levelElement.textContent = this.shapeChallenge.getLevel();
    }

    // Update challenge info
    const challengeNameElement = document.getElementById('challenge-name');
    const challengeDescElement = document.getElementById('challenge-description');

    const currentChallenge = this.shapeChallenge.getCurrentChallenge();
    if (currentChallenge) {
      challengeNameElement.textContent = currentChallenge.name;
      challengeDescElement.textContent = currentChallenge.description;
    } else {
      challengeNameElement.textContent = 'No challenge active';
      challengeDescElement.textContent = 'Select a shape to start!';
    }
  }

  showFeedback(message, type = 'info') {
    // Clear existing content
    this.feedbackDisplay.innerHTML = '';

    // Handle HTML content safely by creating elements programmatically
    if (message.includes('<br>')) {
      const parts = message.split('<br>');
      parts.forEach((part, index) => {
        if (part.trim()) {
          // Handle small tags for tips
          if (part.includes('<small>') && part.includes('</small>')) {
            const smallMatch = part.match(/<small>(.*?)<\/small>/);
            if (smallMatch) {
              const smallElement = document.createElement('small');
              smallElement.textContent = smallMatch[1];
              this.feedbackDisplay.appendChild(smallElement);
            }
          } else {
            const textNode = document.createTextNode(part);
            this.feedbackDisplay.appendChild(textNode);
          }
        }
        if (index < parts.length - 1) {
          this.feedbackDisplay.appendChild(document.createElement('br'));
        }
      });
    } else {
      // Simple text content
      this.feedbackDisplay.textContent = message;
    }

    this.feedbackDisplay.style.display = 'block';

    // Set color based on type
    switch (type) {
      case 'success':
        this.feedbackDisplay.style.background = 'rgba(76, 175, 80, 0.9)';
        break;
      case 'warning':
        this.feedbackDisplay.style.background = 'rgba(255, 152, 0, 0.9)';
        break;
      case 'error':
        this.feedbackDisplay.style.background = 'rgba(244, 67, 54, 0.9)';
        break;
      default:
        this.feedbackDisplay.style.background = 'rgba(33, 150, 243, 0.9)';
    }

    // Hide after 3 seconds
    setTimeout(() => {
      this.feedbackDisplay.style.display = 'none';
    }, 3000);
  }

  destroy() {
    // Clean up event listeners
    if (this.eventListeners) {
      this.eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      this.eventListeners = [];
    }

    if (this.container) {
      this.container.remove();
    }
  }
}
