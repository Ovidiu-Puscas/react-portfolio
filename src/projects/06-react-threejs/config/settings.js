// Console logging configuration
export const LOGGING_CONFIG = {
  // Painting system logs
  painting: {
    paintTargetPoint: true,
    updateCombinedCanvas: true,
    setCanvasMesh: true,
    autoDetectPaintingArea: true,
    capturePaintingArea: true
  },
  
  // Shape challenge logs
  shapeChallenge: {
    generateTargetDrawing: true,
    showTargetDrawing: true,
    drawCompleteTargetShape: true,
    updateChallengeConfig: true
  },
  
  // Game UI logs
  gameUI: {
    startChallenge: true,
    showFeedback: true
  },
  
  // Main application logs
  main: {
    guiChanges: true,
    meshLoading: true,
    modelTraversal: true
  },
  
  // Debug logs
  debug: {
    uvCoordinates: true,
    meshNames: true,
    materialInfo: true
  }
};

// Logging utility function
export function log(category, type, ...args) {
  if (!LOGGING_CONFIG[category]) {
    console.warn(`[LOGGING] Unknown category: '${category}'. Available categories: ${Object.keys(LOGGING_CONFIG).join(', ')}`);
    return;
  }
  
  if (!LOGGING_CONFIG[category][type]) {
    console.warn(`[LOGGING] Unknown type '${type}' for category '${category}'. Available types: ${Object.keys(LOGGING_CONFIG[category]).join(', ')}`);
    return;
  }
  
  if (LOGGING_CONFIG[category][type]) {
    console.log(`[${category.toUpperCase()}:${type}]`, ...args);
  }
}

export const CAMERA_CONFIG = {
  initialPosition: { x: -8, y: 11, z: 0.6 },
  target: { x: 0, y: 1, z: 0 },
  rotationStep: Math.PI / 4, // 45 degrees
  dampingFactor: 0.1
};

export const COLOR_PALETTE_CONFIG = {
  defaultColors: [
    { name: 'Red', color: '#ff0000' },
    { name: 'Green', color: '#00ff00' },
    { name: 'Blue', color: '#0000ff' },
    { name: 'Yellow', color: '#ffff00' },
    { name: 'Purple', color: '#8000ff' },
    { name: 'Black', color: '#000000' },
    { name: 'White', color: '#ffffff' }
  ],
  defaultConfig: {
    y: 5,
    z: 0.68,
    x: -5.72,
    spacing: 1.2,
    radius: 0.5,
    rotation: 1.6
  }
};

export const PAINTING_CONFIG = {
  canvasSize: 1024,
  brushSize: 5,
  brushAlpha: 0.7,
  backgroundColor: 'rgba(128,128,128,0.2)'
};

export const SCENE_CONFIG = {
  gridSize: 20,
  gridDivisions: 20,
  axesSize: 5
};

export const CHALLENGE_CONFIG = {
  defaultSize: 0.055,
  defaultSpeed: 50,
  defaultCenterX: 0.52,
  defaultCenterY: 0.87,
  defaultCenterZ: 0.0,
  defaultPoints: 16,
  defaultAlwaysShow: false,
  autoDetectionSize: 0.055, // Use same as default size
  paintingAreaCenter: { u: 0.52, v: 0.87 },
  // Additional config for hardcoded values
  testOffset: 0.02, // Offset for test dots around painting area
  legacyDefaultSize: 0.03, // Legacy default size for backward compatibility
  tolerance: 0.01, // Tolerance for comparing floating point values
  // Challenge-specific tolerances
  circleTolerance: 0.2,
  squareTolerance: 0.25,
  triangleTolerance: 0.3,
  starTolerance: 0.35,
  // Accuracy calculation parameters
  distanceAccuracyDivisor: 0.8,
  distanceWeight: 0.7,
  directionWeight: 0.3,
  attemptBonusThreshold: 5,
  attemptBonus: 0.1,
  // Dot connection accuracy parameters
  dotConnectionGridSize: 100,
  dotConnectionRadius: 0.02, // 2% of grid size
  dotConnectionWeight: 0.7, // Weight for dot connection vs motion accuracy
  motionAccuracyWeight: 0.3, // Weight for motion accuracy vs dot connection
  shapeCompletionBonus: 0.1, // Bonus for completing the shape
  // Star shape parameters
  starInnerRadiusRatio: 0.4,
  // Accuracy thresholds for feedback
  perfectAccuracy: 0.85,
  greatAccuracy: 0.7,
  goodAccuracy: 0.55,
  okayAccuracy: 0.4,
  // Edge detection tolerance
  edgeDetectionTolerance: 0.1
}; 