import React, { useState } from 'react';
import Title from './Title';
import Description from './Description';

const ProjectCard = ({ title, description, icon, color = 'blue', onClick, isActive = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorVariants = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
  };

  return (
    <div className="group h-full">
      {/* Card */}
      <div
        className={`
          relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform h-full
          ${
            isActive
              ? 'scale-[1.02] shadow-2xl ring-2 ring-blue-400 ring-opacity-50'
              : 'hover:scale-[1.02] hover:shadow-xl'
          }
          bg-gradient-to-br ${colorVariants[color]}
          ${isHovered ? 'shadow-2xl' : 'shadow-lg'}
          flex flex-col
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
        <div className="relative p-6 text-white flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              {icon}
            </div>
            {isActive && <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>}
          </div>

          {/* Title */}
          <div className="mb-3">
            <Title
              title={{
                heading: 'h3',
                text: title,
                class: 'text-xl font-bold text-white leading-tight',
              }}
            />
          </div>

          {/* Description - flexible height */}
          <div className="flex-grow flex items-start">
            <Description
              description={{
                text: description,
                class: 'text-white/85 text-sm leading-relaxed line-clamp-3',
              }}
            />
          </div>

          {/* Action indicator */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-white/70 text-xs">
              <span>Click to explore</span>
              <svg
                className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div
            className={`
            absolute inset-0 bg-gradient-to-br from-white/10 to-transparent 
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          ></div>
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
      </div>
    </div>
  );
};

export default ProjectCard;
