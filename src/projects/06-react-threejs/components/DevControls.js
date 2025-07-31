import * as THREE from 'three';

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export class DevControls {
  constructor(scene, camera, renderer, paintingSystem, cameraController, colorPalette, shapeChallenge) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.paintingSystem = paintingSystem;
    this.cameraController = cameraController;
    this.colorPalette = colorPalette;
    this.shapeChallenge = shapeChallenge;
    this.isExpanded = false;

    // Store references to scene helpers for toggling
    this.axesHelper = null;
    this.gridHelper = null;
    this.lightHelpers = [];

    // Store direct references to lights to avoid fragile scene filtering
    this.ambientLight = null;
    this.directionalLight1 = null;
    this.directionalLight2 = null;
    this.spotlight = null;
    this.pointLight = null;

    this.createDevPanel();
  }

  // Methods to set light references from the main app
  setLightReferences(lights) {
    this.ambientLight = lights.ambient;
    this.directionalLight1 = lights.directional1;
    this.directionalLight2 = lights.directional2;
    this.spotlight = lights.spotlight;
    this.pointLight = lights.point;
  }

  createDevPanel() {
    // Create main container
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.top = '20px';
    this.container.style.right = '250px'; // Position to left of brush controls
    this.container.style.zIndex = '1002';
    this.container.style.fontFamily = 'monospace';
    this.container.style.fontSize = '12px';

    // Create toggle button
    this.toggleButton = document.createElement('button');
    this.toggleButton.textContent = 'Dev Controls';
    this.toggleButton.style.background = 'rgba(0, 0, 0, 0.8)';
    this.toggleButton.style.color = 'white';
    this.toggleButton.style.border = 'none';
    this.toggleButton.style.padding = '8px 12px';
    this.toggleButton.style.borderRadius = '5px';
    this.toggleButton.style.cursor = 'pointer';
    this.toggleButton.style.fontSize = '12px';
    this.toggleButton.style.fontWeight = 'bold';
    this.toggleButton.addEventListener('click', () => this.toggle());
    this.container.appendChild(this.toggleButton);

    // Create controls panel (initially hidden)
    this.panel = document.createElement('div');
    this.panel.style.display = 'none';
    this.panel.style.background = 'rgba(0, 0, 0, 0.95)';
    this.panel.style.color = 'white';
    this.panel.style.padding = '12px';
    this.panel.style.borderRadius = '5px';
    this.panel.style.marginTop = '5px';
    this.panel.style.width = '220px';
    this.panel.style.maxHeight = '600px';
    this.panel.style.overflowY = 'auto';
    this.panel.style.border = '1px solid #444';

    this.createControls();
    this.container.appendChild(this.panel);
    document.body.appendChild(this.container);
  }

  createControls() {
    // Camera Position section
    this.addSectionTitle('Camera Position');
    this.addVector3Input('Position',
      { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z },
      (values) => this.updateCameraPosition(values)
    );
    this.addVector3Input('Target',
      { x: this.cameraController.cameraTarget.x, y: this.cameraController.cameraTarget.y, z: this.cameraController.cameraTarget.z },
      (values) => this.updateCameraTarget(values)
    );
    this.addNumberInput('Radius', this.cameraController.cameraRadius, (value) => this.updateCameraRadius(value));
    this.addNumberInput('Height', this.cameraController.cameraHeight, (value) => this.updateCameraHeight(value));

    this.addSeparator();

    // Lighting Controls
    this.addSectionTitle('Lighting');
    this.addNumberInput('Ambient Intensity', this.ambientLight ? this.ambientLight.intensity : 0.6, (value) => this.updateAmbientLight(value));

    // Main directional light
    this.addSubSectionTitle('Main Dir Light');
    this.addVector3Input('Dir Position',
      this.directionalLight1 ? { x: this.directionalLight1.position.x, y: this.directionalLight1.position.y, z: this.directionalLight1.position.z } : { x: -12, y: 15, z: 8 },
      (values) => this.updateDirectionalLight1(values)
    );
    this.addNumberInput('Dir Intensity', this.directionalLight1 ? this.directionalLight1.intensity : 1.5, (value) => this.updateDirectionalLight1Intensity(value));

    // Secondary directional light
    this.addSubSectionTitle('Second Dir Light');
    this.addVector3Input('Dir2 Position',
      this.directionalLight2 ? { x: this.directionalLight2.position.x, y: this.directionalLight2.position.y, z: this.directionalLight2.position.z } : { x: -15, y: 12, z: -5 },
      (values) => this.updateDirectionalLight2(values)
    );
    this.addNumberInput('Dir2 Intensity', this.directionalLight2 ? this.directionalLight2.intensity : 1.0, (value) => this.updateDirectionalLight2Intensity(value));

    // Spotlight
    this.addSubSectionTitle('Spotlight');
    this.addVector3Input('Spot Position',
      this.spotlight ? { x: this.spotlight.position.x, y: this.spotlight.position.y, z: this.spotlight.position.z } : { x: -10, y: 18, z: 5 },
      (values) => this.updateSpotlight(values)
    );
    this.addNumberInput('Spot Intensity', this.spotlight ? this.spotlight.intensity : 2.0, (value) => this.updateSpotlightIntensity(value));
    this.addNumberInput('Spot Angle', this.spotlight ? this.spotlight.angle : Math.PI / 4, (value) => this.updateSpotlightAngle(value));

    // Point light
    this.addSubSectionTitle('Point Light');
    this.addVector3Input('Point Position',
      this.pointLight ? { x: this.pointLight.position.x, y: this.pointLight.position.y, z: this.pointLight.position.z } : { x: -10, y: 13, z: 3 },
      (values) => this.updatePointLight(values)
    );
    this.addNumberInput('Point Intensity', this.pointLight ? this.pointLight.intensity : 1.2, (value) => this.updatePointLightIntensity(value));

    this.addSeparator();

    // Scene helpers section
    this.addSectionTitle('Scene Helpers');
    this.addCheckbox('Axes Helper', true, (checked) => this.toggleAxesHelper(checked));
    this.addCheckbox('Grid Helper', true, (checked) => this.toggleGridHelper(checked));
    this.addCheckbox('Light Helpers', false, (checked) => this.toggleLightHelpers(checked));
    this.addCheckbox('Wireframe Mode', false, (checked) => this.toggleWireframe(checked));

    this.addSeparator();

    // Quick actions
    this.addSectionTitle('Quick Actions');
    this.addButton('Reset Camera', () => this.resetCamera());
    this.addButton('Log Camera Info', () => this.logCameraPosition());
    this.addButton('Log Scene Info', () => this.logSceneInfo());

    this.addSeparator();

    // Painting tests section
    this.addSectionTitle('Painting Tests');
    this.addButton('Test UV Grid', () => this.paintingSystem.testUVGrid());
    this.addButton('Test Painting Area', () => this.paintingSystem.testPaintingAreaUV());
    this.addButton('Clear Target Drawing', () => this.paintingSystem.clearTargetDrawing());

    this.addSeparator();

    // Performance section
    this.addSectionTitle('Performance');
    this.addCheckbox('Show FPS', false, (checked) => this.toggleFPS(checked));
    this.addButton('Log Render Info', () => this.logRenderInfo());
  }

  addSectionTitle(title) {
    const titleEl = document.createElement('div');
    titleEl.textContent = title;
    titleEl.style.fontWeight = 'bold';
    titleEl.style.marginBottom = '8px';
    titleEl.style.marginTop = '10px';
    titleEl.style.color = '#ffd700';
    titleEl.style.borderBottom = '1px solid #333';
    titleEl.style.paddingBottom = '4px';
    this.panel.appendChild(titleEl);
  }

  addCheckbox(label, checked, callback) {
    const container = document.createElement('div');
    container.style.marginBottom = '6px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    checkbox.style.marginRight = '8px';
    checkbox.addEventListener('change', (e) => callback(e.target.checked));

    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.style.cursor = 'pointer';
    labelEl.style.fontSize = '11px';
    // Remove manual toggle to avoid double toggling with default HTML behavior

    container.appendChild(checkbox);
    container.appendChild(labelEl);
    this.panel.appendChild(container);
  }

  addButton(text, callback) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.background = '#333';
    button.style.color = 'white';
    button.style.border = '1px solid #555';
    button.style.padding = '4px 8px';
    button.style.margin = '2px';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '10px';
    button.style.width = '100%';
    button.addEventListener('click', callback);
    button.addEventListener('mouseenter', () => {
      button.style.background = '#555';
    });
    button.addEventListener('mouseleave', () => {
      button.style.background = '#333';
    });
    this.panel.appendChild(button);
  }

  addSeparator() {
    const separator = document.createElement('div');
    separator.style.height = '1px';
    separator.style.background = '#333';
    separator.style.margin = '10px 0';
    this.panel.appendChild(separator);
  }

  addSubSectionTitle(title) {
    const titleEl = document.createElement('div');
    titleEl.textContent = title;
    titleEl.style.fontWeight = 'bold';
    titleEl.style.marginBottom = '5px';
    titleEl.style.marginTop = '8px';
    titleEl.style.color = '#ccc';
    titleEl.style.fontSize = '10px';
    this.panel.appendChild(titleEl);
  }

  addNumberInput(label, initialValue, callback) {
    const container = document.createElement('div');
    container.style.marginBottom = '5px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'space-between';

    const labelEl = document.createElement('label');
    labelEl.textContent = label + ':';
    labelEl.style.fontSize = '10px';
    labelEl.style.color = '#ccc';
    labelEl.style.width = '70px';
    labelEl.style.flexShrink = '0';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = initialValue.toFixed(2);
    input.step = '0.1';
    input.style.width = '60px';
    input.style.background = '#222';
    input.style.border = '1px solid #555';
    input.style.color = 'white';
    input.style.fontSize = '10px';
    input.style.padding = '2px 4px';
    input.style.borderRadius = '2px';

    const debouncedCallback = debounce((value) => callback(value), 300);
    input.addEventListener('input', (e) => {
      debouncedCallback(parseFloat(e.target.value));
    });

    container.appendChild(labelEl);
    container.appendChild(input);
    this.panel.appendChild(container);
  }

  addVector3Input(label, initialValues, callback) {
    const container = document.createElement('div');
    container.style.marginBottom = '5px';

    const labelEl = document.createElement('div');
    labelEl.textContent = label + ':';
    labelEl.style.fontSize = '10px';
    labelEl.style.color = '#ccc';
    labelEl.style.marginBottom = '3px';
    container.appendChild(labelEl);

    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = '3px';

    const coords = ['x', 'y', 'z'];
    const inputs = {};

    coords.forEach(coord => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.alignItems = 'center';

      const coordLabel = document.createElement('label');
      coordLabel.textContent = coord.toUpperCase();
      coordLabel.style.fontSize = '8px';
      coordLabel.style.color = '#999';
      coordLabel.style.marginBottom = '1px';

      const input = document.createElement('input');
      input.type = 'number';
      input.value = initialValues[coord].toFixed(2);
      input.step = '0.1';
      input.style.width = '50px';
      input.style.background = '#222';
      input.style.border = '1px solid #555';
      input.style.color = 'white';
      input.style.fontSize = '9px';
      input.style.padding = '2px';
      input.style.borderRadius = '2px';
      input.style.textAlign = 'center';

      inputs[coord] = input;

      const debouncedVectorCallback = debounce((values) => callback(values), 300);
      input.addEventListener('input', () => {
        const values = {
          x: parseFloat(inputs.x.value),
          y: parseFloat(inputs.y.value),
          z: parseFloat(inputs.z.value)
        };
        debouncedVectorCallback(values);
      });

      wrapper.appendChild(coordLabel);
      wrapper.appendChild(input);
      inputContainer.appendChild(wrapper);
    });

    container.appendChild(inputContainer);
    this.panel.appendChild(container);
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.panel.style.display = this.isExpanded ? 'block' : 'none';
    this.toggleButton.textContent = this.isExpanded ? '✕ Dev Controls' : 'Dev Controls';
  }

  // Update methods for camera and lighting
  updateCameraPosition(values) {
    this.camera.position.set(values.x, values.y, values.z);
    console.log('Camera position updated:', values);
  }

  updateCameraTarget(values) {
    this.cameraController.cameraTarget.set(values.x, values.y, values.z);
    this.camera.lookAt(this.cameraController.cameraTarget);
    console.log('Camera target updated:', values);
  }

  updateCameraRadius(value) {
    this.cameraController.cameraRadius = value;
    console.log('Camera radius updated:', value);
  }

  updateCameraHeight(value) {
    this.cameraController.cameraHeight = value;
    console.log('Camera height updated:', value);
  }

  updateAmbientLight(intensity) {
    if (this.ambientLight) {
      this.ambientLight.intensity = intensity;
      console.log('Ambient light intensity updated:', intensity);
    }
  }

  updateDirectionalLight1(values) {
    if (this.directionalLight1) {
      this.directionalLight1.position.set(values.x, values.y, values.z);
      console.log('Directional light 1 position updated:', values);
    }
  }

  updateDirectionalLight1Intensity(intensity) {
    if (this.directionalLight1) {
      this.directionalLight1.intensity = intensity;
      console.log('Directional light 1 intensity updated:', intensity);
    }
  }

  updateDirectionalLight2(values) {
    if (this.directionalLight2) {
      this.directionalLight2.position.set(values.x, values.y, values.z);
      console.log('Directional light 2 position updated:', values);
    }
  }

  updateDirectionalLight2Intensity(intensity) {
    if (this.directionalLight2) {
      this.directionalLight2.intensity = intensity;
      console.log('Directional light 2 intensity updated:', intensity);
    }
  }

  updateSpotlight(values) {
    if (this.spotlight) {
      this.spotlight.position.set(values.x, values.y, values.z);
      console.log('Spotlight position updated:', values);
    }
  }

  updateSpotlightIntensity(intensity) {
    if (this.spotlight) {
      this.spotlight.intensity = intensity;
      console.log('Spotlight intensity updated:', intensity);
    }
  }

  updateSpotlightAngle(angle) {
    if (this.spotlight) {
      this.spotlight.angle = angle;
      console.log('Spotlight angle updated:', angle);
    }
  }

  updatePointLight(values) {
    if (this.pointLight) {
      this.pointLight.position.set(values.x, values.y, values.z);
      console.log('Point light position updated:', values);
    }
  }

  updatePointLightIntensity(intensity) {
    if (this.pointLight) {
      this.pointLight.intensity = intensity;
      console.log('Point light intensity updated:', intensity);
    }
  }

  // Helper toggle methods
  toggleAxesHelper(show) {
    const existing = this.scene.children.find(child => child.type === 'AxesHelper');
    if (show && !existing) {
      this.axesHelper = new THREE.AxesHelper(5);
      this.scene.add(this.axesHelper);
    } else if (!show && existing) {
      this.scene.remove(existing);
    }
  }

  toggleGridHelper(show) {
    const existing = this.scene.children.find(child => child.type === 'GridHelper');
    if (show && !existing) {
      this.gridHelper = new THREE.GridHelper(20, 20);
      this.scene.add(this.gridHelper);
    } else if (!show && existing) {
      this.scene.remove(existing);
    }
  }

  toggleLightHelpers(show) {
    if (show) {
      // Add helpers for all lights
      this.scene.children.forEach(child => {
        if (child.type === 'DirectionalLight') {
          const helper = new THREE.DirectionalLightHelper(child, 2);
          this.scene.add(helper);
          this.lightHelpers.push(helper);
        } else if (child.type === 'SpotLight') {
          const helper = new THREE.SpotLightHelper(child);
          this.scene.add(helper);
          this.lightHelpers.push(helper);
        } else if (child.type === 'PointLight') {
          const helper = new THREE.PointLightHelper(child, 1);
          this.scene.add(helper);
          this.lightHelpers.push(helper);
        }
      });
    } else {
      // Remove all light helpers
      this.lightHelpers.forEach(helper => {
        this.scene.remove(helper);
      });
      this.lightHelpers = [];
    }
  }

  toggleWireframe(enabled) {
    this.scene.traverse((object) => {
      if (object.isMesh && object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => {
            material.wireframe = enabled;
          });
        } else {
          object.material.wireframe = enabled;
        }
      }
    });
  }

  toggleFPS(show) {
    if (show && !this.fpsDisplay) {
      this.fpsDisplay = document.createElement('div');
      this.fpsDisplay.style.position = 'fixed';
      this.fpsDisplay.style.top = '20px';
      this.fpsDisplay.style.right = '20px';
      this.fpsDisplay.style.background = 'rgba(0, 0, 0, 0.8)';
      this.fpsDisplay.style.color = 'white';
      this.fpsDisplay.style.padding = '8px';
      this.fpsDisplay.style.borderRadius = '5px';
      this.fpsDisplay.style.fontFamily = 'monospace';
      this.fpsDisplay.style.fontSize = '12px';
      this.fpsDisplay.style.zIndex = '1000';
      document.body.appendChild(this.fpsDisplay);
      this.startFPSCounter();
    } else if (!show && this.fpsDisplay) {
      this.fpsDisplay.remove();
      this.fpsDisplay = null;
      this.stopFPSCounter();
    }
  }

  startFPSCounter() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsInterval = setInterval(() => {
      const now = performance.now();
      const fps = Math.round(this.frameCount * 1000 / (now - this.lastTime));
      if (this.fpsDisplay) {
        this.fpsDisplay.textContent = `FPS: ${fps}`;
      }
      this.frameCount = 0;
      this.lastTime = now;
    }, 1000);
  }

  stopFPSCounter() {
    if (this.fpsInterval) {
      clearInterval(this.fpsInterval);
      this.fpsInterval = null;
    }
  }

  updateFPS() {
    if (this.fpsDisplay) {
      this.frameCount++;
    }
  }

  // Debug methods
  logCameraPosition() {
    console.log('Camera Position:', this.camera.position);
    console.log('Camera Rotation:', this.camera.rotation);
    console.log('Camera Target:', this.cameraController.cameraTarget);
  }

  resetCamera() {
    this.camera.position.set(-8, 11, 0.6);
    this.camera.lookAt(0, 1, 0);
    this.cameraController.currentRotationY = Math.atan2(-8, 0.6);
    this.cameraController.targetRotationY = this.cameraController.currentRotationY;
  }

  logSceneInfo() {
    console.log('Scene children:', this.scene.children.length);
    console.log('Scene:', this.scene);
    this.scene.children.forEach((child, index) => {
      console.log(`Child ${index}:`, child.type, child.name || 'unnamed');
    });
  }

  logRenderInfo() {
    console.log('Renderer info:', this.renderer.info);
    console.log('Memory:', this.renderer.info.memory);
    console.log('Render:', this.renderer.info.render);
  }

  destroy() {
    if (this.container) {
      this.container.remove();
    }
    if (this.fpsDisplay) {
      this.fpsDisplay.remove();
    }
    this.stopFPSCounter();
  }
}
