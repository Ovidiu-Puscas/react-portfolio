import * as THREE from 'three';

export class CameraController {
  constructor(camera, renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.targetRotationY = 0;
    this.currentRotationY = 0;
    this.rotationStep = Math.PI / 4; // 45 degrees
    
    // Set initial camera position as requested
    this.cameraRadius = Math.sqrt((-8) * (-8) + (0.6) * (0.6));
    this.cameraHeight = 11;
    this.camera.position.set(-8, 11, 0.6);
    this.cameraTarget = new THREE.Vector3(0, 1, 0);
    this.camera.lookAt(this.cameraTarget);

    // Calculate initial rotation angle from desired position
    let initialRotationY = Math.atan2(-8, 0.6);
    this.currentRotationY = initialRotationY;
    this.targetRotationY = initialRotationY;

    this.createUI();
  }

  createUI() {
    // Check if container already exists and remove it
    if (this.buttonContainer) {
      this.buttonContainer.remove();
    }
    
    // Create container for rotation buttons
    this.buttonContainer = document.createElement('div');
    this.buttonContainer.style.position = 'fixed';
    this.buttonContainer.style.bottom = '20px';
    this.buttonContainer.style.left = '50%';
    this.buttonContainer.style.transform = 'translateX(-50%)';
    this.buttonContainer.style.zIndex = '1001';
    this.buttonContainer.style.display = 'flex';
    this.buttonContainer.style.gap = '10px';
    
    // Add UI buttons for rotation
    this.rotateLeftBtn = document.createElement('button');
    this.rotateLeftBtn.textContent = '← Rotate Left';
    this.rotateLeftBtn.style.padding = '10px 20px';
    this.rotateLeftBtn.style.border = 'none';
    this.rotateLeftBtn.style.borderRadius = '5px';
    this.rotateLeftBtn.style.background = 'rgba(0, 0, 0, 0.8)';
    this.rotateLeftBtn.style.color = 'white';
    this.rotateLeftBtn.style.cursor = 'pointer';
    this.rotateLeftBtn.style.fontSize = '14px';
    this.rotateLeftBtn.style.fontWeight = 'bold';

    this.rotateRightBtn = document.createElement('button');
    this.rotateRightBtn.textContent = 'Rotate Right →';
    this.rotateRightBtn.style.padding = '10px 20px';
    this.rotateRightBtn.style.border = 'none';
    this.rotateRightBtn.style.borderRadius = '5px';
    this.rotateRightBtn.style.background = 'rgba(0, 0, 0, 0.8)';
    this.rotateRightBtn.style.color = 'white';
    this.rotateRightBtn.style.cursor = 'pointer';
    this.rotateRightBtn.style.fontSize = '14px';
    this.rotateRightBtn.style.fontWeight = 'bold';
    
    this.buttonContainer.appendChild(this.rotateLeftBtn);
    this.buttonContainer.appendChild(this.rotateRightBtn);
    document.body.appendChild(this.buttonContainer);

    // Store bound event handlers for proper cleanup
    this.boundRotateLeft = () => {
      this.targetRotationY += this.rotationStep;
    };
    this.boundRotateRight = () => {
      this.targetRotationY -= this.rotationStep;
    };

    this.rotateLeftBtn.addEventListener('click', this.boundRotateLeft);
    this.rotateRightBtn.addEventListener('click', this.boundRotateRight);
  }

  update() {
    // Smoothly interpolate camera rotation
    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.1;
    // Use the user-specified radius and height
    this.camera.position.x = Math.sin(this.currentRotationY) * this.cameraRadius;
    this.camera.position.z = Math.cos(this.currentRotationY) * this.cameraRadius;
    this.camera.position.y = this.cameraHeight;
    this.camera.lookAt(this.cameraTarget);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  destroy() {
    // Remove event listeners before removing elements
    if (this.rotateLeftBtn && this.boundRotateLeft) {
      this.rotateLeftBtn.removeEventListener('click', this.boundRotateLeft);
    }
    if (this.rotateRightBtn && this.boundRotateRight) {
      this.rotateRightBtn.removeEventListener('click', this.boundRotateRight);
    }
    
    // Remove DOM elements
    if (this.buttonContainer) {
      this.buttonContainer.remove();
      this.buttonContainer = null;
    }
    if (this.rotateLeftBtn) {
      this.rotateLeftBtn.remove();
      this.rotateLeftBtn = null;
    }
    if (this.rotateRightBtn) {
      this.rotateRightBtn.remove();
      this.rotateRightBtn = null;
    }
    
    // Clear bound handlers
    this.boundRotateLeft = null;
    this.boundRotateRight = null;
  }
} 