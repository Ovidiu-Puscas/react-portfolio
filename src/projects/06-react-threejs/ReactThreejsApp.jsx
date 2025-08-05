import React, { useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// Import the GLB file as a URL

// Import modular components
import { ColorPalette } from './classes/ColorPalette';
import { CameraController } from './components/CameraController';
import { PaintingSystem } from './components/PaintingSystem';
import { ShapeChallenge } from './classes/ShapeChallenge';
import GameUIComponent from './components/GameUIComponent';
import { SCENE_CONFIG } from './config/settings';
import ErrorFallback from '../../components/ErrorFallback';
import { logError } from '../../utils/errorLogger';

const ReactThreejsApp = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const [shapeChallenge, setShapeChallenge] = useState(null);
  const [paintingSystem, setPaintingSystem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return;

    // Clean up any existing renderer/canvas
    while (mountElement.firstChild) {
      mountElement.removeChild(mountElement.firstChild);
    }

    // React GameUI component will clean up automatically

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue background
    sceneRef.current = scene;

    // Add visual helpers
    const axesHelper = new THREE.AxesHelper(SCENE_CONFIG.axesSize);
    scene.add(axesHelper);
    const gridHelper = new THREE.GridHelper(SCENE_CONFIG.gridSize, SCENE_CONFIG.gridDivisions);
    scene.add(gridHelper);

    // Enhanced lighting setup - positioned behind camera
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Main directional light from behind camera (camera is at -8, 11, 0.6)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(-12, 15, 8); // Behind and above camera
    dirLight.target.position.set(0, 1, 0); // Aimed at scene center
    dirLight.castShadow = true;
    scene.add(dirLight);
    scene.add(dirLight.target);

    // Secondary directional light from camera's right side
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight2.position.set(-15, 12, -5); // Behind camera, to the right
    dirLight2.target.position.set(0, 1, 0);
    scene.add(dirLight2);
    scene.add(dirLight2.target);

    // Spotlight from above-behind camera, focused on canvas
    const spotlight = new THREE.SpotLight(0xffffff, 2.0);
    spotlight.position.set(-10, 18, 5); // High behind camera
    spotlight.target.position.set(0, 1, 0); // Aimed at canvas area
    spotlight.angle = Math.PI / 4; // Wider angle
    spotlight.penumbra = 0.2;
    spotlight.decay = 1;
    spotlight.distance = 25;
    scene.add(spotlight);
    scene.add(spotlight.target);

    // Point light behind camera for general illumination
    const pointLight = new THREE.PointLight(0xffffff, 1.2, 20);
    pointLight.position.set(-10, 13, 3); // Behind camera position
    scene.add(pointLight);

    // Create camera and renderer with initial size
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;

    // Initialize components
    const cameraController = new CameraController(camera, renderer);
    const paintingSystemInstance = new PaintingSystem();
    const colorPalette = new ColorPalette(scene);

    // Initialize game system
    const shapeChallengeInstance = new ShapeChallenge();
    setShapeChallenge(shapeChallengeInstance);
    setPaintingSystem(paintingSystemInstance);

    // Set up component connections
    paintingSystemInstance.setCamera(camera);
    paintingSystemInstance.setRenderer(renderer);
    paintingSystemInstance.setColorPalette(colorPalette);
    paintingSystemInstance.setShapeChallenge(shapeChallengeInstance);

    // Create and initialize the color palette
    colorPalette.create();

    // Initialize developer controls (hidden for now)
    // const devControls = new DevControls(scene, camera, renderer, paintingSystemInstance, cameraController, colorPalette, shapeChallengeInstance);
    // devControlsRef.current = devControls;

    // Load GLB model
    const loader = new GLTFLoader();
    let model;

    loader.load(
      '/assets/art-easel-set-up.glb',
      (gltf) => {
        model = gltf.scene;
        model.scale.set(1, 1, 1);
        scene.add(model);

        // Find the canvas mesh by name
        const canvasMesh = model.getObjectByName('Cube015');

        // Set up painting system with canvas mesh
        paintingSystemInstance.setCanvasMesh(canvasMesh);

        // Loading complete
        setIsLoading(false);
      },
      (_xhr) => {
        // GLB loading progress
      },
      (error) => {
        console.error('An error happened loading the GLB:', error);
        setIsLoading(false); // Stop loading on error
      }
    );

    // Attach renderer to DOM and set initial size
    mountElement.appendChild(renderer.domElement);

    // Responsive resize
    const handleResize = () => {
      if (!mountElement) return;
      const width = mountElement.clientWidth;
      const height = mountElement.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      cameraController.onResize();
    };

    window.addEventListener('resize', handleResize);

    // Use requestAnimationFrame to ensure mount dimensions are available
    requestAnimationFrame(() => {
      handleResize();
    });

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Update components
      cameraController.update();
      colorPalette.update();

      // Update FPS counter if enabled (dev controls hidden)
      // if (devControlsRef.current) {
      //   devControlsRef.current.updateFPS();
      // }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      // Clean up CameraController
      cameraController.destroy();

      // Clean up PaintingSystem
      paintingSystemInstance.destroy();

      // React GameUI component will clean up automatically

      if (mountElement && renderer.domElement) {
        mountElement.removeChild(renderer.domElement);
      }
      renderer.dispose();

      // Clean up Three.js objects
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error, errorInfo) => {
        logError(error, errorInfo, { component: 'ReactThreejsApp' });
      }}
    >
      <div className="w-full h-full overflow-hidden flex flex-col rounded-xl">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg font-semibold">Loading 3D Scene...</p>
              <p className="text-sm opacity-75">Please wait while we load the canvas</p>
            </div>
          </div>
        )}
        <div
          ref={mountRef}
          className="flex-grow w-full overflow-hidden relative"
          style={{ minHeight: 0 }}
        />
        <GameUIComponent
          shapeChallenge={shapeChallenge}
          paintingSystem={paintingSystem}
          isVisible={!isLoading}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ReactThreejsApp;
