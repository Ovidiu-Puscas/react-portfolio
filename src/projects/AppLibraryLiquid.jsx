import React, { useState, Suspense } from 'react';
import SEO from '../components/SEO';
import { LiquidGlassCard, LiquidGlassButton, LiquidGlassNav } from '../components/LiquidGlass';
import LiquidBlob from '../components/LiquidBlob/LiquidBlob';
import './AppLibraryLiquid.css';

// Lazy load all project components for code splitting
const EsignatureApp = React.lazy(() => import('./01-e-signature-app/EsignatureApp'));
const ComplementaryColorApp = React.lazy(() => import('./02-complementary-colors/ComplementaryColorsApp'));
const LikePhotoApp = React.lazy(() => import('./03-like-my-photo/LikePhotoApp'));
const TaxCalculatorApp = React.lazy(() => import('./04-tax-calculator/TaxCalculatorApp'));
const RoadBuilderPuzzleApp = React.lazy(() => import('./05-road-builder-puzzle/RoadBuilderPuzzleApp'));
const ReactThreejsApp = React.lazy(() => import('./06-react-threejs/ReactThreejsApp'));
const TaskManagerApp = React.lazy(() => import('./07-fullstack-task-manager/TaskManagerApp'));

// Loading component for lazy-loaded apps
const AppLoadingFallback = () => (
  <div className="liquid-loading-container">
    <div className="liquid-loading-spinner">
      <div className="liquid-spinner"></div>
    </div>
    <p className="liquid-loading-text">Loading application...</p>
  </div>
);

