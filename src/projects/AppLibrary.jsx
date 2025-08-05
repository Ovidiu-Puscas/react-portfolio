import React, { useState } from 'react';
import ProjectCard from './components/ProjectCard';
import EsignatureApp from './01-e-signature-app/EsignatureApp';
import Title from './components/Title';
import Description from './components/Description';
import SEO from '../components/SEO';
import ComplementaryColorApp from './02-complementary-colors/ComplementaryColorsApp';
import LikePhotoApp from './03-like-my-photo/LikePhotoApp';
import TaxCalculatorApp from './04-tax-calculator/TaxCalculatorApp';
import RoadBuilderPuzzleApp from './05-road-builder-puzzle/RoadBuilderPuzzleApp';
import ReactThreejsApp from './06-react-threejs/ReactThreejsApp';
import TaskManagerApp from './07-fullstack-task-manager/TaskManagerApp';

const AppLibrary = () => {
  const [selectedApp, setSelectedApp] = useState(null);

  const apps = [
    {
      id: 'task-manager',
      title: 'Full-Stack Task Manager',
      description:
        'Complete enterprise-grade task management with Firebase backend, real-time collaboration, drag-and-drop kanban boards, user authentication, and project management. Demonstrates full-stack development skills.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      color: 'blue',
      component: TaskManagerApp,
    },
    {
      id: 'e-signature',
      title: 'E-Signature App',
      description:
        'Create and sign documents electronically with real-time PDF preview. Features digital signature capture, document editing, and secure PDF generation.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
      color: 'green',
      component: EsignatureApp,
    },
    {
      id: 'complementary-color',
      title: 'Color Harmony Generator',
      description:
        'Discover perfect color combinations with an interactive color wheel. Features complementary, triadic, and analogous color schemes with live preview.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.636-1.636a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      color: 'purple',
      component: ComplementaryColorApp,
    },
    {
      id: 'react-threejs',
      title: '3D Canvas Painter',
      description:
        'Paint and draw in immersive 3D space using Three.js. Features dynamic lighting, color palette selection, brush controls, and shape-drawing challenges.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
      color: 'indigo',
      component: ReactThreejsApp,
    },
    {
      id: 'tax-calculator',
      title: 'Romanian Tax Calculator',
      description:
        'Calculate monthly income and taxes for Micro SRL in Romania. Features real-time exchange rates, detailed breakdowns, and 2025-2026 tax compliance.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'red',
      component: TaxCalculatorApp,
    },
    {
      id: 'road-builder-puzzle',
      title: 'Road Builder Puzzle',
      description:
        'Strategic sliding puzzle game where you arrange road tiles to create paths. Features intelligent pathfinding validation, dynamic animations, and progressive difficulty.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: 'orange',
      component: RoadBuilderPuzzleApp,
    },
    {
      id: 'like-my-photo',
      title: 'Interactive Photo Gallery',
      description:
        'Engaging photo interaction app with animated hearts, like counters, and smooth transitions. Features responsive grid layout and gesture-based interactions.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      color: 'blue',
      component: LikePhotoApp,
    },
    // Add more apps here as you create them
  ];

  const handleAppSelect = (app) => {
    if (app.component) {
      setSelectedApp(app);
    } else {
      // For coming soon apps, show console message
      console.warn(`${app.title} is coming soon!`);
    }
  };

  const handleBackToLibrary = () => {
    setSelectedApp(null);
  };

  // If an app is selected, render it
  if (selectedApp) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEO
          title={`${selectedApp.title} - React Portfolio`}
          description={selectedApp.description}
          keywords={`React, ${selectedApp.title}, Web Development, Interactive App`}
          url={`https://xtreemedigital.com/react-portofolio/app/${selectedApp.id}`}
          type="article"
        />

        {/* Header with back button and navigation */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={handleBackToLibrary}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-1 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="hidden sm:inline">Back to Library</span>
              </button>
              <Title
                title={{
                  heading: 'h1',
                  text: selectedApp.title,
                  class: 'text-lg sm:text-xl font-semibold text-gray-900',
                }}
              />
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/Ovidiu-Puscas/react-portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  title="View on GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://xtreemedigital.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  title="Visit Home"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className="h-[calc(100vh-65px)] overflow-hidden flex flex-col">
          <selectedApp.component />
        </div>
      </div>
    );
  }

  // Render the library view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <SEO
        title="React Portfolio - Interactive Web Applications"
        description="Explore my collection of React applications including E-Signature tools, color generators, and interactive web projects. Built with modern React technologies."
        keywords="React, JavaScript, Web Development, Portfolio, E-Signature, Interactive Apps"
        url="https://xtreemedigital.com/react-portofolio/"
        type="website"
      />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Navigation Header */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Ovidiu-Puscas/react-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              title="View on GitHub"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="https://xtreemedigital.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              title="Visit Home"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="hidden sm:inline">Home</span>
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Title
            title={{
              heading: 'h1',
              text: 'Project Library',
              class: 'text-4xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6',
            }}
          />
          <Description
            description={{
              text: 'Explore my collection of React applications. Each project demonstrates different skills and technologies.',
              class: 'text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto px-4 leading-relaxed',
            }}
          />
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {apps.map((app) => (
            <div key={app.id} className="min-h-[320px]">
              <ProjectCard
                title={app.title}
                description={app.description}
                icon={app.icon}
                color={app.color}
                onClick={() => handleAppSelect(app)}
                isActive={false}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 text-center">
          <Description
            description={{
              text: 'More projects coming soon! Each card represents a different React application showcasing various skills and technologies.',
              class: 'text-gray-500 text-sm px-4',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AppLibrary;
