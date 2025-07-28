import React, { useState } from 'react';
import Title from './Title';
import Description from './Description';

const ProjectCard = ({ 
  title, 
  description, 
  icon, 
  color = 'blue', 
  onClick, 
  isActive = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorVariants = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
  };

  return (
    <div className="relative group">
      {/* Card */}
      <div
        className={`
          relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform
          ${isActive 
            ? 'scale-105 shadow-2xl ring-4 ring-blue-400 ring-opacity-50' 
            : 'hover:scale-105 hover:shadow-xl'
          }
          bg-gradient-to-br ${colorVariants[color]}
          ${isHovered ? 'shadow-2xl' : 'shadow-lg'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        {/* Content */}
        <div className="relative p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              {icon}
            </div>
            {isActive && (
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            )}
          </div>
          
          <Title title={{ heading: 'h3', text: title, class: 'text-xl font-bold mb-2' }} />
          <Description description={{ text: description, class: 'text-white/80 text-sm line-clamp-2' }} />
          
          {/* Hover Effect Overlay */}
          <div className={`
            absolute inset-0 bg-gradient-to-br from-white/10 to-transparent 
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}></div>
        </div>
        
        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
      </div>
    </div>
  );
};

export default ProjectCard; 