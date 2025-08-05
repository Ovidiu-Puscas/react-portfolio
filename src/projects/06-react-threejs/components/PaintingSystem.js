import { Vector2, Raycaster, CanvasTexture, MeshStandardMaterial } from 'three';
import { PAINTING_CONFIG, CHALLENGE_CONFIG, log } from '../config/settings.js';

export class PaintingSystem {
  constructor() {
    this.canvasMesh = null;
    this.paintCanvas = null;
    this.targetCanvas = null;
    this.combinedCanvas = null;
    this.paintCtx = null;
    this.targetCtx = null;
    this.combinedCtx = null;
    this.paintTexture = null;
    this.originalMaterial = null;
    this.camera = null;
    this.renderer = null;
    this.colorPalette = null;
    this.shapeChallenge = null;
    this.mouse = new Vector2();
    this.raycaster = new Raycaster();
    this.isDrawing = false;
    this.autoDetectionRun = false; // Flag to track if auto-detection has run
    this.lastPaintPoint = null; // Store last paint point for interpolation

    // Use the imported configuration
    this.config = { ...PAINTING_CONFIG };

    // Initialize canvases
    this.initCanvas();
    this.setupEventListeners();
    this.createBrushUI();
  }

  setShapeChallenge(shapeChallenge) {
    this.shapeChallenge = shapeChallenge;
  }

  initCanvas() {
    // Create main paint canvas
    this.paintCanvas = document.createElement('canvas');
    this.paintCanvas.width = this.config.canvasSize;
    this.paintCanvas.height = this.config.canvasSize;
    this.paintCtx = this.paintCanvas.getContext('2d');

    // Create target drawing canvas
    this.targetCanvas = document.createElement('canvas');
    this.targetCanvas.width = this.config.canvasSize;
    this.targetCanvas.height = this.config.canvasSize;
    this.targetCtx = this.targetCanvas.getContext('2d');

    // Create combined canvas for final texture
    this.combinedCanvas = document.createElement('canvas');
    this.combinedCanvas.width = this.config.canvasSize;
    this.combinedCanvas.height = this.config.canvasSize;
    this.combinedCtx = this.combinedCanvas.getContext('2d');

    // Create texture from combined canvas
    this.paintTexture = new CanvasTexture(this.combinedCanvas);
    this.paintTexture.needsUpdate = true;

    // Set initial background - make it more visible
    this.paintCtx.fillStyle = 'rgba(128,128,128,0.8)'; // More opaque gray
    this.paintCtx.fillRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);

