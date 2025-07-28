import React, { useState } from 'react';
import ProjectCard from './components/ProjectCard';
import EsignatureApp from './01-e-signature-app/EsignatureApp';
import Title from './components/Title';
import Description from './components/Description';
import SEO from '../components/SEO';
import ComplementaryColorApp from './02-complementary-colors/ComplementaryColorsApp';
import LikePhotoApp from './03-like-my-photo/LikePhotoApp';

const AppLibrary = () => {
  const [selectedApp, setSelectedApp] = useState(null);

  const apps = [
    {
      id: 'e-signature',
      title: 'E-Signature App',
      description: 'Create and sign documents electronically with real-time PDF preview. Features digital signature capture, document editing, and PDF generation.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      color: 'blue',
      component: EsignatureApp
    },
    {
      //Complementary Color Generator
      id: 'complementary-color',
      title: 'Complementary Color Generator',
      description: 'Generate complementary colors for any given color. Features a color picker and a color palette.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.636-1.636a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      color: 'green',
      component: ComplementaryColorApp
    },
    {
      id: 'like-my-photo',
      title: 'Like My Photo',
      description: 'Like My Photo',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'purple',
      component: LikePhotoApp
    },
    // Add more apps here as you create them
  ];

  const handleAppSelect = (app) => {
    if (app.component) {
      setSelectedApp(app);
    } else {
      // For coming soon apps, show a notification or modal
      alert(`${app.title} is coming soon!`);
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
        
        {/* Header with back button */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={handleBackToLibrary}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back to Library</span>
              </button>
              <Title title={{ heading: 'h1', text: selectedApp.title, class: 'text-lg sm:text-xl font-semibold text-gray-900' }} />
              <div className="w-16 sm:w-20"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>
        
        {/* App Content */}
        <div className="h-[calc(100vh-65px)]">
          <selectedApp.component />
        </div>
      </div>
    );
  }

  // Render the library view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SEO 
        title="React Portfolio - Interactive Web Applications"
        description="Explore my collection of React applications including E-Signature tools, color generators, and interactive web projects. Built with modern React technologies."
        keywords="React, JavaScript, Web Development, Portfolio, E-Signature, Interactive Apps"
        url="https://xtreemedigital.com/react-portofolio/"
        type="website"
      />
      
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Title title={{ heading: 'h1', text: 'Project Library', class: 'text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4' }} />
          <Description description={{ text: 'Explore my collection of React applications. Each project demonstrates different skills and technologies.', class: 'text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4' }} />
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <ProjectCard
              key={app.id}
              title={app.title}
              description={app.description}
              icon={app.icon}
              color={app.color}
              onClick={() => handleAppSelect(app)}
              isActive={false}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 text-center">
          <Description description={{ text: 'More projects coming soon! Each card represents a different React application showcasing various skills and technologies.', class: 'text-gray-500 text-sm px-4' }} />
        </div>
      </div>
    </div>
  );
};

export default AppLibrary; 