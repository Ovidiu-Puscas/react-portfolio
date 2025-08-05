import React from 'react';
import explosion from '../assets/explosion.gif';

const AnimationOverlay = ({ showAnimation, animationType }) => {
  if (!showAnimation) return null;

  return (
    <div className="animation-overlay">
      {animationType === 'explosion' && (
        <div className="explosion-container">
          <img src={explosion} alt="Explosion" className="explosion-gif" />
          <h2 className="animation-text explosion-text">Road Blocked!</h2>
          <p>The path doesn&apos;t connect properly. Try again!</p>
        </div>
      )}

      {animationType === 'confetti' && (
        <div className="confetti-container">
          <div className="confetti-animation">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#ff6b35', '#ffd700', '#00ff00', '#ff69b4', '#00bfff'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              ></div>
            ))}
          </div>
          <h2 className="animation-text success-text">🎉 Success!</h2>
          <p>Perfect road! The car reached the finish line!</p>
        </div>
      )}
    </div>
  );
};

export default AnimationOverlay;