    this.targetCtx.fillStyle = 'rgba(0,0,0,0)'; // Transparent
    this.targetCtx.fillRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);

    this.updateCombinedCanvas();
  }

  updateCombinedCanvas() {
    log('painting', 'updateCombinedCanvas', 'updateCombinedCanvas called');
    // Clear combined canvas
    this.combinedCtx.clearRect(0, 0, this.combinedCanvas.width, this.combinedCanvas.height);

    // Draw paint layer first (background)
    this.combinedCtx.drawImage(this.paintCanvas, 0, 0);

    // Draw target layer on top with higher priority
    this.combinedCtx.globalCompositeOperation = 'source-over';
    this.combinedCtx.drawImage(this.targetCanvas, 0, 0);
    this.combinedCtx.globalCompositeOperation = 'source-over';

    // Update texture
    this.paintTexture.needsUpdate = true;
    log(
      'painting',
      'updateCombinedCanvas',
      'Combined canvas updated, texture needsUpdate set to true'
    );
  }

  setupEventListeners() {
    // Store bound functions for proper cleanup
    this.boundOnPointerDown = this.onPointerDown.bind(this);
    this.boundOnPointerMove = this.onPointerMove.bind(this);
    this.boundOnPointerUp = this.onPointerUp.bind(this);

    window.addEventListener('pointerdown', this.boundOnPointerDown);
    window.addEventListener('pointermove', this.boundOnPointerMove);
    window.addEventListener('pointerup', this.boundOnPointerUp);
  }

  createBrushUI() {
    // Create brush size control container
    this.brushUIContainer = document.createElement('div');
    this.brushUIContainer.className = 'brush-ui-container';
    this.brushUIContainer.style.position = 'fixed';
    this.brushUIContainer.style.right = '20px';
    this.brushUIContainer.style.top = '50%';
    this.brushUIContainer.style.transform = 'translateY(-50%)';
    this.brushUIContainer.style.background = 'rgba(0, 0, 0, 0.8)';
    this.brushUIContainer.style.color = 'white';
    this.brushUIContainer.style.padding = '20px';
    this.brushUIContainer.style.borderRadius = '10px';
    this.brushUIContainer.style.zIndex = '1000';
    this.brushUIContainer.style.fontFamily = 'Arial, sans-serif';
    this.brushUIContainer.style.minWidth = '200px';

    // Title
    const title = document.createElement('h3');
    title.textContent = 'Brush Settings';
    title.style.margin = '0 0 15px 0';
    title.style.fontSize = '16px';
    title.style.fontWeight = 'bold';
    this.brushUIContainer.appendChild(title);

    // Brush size label and value
    const sizeLabel = document.createElement('div');
    sizeLabel.style.marginBottom = '10px';
    sizeLabel.style.fontSize = '14px';
    sizeLabel.textContent = 'Brush Size: ';

    const sizeValue = document.createElement('span');
    sizeValue.id = 'brush-size-value';
    sizeValue.textContent = `${this.config.brushSize}px`;
    sizeLabel.appendChild(sizeValue);
    this.brushUIContainer.appendChild(sizeLabel);

    // Brush size slider
    const sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '1';
    sizeSlider.max = '50';
    sizeSlider.value = this.config.brushSize;
    sizeSlider.style.width = '100%';
    sizeSlider.style.marginBottom = '20px';
    sizeSlider.addEventListener('input', (e) => {
      this.config.brushSize = parseInt(e.target.value);
      document.getElementById('brush-size-value').textContent = `${this.config.brushSize}px`;
      this.updateBrushPreview();
    });
    this.brushUIContainer.appendChild(sizeSlider);

    // Brush opacity label and value
    const opacityLabel = document.createElement('div');
    opacityLabel.style.marginBottom = '10px';
    opacityLabel.style.fontSize = '14px';
    opacityLabel.textContent = 'Brush Opacity: ';

    const opacityValue = document.createElement('span');
    opacityValue.id = 'brush-opacity-value';
    opacityValue.textContent = `${Math.round(this.config.brushAlpha * 100)}%`;
    opacityLabel.appendChild(opacityValue);
    this.brushUIContainer.appendChild(opacityLabel);

    // Brush opacity slider
    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '10';
    opacitySlider.max = '100';
    opacitySlider.value = this.config.brushAlpha * 100;
    opacitySlider.style.width = '100%';
    opacitySlider.style.marginBottom = '20px';
    opacitySlider.addEventListener('input', (e) => {
      this.config.brushAlpha = parseInt(e.target.value) / 100;
      document.getElementById('brush-opacity-value').textContent =
        `${Math.round(this.config.brushAlpha * 100)}%`;
      this.updateBrushPreview();
    });
    this.brushUIContainer.appendChild(opacitySlider);

    // Brush preview
    const previewLabel = document.createElement('div');
    previewLabel.textContent = 'Preview:';
    previewLabel.style.marginBottom = '10px';
    previewLabel.style.fontSize = '14px';
    this.brushUIContainer.appendChild(previewLabel);

    const previewContainer = document.createElement('div');
    previewContainer.style.width = '100%';
    previewContainer.style.height = '60px';
    previewContainer.style.background = 'rgba(255, 255, 255, 0.1)';
    previewContainer.style.borderRadius = '5px';
    previewContainer.style.display = 'flex';
    previewContainer.style.alignItems = 'center';
    previewContainer.style.justifyContent = 'center';
    previewContainer.style.position = 'relative';
    previewContainer.style.overflow = 'hidden';

    this.brushPreview = document.createElement('div');
    this.brushPreview.style.width = `${this.config.brushSize * 2}px`;
    this.brushPreview.style.height = `${this.config.brushSize * 2}px`;
    this.brushPreview.style.borderRadius = '50%';
    this.brushPreview.style.background = '#ff0000';
    this.brushPreview.style.opacity = this.config.brushAlpha;
    previewContainer.appendChild(this.brushPreview);
    this.brushUIContainer.appendChild(previewContainer);

    document.body.appendChild(this.brushUIContainer);
  }

  updateBrushPreview() {
    if (this.brushPreview) {
      this.brushPreview.style.width = `${Math.min(this.config.brushSize * 2, 50)}px`;
      this.brushPreview.style.height = `${Math.min(this.config.brushSize * 2, 50)}px`;
      this.brushPreview.style.opacity = this.config.brushAlpha;
      this.brushPreview.style.background = this.colorPalette
        ? this.colorPalette.getSelectedColor()
        : '#ff0000';
    }
  }

  setCanvasMesh(mesh) {
    this.canvasMesh = mesh;
    log('painting', 'setCanvasMesh', 'Canvas mesh set:', mesh?.name);

    if (!mesh) return;

    // Initialize canvas
    this.initCanvas();

    // Store original material properties
    if (Array.isArray(mesh.material)) {
      this.originalMaterial = mesh.material[0]; // Store first material
    } else {
      this.originalMaterial = mesh.material;
    }

    // Create paint texture
    this.paintTexture = new CanvasTexture(this.combinedCanvas);
    this.paintTexture.needsUpdate = true;

    // Apply paint texture to mesh
    if (Array.isArray(this.canvasMesh.material)) {
      const canvasMaterialIndex = 0; // Change this if needed after inspecting debug output
      const origMat = this.canvasMesh.material[canvasMaterialIndex];
      this.canvasMesh.material[canvasMaterialIndex] = new MeshStandardMaterial({
        map: this.paintTexture,
        metalness: origMat.metalness,
        roughness: origMat.roughness,
        color: origMat.color.clone(),
        transparent: true, // Enable transparency for target layer
        alphaTest: 0.1, // Ensure transparent pixels are rendered
      });
      // Other materials (e.g., for brush, tip) are left unchanged
    } else {
      // Single material mesh
      this.canvasMesh.material = new MeshStandardMaterial({
        map: this.paintTexture,
        metalness: this.canvasMesh.material.metalness,
        roughness: this.canvasMesh.material.roughness,
        color: this.canvasMesh.material.color.clone(),
        transparent: true, // Enable transparency for target layer
        alphaTest: 0.1, // Ensure transparent pixels are rendered
      });
    }

    // Set up base color/texture on canvas
    if (this.originalMaterial.map) {
      // If the original material has a texture, draw it as base
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.paintCanvas.width;
      tempCanvas.height = this.paintCanvas.height;
      const tempCtx = tempCanvas.getContext('2d');

      // Create a temporary image to get the texture data
      const tempImg = new Image();
      tempImg.onload = () => {
        tempCtx.drawImage(tempImg, 0, 0, this.paintCanvas.width, this.paintCanvas.height);
        this.paintCtx.drawImage(tempCanvas, 0, 0);
        this.updateCombinedCanvas();
      };
      tempImg.src = this.originalMaterial.map.image.src;
    } else {
      // If no texture, use the material's color as base
      const color = this.originalMaterial.color;
      this.paintCtx.fillStyle = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;
      this.paintCtx.fillRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);
      this.updateCombinedCanvas();
    }

    // Automatically detect and set the correct painting area coordinates
    this.autoDetectPaintingArea();
  }

  // Method to automatically detect the correct painting area
  autoDetectPaintingArea() {
    log('painting', 'autoDetectPaintingArea', 'Auto-detecting painting area coordinates...');

    // Only run auto-detection once
    if (this.autoDetectionRun) {
      log(
        'painting',
        'autoDetectPaintingArea',
        'Auto-detection already run, skipping to respect user settings'
      );
      return;
    }

    if (this.shapeChallenge) {
      // Check if user has manually set coordinates (not at defaults)
      const currentConfig = this.shapeChallenge.getChallengeConfig();
      const isUserModified =
        Math.abs(currentConfig.centerX - CHALLENGE_CONFIG.defaultCenterX) >
          CHALLENGE_CONFIG.tolerance ||
        Math.abs(currentConfig.centerY - CHALLENGE_CONFIG.defaultCenterY) >
          CHALLENGE_CONFIG.tolerance ||
        Math.abs(currentConfig.size - CHALLENGE_CONFIG.defaultSize) > CHALLENGE_CONFIG.tolerance;

      if (isUserModified) {
        log(
          'painting',
          'autoDetectPaintingArea',
          'User has modified settings, respecting their choices'
        );
        this.autoDetectionRun = true;
        return;
      }

      // Only auto-detect if user hasn't modified settings
      const paintingCenter = CHALLENGE_CONFIG.paintingAreaCenter;
      log(
        'painting',
        'autoDetectPaintingArea',
        'Auto-updating shape challenge to use painting area coordinates:',
        paintingCenter
      );
      this.shapeChallenge.updateChallengeConfig({
        centerX: paintingCenter.u,
        centerY: paintingCenter.v,
        size: CHALLENGE_CONFIG.autoDetectionSize,
      });

      // Mark auto-detection as complete
      this.autoDetectionRun = true;
    }
  }

  setColorPalette(colorPalette) {
    this.colorPalette = colorPalette;
  }

  onPointerDown(event) {
    // Raycast for color blobs
    const rect = this.renderer ? this.renderer.domElement.getBoundingClientRect() : null;

    if (rect) {
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    } else {
      // Fallback to window dimensions
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.colorPalette) {
      const blobIntersects = this.raycaster.intersectObjects(
        this.colorPalette.getBlobsForRaycasting()
      );
      if (blobIntersects.length > 0) {
        const blob = this.colorPalette.findBlobByMesh(blobIntersects[0].object);
        if (blob) {
          this.colorPalette.select(blob.index);
          this.updateBrushPreview(); // Update preview when color changes
          return; // Don't start painting if a blob was clicked
        }
      }
    }

    if (!this.canvasMesh) return; // Only proceed if canvasMesh is ready
    this.isPainting = true;
    this.lastPaintPoint = null; // Reset last point when starting new stroke
    this.paintFromEvent(event);
  }

  onPointerMove(event) {
    if (this.isPainting) this.paintFromEvent(event);
  }

  onPointerUp() {
    this.isPainting = false;
    this.lastPaintPoint = null; // Reset last point when stopping painting
  }

  paintFromEvent(event) {
    if (!this.canvasMesh) return;

    const rect = this.renderer ? this.renderer.domElement.getBoundingClientRect() : null;

    if (rect) {
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    } else {
      // Fallback to window dimensions
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.canvasMesh);
    if (intersects.length > 0) {
      const uv = intersects[0].uv;
      this.paintAtUV(uv.x, uv.y);

      // Track drawing points for game system
      if (this.shapeChallenge) {
        this.shapeChallenge.addDrawingPoint(uv.x, uv.y);
      }
    }
  }

  paintAtUV(u, v) {
    // Paint anywhere on the canvas
    const x = u * this.paintCanvas.width;
    const y = (1 - v) * this.paintCanvas.height;
    const currentPoint = { x, y, u, v };

    this.paintCtx.save();
    this.paintCtx.globalAlpha = this.config.brushAlpha;
    this.paintCtx.fillStyle = this.colorPalette ? this.colorPalette.getSelectedColor() : '#ff0000';

    if (this.lastPaintPoint && this.isPainting) {
      // Interpolate between last point and current point to create smooth strokes
      const distance = Math.sqrt(
        Math.pow(x - this.lastPaintPoint.x, 2) + Math.pow(y - this.lastPaintPoint.y, 2)
      );

      // Calculate number of intermediate points based on distance
      const steps = Math.max(1, Math.ceil(distance / (this.config.brushSize * 0.5)));

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const interpX = this.lastPaintPoint.x + (x - this.lastPaintPoint.x) * t;
        const interpY = this.lastPaintPoint.y + (y - this.lastPaintPoint.y) * t;

        // Draw circle at each interpolated point
        this.paintCtx.beginPath();
        this.paintCtx.arc(interpX, interpY, this.config.brushSize, 0, 2 * Math.PI);
        this.paintCtx.fill();
      }
    } else {
      // Draw a circle for the first point or single clicks
      this.paintCtx.beginPath();
      this.paintCtx.arc(x, y, this.config.brushSize, 0, 2 * Math.PI);
      this.paintCtx.fill();
    }

    this.paintCtx.restore();
    this.lastPaintPoint = currentPoint;
    this.updateCombinedCanvas();
  }

  setCamera(camera) {
    this.camera = camera;
  }

  setRenderer(renderer) {
    this.renderer = renderer;
  }

  // Game integration methods
  clearCanvas() {
    // Clear the paint canvas
    this.paintCtx.clearRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);

    // Clear the target canvas
    this.targetCtx.clearRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);

    // Restore the original material properties
    if (this.originalMaterial) {
      // Create a new material with the original properties but our paint texture
      const newMaterial = new MeshStandardMaterial({
        map: this.paintTexture,
        metalness: this.originalMaterial.metalness,
        roughness: this.originalMaterial.roughness,
        color: this.originalMaterial.color.clone(),
        transparent: false, // Don't use transparency when resetting
      });

      // Apply the new material
      if (Array.isArray(this.canvasMesh.material)) {
        this.canvasMesh.material[0] = newMaterial;
      } else {
        this.canvasMesh.material = newMaterial;
      }

      // Fill with the original mesh color as base
      const originalColor = this.originalMaterial.color;
      this.paintCtx.fillStyle = `rgb(${Math.round(originalColor.r * 255)}, ${Math.round(originalColor.g * 255)}, ${Math.round(originalColor.b * 255)})`;
    } else {
      // Fallback to background color if no original material
      this.paintCtx.fillStyle = 'rgba(128,128,128,0.8)';
    }

    this.paintCtx.fillRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);

    // Set target canvas to transparent
    this.targetCtx.fillStyle = 'rgba(0,0,0,0)';
    this.targetCtx.fillRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);

    this.updateCombinedCanvas();
  }

  paintTargetPoint(u, v, z = 0, color = '#00ff00') {
    log('painting', 'paintTargetPoint', 'paintTargetPoint called with:', u, v, z, color);
    // Paint a target point (for showing the shape to replicate)
    const x = u * this.paintCanvas.width;
    const y = (1 - v) * this.paintCanvas.height;
    log(
      'painting',
      'paintTargetPoint',
      'Drawing target point at canvas coordinates:',
      x,
      y,
      'Z:',
      z,
      'on canvas size:',
      this.paintCanvas.width,
      'x',
      this.paintCanvas.height
    );

    // Draw target dots with smaller size
    this.targetCtx.save();
    this.targetCtx.globalAlpha = 1.0; // Fully opaque for target
    this.targetCtx.beginPath();
    this.targetCtx.arc(x, y, 8, 0, 2 * Math.PI); // Much smaller dots
    this.targetCtx.fillStyle = '#00ff00'; // Bright green for target
    this.targetCtx.fill();

    // Add a thin border to make dots visible but not too prominent
    this.targetCtx.strokeStyle = '#000000';
    this.targetCtx.lineWidth = 1;
    this.targetCtx.stroke();

    this.targetCtx.restore();

    log('painting', 'paintTargetPoint', 'Target point drawn, updating combined canvas');
    this.updateCombinedCanvas();
  }

  // Method to test different UV coordinates to find the correct face
  testUVCoordinates() {
    console.log('Testing UV coordinates on different faces...');

    // Clear any existing target drawing first
    this.clearTargetDrawing();

    // Test corners of the UV space
    const testPoints = [
      { u: 0.1, v: 0.1, label: 'Top-left' },
      { u: 0.9, v: 0.1, label: 'Top-right' },
      { u: 0.1, v: 0.9, label: 'Bottom-left' },
      { u: 0.9, v: 0.9, label: 'Bottom-right' },
      { u: 0.5, v: 0.5, label: 'Center' },
    ];

    testPoints.forEach((point, index) => {
      setTimeout(() => {
        console.log(`Testing ${point.label} at UV: ${point.u}, ${point.v}`);
        this.paintTargetPoint(point.u, point.v, 0, '#ff0000');
      }, index * 1000); // Test each point 1 second apart
    });
  }

  // Method to test alternative UV mappings (flipped, rotated, etc.)
  testAlternativeUVMappings() {
    console.log('Testing alternative UV mappings...');

    // Clear any existing target drawing first
    this.clearTargetDrawing();

    // Test different UV transformations
    const testMappings = [
      { u: 0.5, v: 0.5, label: 'Original Center' },
      { u: 0.5, v: 0.5, label: 'Flipped V' },
      { u: 0.5, v: 0.5, label: 'Flipped U' },
      { u: 0.5, v: 0.5, label: 'Both Flipped' },
    ];

    testMappings.forEach((mapping, index) => {
      setTimeout(() => {
        let u = mapping.u;
        let v = mapping.v;

        // Apply different transformations
        switch (index) {
          case 1: // Flipped V
            v = 1 - v;
            break;
          case 2: // Flipped U
            u = 1 - u;
            break;
          case 3: // Both flipped
            u = 1 - u;
            v = 1 - v;
            break;
          default:
            // No transformation for case 0
            break;
        }

        console.log(`Testing ${mapping.label} at UV: ${u}, ${v}`);
        this.paintTargetPoint(u, v, 0, '#0000ff'); // Blue for alternative mappings
      }, index * 2000); // Test each mapping 2 seconds apart
    });
  }

  // Method to test painting area UV coordinates
  testPaintingAreaUV() {
    console.log('Testing UV coordinates in the painting area...');

    // Clear any existing target drawing first
    this.clearTargetDrawing();

    // Test coordinates around where the user is painting (from the logs)
    const paintingAreaTests = [
      {
        u: CHALLENGE_CONFIG.paintingAreaCenter.u,
        v: CHALLENGE_CONFIG.paintingAreaCenter.v,
        label: 'User Painting Area 1',
        color: '#ff0000',
      },
      {
        u: CHALLENGE_CONFIG.paintingAreaCenter.u - 0.01,
        v: CHALLENGE_CONFIG.paintingAreaCenter.v - 0.01,
        label: 'User Painting Area 2',
        color: '#00ff00',
      },
      {
        u: CHALLENGE_CONFIG.paintingAreaCenter.u + 0.01,
        v: CHALLENGE_CONFIG.paintingAreaCenter.v + 0.01,
        label: 'User Painting Area 3',
        color: '#0000ff',
      },
      {
        u: CHALLENGE_CONFIG.paintingAreaCenter.u - 0.02,
        v: CHALLENGE_CONFIG.paintingAreaCenter.v - 0.02,
        label: 'User Painting Area 4',
        color: '#ffff00',
      },
      {
        u: CHALLENGE_CONFIG.paintingAreaCenter.u + 0.02,
        v: CHALLENGE_CONFIG.paintingAreaCenter.v + 0.02,
        label: 'User Painting Area 5',
        color: '#ff00ff',
      },
    ];

    paintingAreaTests.forEach((test, index) => {
      setTimeout(() => {
        console.log(`Testing ${test.label} at UV: ${test.u}, ${test.v}`);
        this.paintTargetPoint(test.u, test.v, 0, test.color);
      }, index * 500); // Test each point 0.5 seconds apart
    });
  }

  // Method to find the correct UV face by testing a grid
  testUVGrid() {
    console.log('Testing UV grid to find the correct face...');

    // Clear any existing target drawing first
    this.clearTargetDrawing();

    // Test a grid of UV coordinates to find where dots appear
    const gridSize = 5;
    const step = 1.0 / gridSize;

    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        const u = i * step;
        const v = j * step;

        setTimeout(
          () => {
            console.log(`Testing grid point at UV: ${u.toFixed(2)}, ${v.toFixed(2)}`);
            this.paintTargetPoint(u, v, 0, '#ff0000');
          },
          (i * (gridSize + 1) + j) * 200
        ); // Test each grid point 0.2 seconds apart
      }
    }
  }

  // Method to capture user's painting area and adjust challenge coordinates
  capturePaintingArea() {
    log('painting', 'capturePaintingArea', 'Capturing user painting area...');

    // Clear any existing target drawing first
    this.clearTargetDrawing();

    // Based on the logs, the user is painting around these coordinates
    const paintingCenter = CHALLENGE_CONFIG.paintingAreaCenter;

    // Draw a test dot at the user's painting area
    log(
      'painting',
      'capturePaintingArea',
      `Drawing test dot at user's painting area: ${paintingCenter.u}, ${paintingCenter.v}`
    );
    this.paintTargetPoint(paintingCenter.u, paintingCenter.v, 0, '#ff0000');

    // Also draw a small circle around it to make it more visible
    setTimeout(() => {
      this.paintTargetPoint(
        paintingCenter.u + CHALLENGE_CONFIG.testOffset,
        paintingCenter.v,
        0,
        '#00ff00'
      );
      this.paintTargetPoint(
        paintingCenter.u - CHALLENGE_CONFIG.testOffset,
        paintingCenter.v,
        0,
        '#00ff00'
      );
      this.paintTargetPoint(
        paintingCenter.u,
        paintingCenter.v + CHALLENGE_CONFIG.testOffset,
        0,
        '#00ff00'
      );
      this.paintTargetPoint(
        paintingCenter.u,
        paintingCenter.v - CHALLENGE_CONFIG.testOffset,
        0,
        '#00ff00'
      );
    }, 1000);

    // Update the shape challenge to use these coordinates, but preserve manual settings
    if (this.shapeChallenge) {
      const currentConfig = this.shapeChallenge.getChallengeConfig();
      log(
        'painting',
        'capturePaintingArea',
        'Updating shape challenge to use painting area coordinates'
      );

      // Check if user has manually modified settings
      const isUserModified =
        Math.abs(currentConfig.centerX - CHALLENGE_CONFIG.defaultCenterX) >
          CHALLENGE_CONFIG.tolerance ||
        Math.abs(currentConfig.centerY - CHALLENGE_CONFIG.defaultCenterY) >
          CHALLENGE_CONFIG.tolerance ||
        Math.abs(currentConfig.size - CHALLENGE_CONFIG.defaultSize) > CHALLENGE_CONFIG.tolerance;

      if (isUserModified) {
        log(
          'painting',
          'capturePaintingArea',
          'User has modified settings, not overriding their choices'
        );
        // Just show the target with current settings
        if (this.shapeChallenge.currentChallenge) {
          this.shapeChallenge.showTargetDrawing(this);
        }
        return;
      }

      // Only update coordinates if they're still at defaults, preserve current size
      const updateConfig = {
        centerX: paintingCenter.u,
        centerY: paintingCenter.v,
      };

      // Only update size if it's still at the default value (legacy) or custom default
      if (
        Math.abs(currentConfig.size - CHALLENGE_CONFIG.legacyDefaultSize) <
          CHALLENGE_CONFIG.tolerance ||
        Math.abs(currentConfig.size - CHALLENGE_CONFIG.defaultSize) < CHALLENGE_CONFIG.tolerance
      ) {
        updateConfig.size = CHALLENGE_CONFIG.autoDetectionSize;
      }

      this.shapeChallenge.updateChallengeConfig(updateConfig);

      // Reset auto-detection flag to allow future manual overrides
      this.autoDetectionRun = false;

      // Show the target immediately if there's an active challenge
      if (this.shapeChallenge.currentChallenge) {
        this.shapeChallenge.showTargetDrawing(this);
      }
    }
  }

  // Method to reset auto-detection and allow manual coordinate setting
  resetAutoDetection() {
    log('painting', 'autoDetectPaintingArea', 'Resetting auto-detection flag');
    this.autoDetectionRun = false;
  }

  // Method to update challenge configuration
  updateChallengeConfig(newConfig) {
    console.log('Updating challenge config:', newConfig);
    // This method can be called to update the painting system's configuration
    // if needed for challenge-specific settings
  }

  clearTargetDrawing() {
    // Clear only the target drawing layer
    this.targetCtx.clearRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);
    this.targetCtx.fillStyle = 'rgba(0,0,0,0)'; // Transparent
    this.targetCtx.fillRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);
    this.updateCombinedCanvas();
  }

  getCanvasData() {
    return this.paintCtx.getImageData(0, 0, this.paintCanvas.width, this.paintCanvas.height);
  }

  destroy() {
    // Remove event listeners
    if (this.boundOnPointerDown) {
      window.removeEventListener('pointerdown', this.boundOnPointerDown);
    }
    if (this.boundOnPointerMove) {
      window.removeEventListener('pointermove', this.boundOnPointerMove);
    }
    if (this.boundOnPointerUp) {
      window.removeEventListener('pointerup', this.boundOnPointerUp);
    }

    // Clean up brush UI
    if (this.brushUIContainer) {
      this.brushUIContainer.remove();
    }

    // Clean up brush size indicator
    const indicator = document.getElementById('brush-size-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
}
