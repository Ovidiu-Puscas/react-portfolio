import * as THREE from 'three';
import { log, CHALLENGE_CONFIG } from '../config/settings.js';

export class ShapeChallenge {
  constructor() {
    this.currentChallenge = null;
    this.userDrawing = [];
    this.targetDrawing = [];
    this.score = 0;
    this.level = 1;
    this.isShowingTarget = false;
    this.targetDisplayTime = 3000; // 3 seconds to show target

    // Configurable challenge parameters
    this.challengeConfig = {
      size: CHALLENGE_CONFIG.defaultSize,
      speed: CHALLENGE_CONFIG.defaultSpeed,
      centerX: CHALLENGE_CONFIG.defaultCenterX,
      centerY: CHALLENGE_CONFIG.defaultCenterY,
      centerZ: CHALLENGE_CONFIG.defaultCenterZ,
      points: CHALLENGE_CONFIG.defaultPoints,
      alwaysShow: CHALLENGE_CONFIG.defaultAlwaysShow
    };

    this.challenges = [
      {
        id: 'circle',
        name: 'Circle',
        difficulty: 1,
        points: 100,
        description: 'Replicate the circle motion',
        targetShape: 'circle',
        tolerance: CHALLENGE_CONFIG.circleTolerance
      },
      {
        id: 'square',
        name: 'Square',
        difficulty: 2,
        points: 150,
        description: 'Replicate the square motion',
        targetShape: 'square',
        tolerance: CHALLENGE_CONFIG.squareTolerance
      },
      {
        id: 'triangle',
        name: 'Triangle',
        difficulty: 3,
        points: 200,
        description: 'Replicate the triangle motion',
        targetShape: 'triangle',
        tolerance: CHALLENGE_CONFIG.triangleTolerance
      },
      {
        id: 'star',
        name: 'Star',
        difficulty: 4,
        points: 300,
        description: 'Replicate the star motion',
        targetShape: 'star',
        tolerance: CHALLENGE_CONFIG.starTolerance
      }
    ];
  }

  startChallenge(shapeId) {
    this.currentChallenge = this.challenges.find(c => c.id === shapeId);
    this.userDrawing = [];
    this.generateTargetDrawing();
    return this.currentChallenge;
  }

  generateTargetDrawing() {
    log('shapeChallenge', 'generateTargetDrawing', 'generateTargetDrawing called, currentChallenge:', this.currentChallenge);
    if (!this.currentChallenge) return;

    const shape = this.currentChallenge.targetShape;
    const centerX = this.challengeConfig.centerX;
    const centerY = this.challengeConfig.centerY;
    const centerZ = this.challengeConfig.centerZ;
    const radius = this.challengeConfig.size;
    const points = this.challengeConfig.points;

    log('shapeChallenge', 'generateTargetDrawing', 'Generating shape:', shape, 'at center:', centerX, centerY, centerZ, 'radius:', radius, 'points:', points);

    switch (shape) {
      case 'circle':
        this.generateCirclePath(centerX, centerY, centerZ, radius, points);
        break;
      case 'square':
        this.generateSquarePath(centerX, centerY, centerZ, radius, points);
        break;
      case 'triangle':
        this.generateTrianglePath(centerX, centerY, centerZ, radius, points);
        break;
      case 'star':
        this.generateStarPath(centerX, centerY, centerZ, radius, points);
        break;
    }

    log('shapeChallenge', 'generateTargetDrawing', 'Generated targetDrawing with', this.targetDrawing.length, 'points');
  }

  generateCirclePath(centerX, centerY, centerZ, radius, points) {
    log('🔍 CIRCLE SETTINGS DEBUG:');
    log('  Center X:', centerX);
    log('  Center Y:', centerY);
    log('  Center Z:', centerZ);
    log('  Radius:', radius);
    log('  Points:', points);
    log('  Speed:', this.challengeConfig.speed);
    log('  Full Config:', JSON.stringify(this.challengeConfig, null, 2));

    this.targetDrawing = [];
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      this.targetDrawing.push({ x, y, z: centerZ, timestamp: i * this.challengeConfig.speed });
    }
    // Add the first point again to close the circle
    const x = centerX + radius * Math.cos(0);
    const y = centerY + radius * Math.sin(0);
    this.targetDrawing.push({ x, y, z: centerZ, timestamp: points * this.challengeConfig.speed });

