import React, { useEffect, useRef } from 'react';
import './CameraController.css';

const CameraControllerReact = ({ cameraController, onRotateLeft, onRotateRight }) => {
  const buttonContainerRef = useRef(null);

  useEffect(() => {
    if (!cameraController) return;

    // Store bound event handlers for proper cleanup
    const boundRotateLeft = () => {
      cameraController.targetRotationY += cameraController.rotationStep;
      if (onRotateLeft) onRotateLeft();
    };

    const boundRotateRight = () => {
      cameraController.targetRotationY -= cameraController.rotationStep;
      if (onRotateRight) onRotateRight();
    };

    // Add keyboard event listeners
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          boundRotateLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          boundRotateRight();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [cameraController, onRotateLeft, onRotateRight]);

  if (!cameraController) return null;

  return (
    <div className="camera-controller-container" ref={buttonContainerRef}>
      <button
        className="camera-control-button"
        onClick={() => {
          cameraController.targetRotationY += cameraController.rotationStep;
          if (onRotateLeft) onRotateLeft();
        }}
        aria-label="Rotate camera left"
        title="Rotate Left (←)"
      >
        ← Rotate Left
      </button>
      <button
        className="camera-control-button"
        onClick={() => {
          cameraController.targetRotationY -= cameraController.rotationStep;
          if (onRotateRight) onRotateRight();
        }}
        aria-label="Rotate camera right"
        title="Rotate Right (→)"
      >
        Rotate Right →
      </button>
    </div>
  );
};

export default CameraControllerReact;