const AppLibraryLiquid = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [hoveredApp, setHoveredApp] = useState(null);

  const apps = [
    {
      id: 'task-manager',
      title: 'Full-Stack Task Manager',
      description: 'Complete enterprise-grade task management with Firebase backend, real-time collaboration, drag-and-drop kanban boards, user authentication, and project management.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      component: TaskManagerApp
    },
    {
      id: 'e-signature',
      title: 'E-Signature App',
      description: 'Create and sign documents electronically with real-time PDF preview.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #667eea 0%, #10b981 100%)',
      component: EsignatureApp
    },
    {
      id: 'complementary-color',
      title: 'Color Harmony Generator',
      description: 'Discover perfect color combinations with an interactive color wheel.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.636-1.636a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      component: ComplementaryColorApp
    },
    {
      id: 'like-photo',
      title: 'Interactive Photo Gallery',
      description: 'Social media-style photo interaction with likes and animations.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      component: LikePhotoApp
    },
    {
      id: 'tax-calculator',
      title: 'Tax & Currency Calculator',
      description: 'Real-time tax calculations with live currency conversion rates.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      component: TaxCalculatorApp
    },
    {
      id: 'road-builder',
      title: 'Road Builder Puzzle',
      description: 'Strategic puzzle game with pathfinding and level progression.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
      ),
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      component: RoadBuilderPuzzleApp
    },
    {
      id: 'react-threejs',
      title: '3D Paint Studio',
      description: 'Create 3D artwork with Three.js, featuring brush tools and real-time rendering.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #667eea 0%, #06b6d4 100%)',
      component: ReactThreejsApp
    }
  ];

  if (selectedApp) {
    const AppComponent = selectedApp.component;
    return (
      <div className="liquid-app-container">
        {/* Same unified blob container for app views */}
        <div className="unified-blob-container">
          <LiquidBlob
            size={380}
            color1="#667eea"
            color2="#764ba2"
            color3="#f093fb"
            color4="#f5576c"
            animationDuration="25s"
            className="unified-blob unified-blob-1"
          />
          <LiquidBlob
            size={320}
            color1="#06b6d4"
            color2="#3b82f6"
            color3="#8b5cf6"
            color4="#ec4899"
            animationDuration="30s"
            className="unified-blob unified-blob-2"
          />
          <LiquidBlob
            size={400}
            color1="#10b981"
            color2="#f59e0b"
            color3="#ef4444"
            color4="#8b5cf6"
            animationDuration="35s"
            className="unified-blob unified-blob-3"
          />
          <LiquidBlob
            size={340}
            color1="#ff6b35"
            color2="#f7931e"
            color3="#ffcc02"
            color4="#feff9c"
            animationDuration="40s"
            className="unified-blob unified-blob-4"
          />
          <LiquidBlob
            size={400}
            color1="#f093fb"
            color2="#3b82f6"
            color3="#f5576c"
            color4="#06b6d4"
            animationDuration="45s"
            className="unified-blob unified-blob-5"
          />
        </div>

        <LiquidGlassNav className="liquid-nav-header">
          <LiquidGlassButton onClick={() => setSelectedApp(null)} className="liquid-back-button">
            <svg className="w-4 h-4" fill="none" stroke="black" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </LiquidGlassButton>
          <span className="liquid-nav-title">{selectedApp.title}</span>
        </LiquidGlassNav>
        <div className="liquid-app-content">
          <Suspense fallback={<AppLoadingFallback />}>
            <AppComponent />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="liquid-library-container">
      {/* Single unified blob container behind everything */}
      <div className="unified-blob-container">
        <LiquidBlob
          size={380}
          color1="#667eea"
          color2="#764ba2"
          color3="#f093fb"
          color4="#f5576c"
          animationDuration="25s"
          className="unified-blob unified-blob-1"
        />
        <LiquidBlob
          size={320}
          color1="#06b6d4"
          color2="#3b82f6"
          color3="#8b5cf6"
          color4="#ec4899"
          animationDuration="30s"
          className="unified-blob unified-blob-2"
        />
        <LiquidBlob
          size={400}
          color1="#10b981"
          color2="#f59e0b"
          color3="#ef4444"
          color4="#8b5cf6"
          animationDuration="35s"
          className="unified-blob unified-blob-3"
        />
        <LiquidBlob
          size={340}
          color1="#ff6b35"
          color2="#f7931e"
          color3="#ffcc02"
          color4="#feff9c"
          animationDuration="40s"
          className="unified-blob unified-blob-4"
        />
        <LiquidBlob
          size={400}
          color1="#f093fb"
          color2="#3b82f6"
          color3="#f5576c"
          color4="#06b6d4"
          animationDuration="45s"
          className="unified-blob unified-blob-5"
        />
      </div>

      <SEO
        title="Interactive App Portfolio"
        description="Modern web applications showcasing React, Three.js, Firebase, and innovative UI/UX design"
      />

      <div className="liquid-hero-section">
        <div className="liquid-hero-content">
          <h1 className="liquid-hero-title">
            <span className="liquid-gradient-text">Interactive</span> Portfolio
          </h1>
          <p className="liquid-hero-subtitle">
            Explore modern web applications with cutting-edge technologies
          </p>
        </div>
      </div>

      <div className="liquid-apps-grid">
        {apps.map((app) => (
          <LiquidGlassCard
            key={app.id}
            className="liquid-app-card"
            animated={hoveredApp === app.id}
            onMouseEnter={() => setHoveredApp(app.id)}
            onMouseLeave={() => setHoveredApp(null)}
            onClick={() => setSelectedApp(app)}
            style={{
              '--app-color': app.color,
              '--app-gradient': app.gradient
            }}
          >
            <div className="liquid-app-icon" style={{ color: app.color }}>
              {app.icon}
            </div>
            <h3 className="liquid-app-title">{app.title}</h3>
            <p className="liquid-app-description">{app.description}</p>
            <div className="liquid-app-footer">
              <LiquidGlassButton className="liquid-launch-button">
                Launch App
                <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </LiquidGlassButton>
            </div>
          </LiquidGlassCard>
        ))}
      </div>

      {/* Side Panel Navigation */}
      <div className="liquid-side-panel">
        <LiquidGlassCard className="liquid-side-panel-card">
          <LiquidGlassButton
            onClick={() => window.location.href = 'https://xtreemedigital.com/'}
            className="liquid-app-nav-button"
            title="Home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </LiquidGlassButton>
          <LiquidGlassButton
            onClick={() => window.open('https://github.com/Ovidiu-Puscas/react-portfolio', '_blank')}
            className="liquid-app-nav-button"
            title="GitHub Repository"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </LiquidGlassButton>
        </LiquidGlassCard>
      </div>

      <footer className="liquid-footer">
        <LiquidGlassCard className="liquid-footer-card">
          <p>Built with React, Three.js, Firebase, and Liquid Glass Design System</p>
        </LiquidGlassCard>
      </footer>
    </div>
  );
};

export default AppLibraryLiquid;