    log('  Generated', this.targetDrawing.length, 'points for circle');
    log('  First point:', this.targetDrawing[0]);
    log('  Last point:', this.targetDrawing[this.targetDrawing.length - 1]);
  }

  generateSquarePath(centerX, centerY, centerZ, radius, points) {
    this.targetDrawing = [];
    const sidePoints = Math.floor(points / 4);

    // Top side
    for (let i = 0; i <= sidePoints; i++) {
      const x = centerX - radius + (2 * radius * i / sidePoints);
      const y = centerY - radius;
      this.targetDrawing.push({ x, y, z: centerZ, timestamp: i * this.challengeConfig.speed });
    }

    // Right side
    for (let i = 0; i <= sidePoints; i++) {
      const x = centerX + radius;
      const y = centerY - radius + (2 * radius * i / sidePoints);
      this.targetDrawing.push({ x, y, z: centerZ, timestamp: (sidePoints + i) * this.challengeConfig.speed });
    }

    // Bottom side
    for (let i = 0; i <= sidePoints; i++) {
      const x = centerX + radius - (2 * radius * i / sidePoints);
      const y = centerY + radius;
      this.targetDrawing.push({ x, y, z: centerZ, timestamp: (2 * sidePoints + i) * this.challengeConfig.speed });
    }

    // Left side
    for (let i = 0; i <= sidePoints; i++) {
      const x = centerX - radius;
      const y = centerY + radius - (2 * radius * i / sidePoints);
      this.targetDrawing.push({ x, y, z: centerZ, timestamp: (3 * sidePoints + i) * this.challengeConfig.speed });
    }
  }

  generateTrianglePath(centerX, centerY, centerZ, radius, points) {
    this.targetDrawing = [];
    const sidePoints = Math.floor(points / 3);

    // Calculate triangle vertices
    const v1 = { x: centerX, y: centerY - radius };
    const v2 = { x: centerX - radius * Math.cos(Math.PI / 6), y: centerY + radius * Math.sin(Math.PI / 6) };
    const v3 = { x: centerX + radius * Math.cos(Math.PI / 6), y: centerY + radius * Math.sin(Math.PI / 6) };

    // Side 1: v1 to v2
    for (let i = 0; i <= sidePoints; i++) {
      const t = i / sidePoints;
      const x = v1.x + (v2.x - v1.x) * t;
      const y = v1.y + (v2.y - v1.y) * t;
      this.targetDrawing.push({ x, y, z: centerZ, timestamp: i * this.challengeConfig.speed });
    }

    // Side 2: v2 to v3
    for (let i = 0; i <= sidePoints; i++) {
      const t = i / sidePoints;
      const x = v2.x + (v3.x - v2.x) * t;
      const y = v2.y + (v3.y - v2.y) * t;
      this.targetDrawing.push({ x, y, z: centerZ, timestamp: (sidePoints + i) * this.challengeConfig.speed });
    }

    // Side 3: v3 to v1
    for (let i = 0; i <= sidePoints; i++) {
      const t = i / sidePoints;
      const x = v3.x + (v1.x - v3.x) * t;
      const y = v3.y + (v1.y - v3.y) * t;
      this.targetDrawing.push({ x, y, z: centerZ, timestamp: (2 * sidePoints + i) * this.challengeConfig.speed });
    }
  }

  generateStarPath(centerX, centerY, centerZ, radius, points) {
    this.targetDrawing = [];
    const outerRadius = radius;
    const innerRadius = radius * CHALLENGE_CONFIG.starInnerRadiusRatio;
    const spikes = 5;

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * 2 * Math.PI * spikes;
      const currentRadius = (i % 2 === 0) ? outerRadius : innerRadius;
      const x = centerX + currentRadius * Math.cos(angle);
      const y = centerY + currentRadius * Math.sin(angle);
      this.targetDrawing.push({ x, y, z: centerZ, timestamp: i * this.challengeConfig.speed });
    }
  }

  showTargetDrawing(paintingSystem) {
    log('shapeChallenge', 'showTargetDrawing', 'showTargetDrawing called, targetDrawing length:', this.targetDrawing.length);
    if (!this.targetDrawing.length) return;

    // Always show the target shape on the mesh first, then hide it
    log('shapeChallenge', 'showTargetDrawing', 'Showing target shape on mesh for memorization');
    this.drawCompleteTargetShape(paintingSystem);

    // Hide the target shape after a delay for the user to memorize
    setTimeout(() => {
      log('shapeChallenge', 'showTargetDrawing', 'Hiding target shape - user should now replicate from memory');
      paintingSystem.clearTargetDrawing();
      this.isShowingTarget = false;
    }, 3000); // Show for 3 seconds, then hide
  }

  drawCompleteTargetShape(paintingSystem) {
    log('shapeChallenge', 'drawCompleteTargetShape', 'drawCompleteTargetShape called with', this.targetDrawing.length, 'points');
    log('shapeChallenge', 'drawCompleteTargetShape', 'Shape config:', this.challengeConfig);
    // Draw all points of the target shape at once
    this.targetDrawing.forEach((point, index) => {
      log('shapeChallenge', 'drawCompleteTargetShape', `Drawing target point ${index}:`, point.x, point.y, point.z);
      paintingSystem.paintTargetPoint(point.x, point.y, point.z || 0, '#00ff00'); // Green for target
    });
    log('shapeChallenge', 'drawCompleteTargetShape', 'drawCompleteTargetShape finished');
  }

  clearTargetShape(paintingSystem) {
    if (this.challengeConfig.alwaysShow) {
      // Only clear if we're in always-show mode
      paintingSystem.clearTargetDrawing();
    }
  }

  addDrawingPoint(x, y) {
    // Only record points when not showing target (unless in always-show mode)
    if (!this.isShowingTarget || this.challengeConfig.alwaysShow) {
      this.userDrawing.push({ x, y, timestamp: Date.now() });
    }
  }

  finishDrawing() {
    if (!this.currentChallenge || this.userDrawing.length < 3) {
      return { score: 0, accuracy: 0, message: 'Not enough points to analyze' };
    }

    const accuracy = this.calculateMotionAccuracy();
    const points = Math.round(accuracy * this.currentChallenge.points);
    this.score += points;

    return {
      score: points,
      accuracy: accuracy,
      message: this.getFeedbackMessage(accuracy),
      totalScore: this.score
    };
  }

  calculateMotionAccuracy() {
    if (!this.targetDrawing.length || !this.userDrawing.length) return 0;

    // First, check if user has connected all target dots
    const dotConnectionScore = this.calculateDotConnectionAccuracy();

    // Then calculate motion accuracy as before
    const motionAccuracy = this.calculateMotionAccuracyInternal();

    // Combine both scores using configurable weights
    const finalAccuracy = (dotConnectionScore * CHALLENGE_CONFIG.dotConnectionWeight) +
                         (motionAccuracy * CHALLENGE_CONFIG.motionAccuracyWeight);

    // Small attempt bonus for trying
    const attemptBonus = this.userDrawing.length > CHALLENGE_CONFIG.attemptBonusThreshold ? CHALLENGE_CONFIG.attemptBonus : 0;

    return Math.min(1, finalAccuracy + attemptBonus);
  }

  calculateDotConnectionAccuracy() {
    if (!this.targetDrawing.length || !this.userDrawing.length) return 0;

    // Create a grid to track which target dots have been visited
    const gridSize = CHALLENGE_CONFIG.dotConnectionGridSize;
    const visitedGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(false));

    // Find the bounding box of target drawing
    const targetBounds = this.calculateBoundingBox(this.targetDrawing);
    const userBounds = this.calculateBoundingBox(this.userDrawing);

    log('shapeChallenge', 'calculateDotConnectionAccuracy', 'Target bounds:', targetBounds);
    log('shapeChallenge', 'calculateDotConnectionAccuracy', 'User bounds:', userBounds);

    // Calculate grid coordinates for target dots
    const targetDots = [];
    this.targetDrawing.forEach(point => {
      const widthDiff = targetBounds.maxX - targetBounds.minX;
      const heightDiff = targetBounds.maxY - targetBounds.minY;

      const gridX = widthDiff !== 0
        ? Math.floor(((point.x - targetBounds.minX) / widthDiff) * (gridSize - 1))
        : 0;
      const gridY = heightDiff !== 0
        ? Math.floor(((point.y - targetBounds.minY) / heightDiff) * (gridSize - 1))
        : 0;
      targetDots.push({ x: gridX, y: gridY, original: point });
    });

    log('shapeChallenge', 'calculateDotConnectionAccuracy', 'Target dots count:', targetDots.length);

    // Mark visited areas based on user drawing
    const connectionRadius = Math.max(2, Math.floor(gridSize * CHALLENGE_CONFIG.dotConnectionRadius));
    log('shapeChallenge', 'calculateDotConnectionAccuracy', 'Connection radius:', connectionRadius);

    this.userDrawing.forEach(point => {
      const widthDiff = targetBounds.maxX - targetBounds.minX;
      const heightDiff = targetBounds.maxY - targetBounds.minY;

      const gridX = widthDiff !== 0
        ? Math.floor(((point.x - targetBounds.minX) / widthDiff) * (gridSize - 1))
        : 0;
      const gridY = heightDiff !== 0
        ? Math.floor(((point.y - targetBounds.minY) / heightDiff) * (gridSize - 1))
        : 0;

      // Mark a small area around the user's point as visited
      for (let dx = -connectionRadius; dx <= connectionRadius; dx++) {
        for (let dy = -connectionRadius; dy <= connectionRadius; dy++) {
          const nx = gridX + dx;
          const ny = gridY + dy;
          if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
            visitedGrid[nx][ny] = true;
          }
        }
      }
    });

    // Check how many target dots were connected
    let connectedDots = 0;
    targetDots.forEach(dot => {
      if (visitedGrid[dot.x][dot.y]) {
        connectedDots++;
      }
    });

    // Calculate connection percentage
    const connectionPercentage = connectedDots / targetDots.length;

    // Bonus for completing the shape (connecting first and last dots)
    const firstDot = targetDots[0];
    const lastDot = targetDots[targetDots.length - 1];
    const shapeCompletionBonus = (visitedGrid[firstDot.x][firstDot.y] && visitedGrid[lastDot.x][lastDot.y]) ? CHALLENGE_CONFIG.shapeCompletionBonus : 0;

    const finalScore = Math.min(1, connectionPercentage + shapeCompletionBonus);

    log('shapeChallenge', 'calculateDotConnectionAccuracy', 'Connected dots:', connectedDots, 'of', targetDots.length);
    log('shapeChallenge', 'calculateDotConnectionAccuracy', 'Connection percentage:', connectionPercentage);
    log('shapeChallenge', 'calculateDotConnectionAccuracy', 'Shape completion bonus:', shapeCompletionBonus);
    log('shapeChallenge', 'calculateDotConnectionAccuracy', 'Final score:', finalScore);

    return finalScore;
  }

  calculateMotionAccuracyInternal() {
    if (!this.targetDrawing.length || !this.userDrawing.length) return 0;

    // Normalize both drawings to same number of points
    const normalizedTarget = this.normalizeDrawing(this.targetDrawing, 50);
    const normalizedUser = this.normalizeDrawing(this.userDrawing, 50);

    let totalDistance = 0;
    let totalDirection = 0;

    for (let i = 0; i < Math.min(normalizedTarget.length, normalizedUser.length); i++) {
      const target = normalizedTarget[i];
      const user = normalizedUser[i];

      // Distance accuracy
      const distance = Math.sqrt((target.x - user.x) ** 2 + (target.y - user.y) ** 2);
      totalDistance += distance;

      // Direction accuracy (if we have previous points)
      if (i > 0) {
        const targetDir = Math.atan2(target.y - normalizedTarget[i-1].y, target.x - normalizedTarget[i-1].x);
        const userDir = Math.atan2(user.y - normalizedUser[i-1].y, user.x - normalizedUser[i-1].x);
        const dirDiff = Math.abs(targetDir - userDir);
        totalDirection += Math.min(dirDiff, 2 * Math.PI - dirDiff);
      }
    }

    const minLength = Math.min(normalizedTarget.length, normalizedUser.length);
    const avgDistance = minLength > 0 ? totalDistance / minLength : 0;
    const avgDirection = minLength > 1 ? totalDirection / (minLength - 1) : 0;

    // More lenient accuracy scoring (0-1)
    const distanceAccuracy = Math.max(0, 1 - avgDistance / CHALLENGE_CONFIG.distanceAccuracyDivisor);
    const directionAccuracy = Math.max(0, 1 - avgDirection / (Math.PI * 1.5)); // More lenient than original

    // Weight distance more heavily than direction
    const finalAccuracy = (distanceAccuracy * CHALLENGE_CONFIG.distanceWeight) + (directionAccuracy * CHALLENGE_CONFIG.directionWeight);

    return finalAccuracy;
  }

  normalizeDrawing(drawing, targetPoints) {
    if (drawing.length <= targetPoints) return drawing;

    const normalized = [];
    for (let i = 0; i < targetPoints; i++) {
      const index = Math.floor((i / (targetPoints - 1)) * (drawing.length - 1));
      normalized.push(drawing[index]);
    }
    return normalized;
  }

  calculateAccuracy() {
    const shape = this.currentChallenge.targetShape;
    const points = this.userDrawing.map(p => ({ x: p.x, y: p.y }));

    switch (shape) {
      case 'circle':
        return this.calculateCircleAccuracy(points);
      case 'square':
        return this.calculateSquareAccuracy(points);
      case 'triangle':
        return this.calculateTriangleAccuracy(points);
      case 'star':
        return this.calculateStarAccuracy(points);
      default:
        return 0;
    }
  }

  calculateCircleAccuracy(points) {
    if (points.length < 8) return 0;

    // Calculate center and radius
    const center = this.calculateCenter(points);
    const avgRadius = this.calculateAverageRadius(points, center);

    // Check how consistent the radius is
    let radiusVariance = 0;
    points.forEach(point => {
      const distance = Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2);
      radiusVariance += Math.abs(distance - avgRadius);
    });

    const consistency = 1 - (radiusVariance / (points.length * avgRadius));
    return Math.max(0, Math.min(1, consistency));
  }

  calculateSquareAccuracy(points) {
    if (points.length < 8) return 0;

    // Calculate bounding box
    const bounds = this.calculateBoundingBox(points);
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    // Check if it's roughly square (aspect ratio close to 1)
    const aspectRatio = Math.min(width, height) / Math.max(width, height);

    // Check how well points align to rectangle edges
    const edgeAlignment = this.calculateEdgeAlignment(points, bounds);

    return (aspectRatio + edgeAlignment) / 2;
  }

  calculateTriangleAccuracy(points) {
    if (points.length < 6) return 0;

    // Find the three main vertices
    const vertices = this.findTriangleVertices(points);
    if (vertices.length < 3) return 0;

    // Check if angles are roughly 60 degrees
    const angles = this.calculateTriangleAngles(vertices);
    const angleAccuracy = angles.reduce((acc, angle) => {
      return acc + (1 - Math.abs(angle - 60) / 60);
    }, 0) / 3;

    return Math.max(0, Math.min(1, angleAccuracy));
  }

  calculateStarAccuracy(points) {
    if (points.length < 10) return 0;

    // Simplified star detection - look for 5-point pattern
    const center = this.calculateCenter(points);
    const angles = this.calculateAnglesFromCenter(points, center);

    // Check for 5-point symmetry
    const symmetry = this.calculateSymmetry(angles, 5);

    return Math.max(0, Math.min(1, symmetry));
  }

  calculateCenter(points) {
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    return { x: sumX / points.length, y: sumY / points.length };
  }

  calculateAverageRadius(points, center) {
    const distances = points.map(point =>
      Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2)
    );
    return distances.reduce((sum, d) => sum + d, 0) / distances.length;
  }

  calculateBoundingBox(points) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  }

  calculateEdgeAlignment(points, bounds) {
    const tolerance = CHALLENGE_CONFIG.edgeDetectionTolerance;
    let alignedPoints = 0;

    points.forEach(point => {
      const distToLeft = Math.abs(point.x - bounds.minX);
      const distToRight = Math.abs(point.x - bounds.maxX);
      const distToTop = Math.abs(point.y - bounds.minY);
      const distToBottom = Math.abs(point.y - bounds.maxY);

      const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
      const totalSize = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);

      if (minDist / totalSize < tolerance) {
        alignedPoints++;
      }
    });

    return alignedPoints / points.length;
  }

  findTriangleVertices(points) {
    // Simplified: find points with maximum distance from center
    const center = this.calculateCenter(points);
    const distances = points.map((point, index) => ({
      index,
      distance: Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2)
    }));

    distances.sort((a, b) => b.distance - a.distance);
    return distances.slice(0, 3).map(d => points[d.index]);
  }

  calculateTriangleAngles(vertices) {
    const angles = [];
    for (let i = 0; i < 3; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % 3];
      const p3 = vertices[(i + 2) % 3];

      const a = Math.sqrt((p2.x - p3.x) ** 2 + (p2.y - p3.y) ** 2);
      const b = Math.sqrt((p1.x - p3.x) ** 2 + (p1.y - p3.y) ** 2);
      const c = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

      // Check for division by zero
      if (a === 0 || b === 0) {
        angles.push(0);
      } else {
        const cosValue = (a ** 2 + b ** 2 - c ** 2) / (2 * a * b);
        // Clamp cosValue to valid range for Math.acos
        const clampedCosValue = Math.max(-1, Math.min(1, cosValue));
        const angle = Math.acos(clampedCosValue) * (180 / Math.PI);
        angles.push(angle);
      }
    }
    return angles;
  }

  calculateAnglesFromCenter(points, center) {
    return points.map(point => {
      return Math.atan2(point.y - center.y, point.x - center.x) * (180 / Math.PI);
    });
  }

  calculateSymmetry(angles, symmetryOrder) {
    const angleStep = 360 / symmetryOrder;
    let symmetryScore = 0;

    for (let i = 0; i < angles.length; i++) {
      const expectedAngle = (i * angleStep) % 360;
      const actualAngle = angles[i];
      const angleDiff = Math.abs(actualAngle - expectedAngle);
      symmetryScore += 1 - (angleDiff / 180);
    }

    return symmetryScore / angles.length;
  }

  getFeedbackMessage(accuracy) {
    // Calculate dot connection accuracy separately for more specific feedback
    const dotConnectionScore = this.calculateDotConnectionAccuracy();

    if (accuracy >= CHALLENGE_CONFIG.perfectAccuracy) {
      if (dotConnectionScore >= 0.9) {
        return 'Perfect! You connected all the dots beautifully! 🎉';
      } else {
        return 'Great motion! Try to connect more of the target dots! 👍';
      }
    }
    if (accuracy >= CHALLENGE_CONFIG.greatAccuracy) {
      if (dotConnectionScore >= 0.8) {
        return 'Excellent! You connected most of the dots! 🌟';
      } else {
        return 'Good motion! Focus on connecting the target dots! 🎯';
      }
    }
    if (accuracy >= CHALLENGE_CONFIG.goodAccuracy) {
      if (dotConnectionScore >= 0.6) {
        return 'Good effort! You connected many dots! 😊';
      } else {
        return 'Nice try! Make sure to connect the target dots! 💪';
      }
    }
    if (accuracy >= CHALLENGE_CONFIG.okayAccuracy) {
      if (dotConnectionScore >= 0.4) {
        return 'Not bad! You connected some dots! Keep going! 🎯';
      } else {
        return 'Keep practicing! Focus on connecting the dots! 🎯';
      }
    }

    if (dotConnectionScore < 0.3) {
      return 'Try to connect more of the target dots! 🎯';
    }
    return 'Nice try! Focus on following the motion pattern! 🎯';
  }

  getAvailableChallenges() {
    return this.challenges.filter(c => c.difficulty <= this.level);
  }

  getCurrentChallenge() {
    return this.currentChallenge;
  }

  getScore() {
    return this.score;
  }

  getLevel() {
    return this.level;
  }

  reset() {
    this.userDrawing = [];
    this.currentChallenge = null;
    this.isShowingTarget = false;
  }

  getTargetDrawing() {
    return this.targetDrawing;
  }

  isTargetShowing() {
    return this.isShowingTarget;
  }

  getChallengeConfig() {
    return this.challengeConfig;
  }

  updateChallengeConfig(newConfig) {
    log('shapeChallenge', 'updateChallengeConfig', 'Updating challenge config:', newConfig);

    // Update the config object
    Object.assign(this.challengeConfig, newConfig);

    // Regenerate target drawing if there's an active challenge
    if (this.currentChallenge) {
      this.generateTargetDrawing();
    }

    log('shapeChallenge', 'updateChallengeConfig', 'Updated config:', this.challengeConfig);
  }

  // Public method to get dot connection accuracy
  getDotConnectionAccuracy() {
    return this.calculateDotConnectionAccuracy();
  }

  // Method to get detailed dot connection information for debugging
  getDotConnectionDetails() {
    if (!this.targetDrawing.length || !this.userDrawing.length) {
      return { connected: 0, total: 0, percentage: 0, details: [] };
    }

    const gridSize = CHALLENGE_CONFIG.dotConnectionGridSize;
    const visitedGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(false));

    const targetBounds = this.calculateBoundingBox(this.targetDrawing);

    // Calculate grid coordinates for target dots
    const targetDots = [];
    this.targetDrawing.forEach((point, index) => {
      const widthDiff = targetBounds.maxX - targetBounds.minX;
      const heightDiff = targetBounds.maxY - targetBounds.minY;

      const gridX = widthDiff !== 0
        ? Math.floor(((point.x - targetBounds.minX) / widthDiff) * (gridSize - 1))
        : 0;
      const gridY = heightDiff !== 0
        ? Math.floor(((point.y - targetBounds.minY) / heightDiff) * (gridSize - 1))
        : 0;
      targetDots.push({ x: gridX, y: gridY, original: point, index });
    });

    // Mark visited areas based on user drawing
    const connectionRadius = Math.max(2, Math.floor(gridSize * CHALLENGE_CONFIG.dotConnectionRadius));
    this.userDrawing.forEach(point => {
      const widthDiff = targetBounds.maxX - targetBounds.minX;
      const heightDiff = targetBounds.maxY - targetBounds.minY;

      const gridX = widthDiff !== 0
        ? Math.floor(((point.x - targetBounds.minX) / widthDiff) * (gridSize - 1))
        : 0;
      const gridY = heightDiff !== 0
        ? Math.floor(((point.y - targetBounds.minY) / heightDiff) * (gridSize - 1))
        : 0;

      for (let dx = -connectionRadius; dx <= connectionRadius; dx++) {
        for (let dy = -connectionRadius; dy <= connectionRadius; dy++) {
          const nx = gridX + dx;
          const ny = gridY + dy;
          if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
            visitedGrid[nx][ny] = true;
          }
        }
      }
    });

    // Check which dots were connected
    const details = targetDots.map(dot => ({
      index: dot.index,
      connected: visitedGrid[dot.x][dot.y],
      position: dot.original
    }));

    const connected = details.filter(d => d.connected).length;
    const percentage = connected / targetDots.length;

    return {
      connected,
      total: targetDots.length,
      percentage,
      details
    };
  }

  // Method to print current settings for debugging
  printCurrentSettings() {
    log('🔧 CURRENT CHALLENGE SETTINGS:');
    log('  Active Challenge:', this.currentChallenge ? this.currentChallenge.name : 'None');
    log('  Config:', JSON.stringify(this.challengeConfig, null, 2));
    log('  Target Drawing Points:', this.targetDrawing.length);
    if (this.targetDrawing.length > 0) {
      log('  First Target Point:', this.targetDrawing[0]);
      log('  Last Target Point:', this.targetDrawing[this.targetDrawing.length - 1]);
    }
    log('  User Drawing Points:', this.userDrawing.length);
    log('  Is Target Showing:', this.isShowingTarget);
    log('  Auto Detection Run:', this.autoDetectionRun || 'N/A (not in PaintingSystem)');
  }
}
