# React Portfolio - Project Library

A modern React portfolio showcasing various applications and projects. This repository contains a collection of React applications, each demonstrating different skills and technologies.

## Features

- **Modern Card-Based Library**: Browse projects through an elegant card-based interface with hover effects and smooth animations
- **Responsive Design**: Mobile-first approach that works seamlessly on desktop, tablet, and mobile devices
- **Component-Based Architecture**: Modular React components with proper separation of concerns
- **State Management**: Modern React hooks for efficient state management
- **Interactive UI**: Smooth transitions, hover effects, and modern design patterns
- **Project Isolation**: Each app runs independently with its own navigation and state

## Current Projects

### E-Signature App
A comprehensive digital signature application demonstrating advanced React skills:

**Core Features:**
- Real-time signature capture using React Signature Canvas
- Dynamic document editing with controlled components
- PDF generation and preview using @react-pdf/renderer
- Responsive layout with mobile-first design
- Form validation and user feedback

**React Skills Demonstrated:**
- **State Management**: useState for form data, signature state, and app navigation
- **Refs**: useRef for direct canvas manipulation
- **Component Composition**: Modular PDF generation and signature components
- **Conditional Rendering**: Dynamic UI based on signature state
- **Event Handling**: Form interactions and signature capture
- **Responsive Design**: Tailwind CSS with mobile-first breakpoints

**Technical Implementation:**
- Real-time signature data URL conversion
- PDF document generation with custom styling
- Responsive grid layout with proper mobile optimization
- Modern UI with gradients, shadows, and smooth transitions

### Coming Soon
- Task Manager with drag-and-drop functionality
- Weather Dashboard with real-time data
- Chat Application with real-time messaging
- E-Commerce Store with full shopping features
- Portfolio Gallery with interactive galleries

## Technology Stack

### Core Technologies
- **React 19.1.0**: Latest React features with modern hooks and patterns
- **React DOM 19.1.0**: Latest DOM rendering capabilities
- **Tailwind CSS 3.4.17**: Utility-first CSS framework for responsive design

### Signature & PDF Functionality
- **react-signature-canvas 1.1.0-alpha.2**: Digital signature capture and manipulation
- **@react-pdf/renderer 4.3.0**: PDF generation, preview, and download capabilities

### Development Tools
- **Create React App 5.0.1**: Modern React development environment
- **PostCSS 8.5.6**: CSS processing and optimization
- **Autoprefixer 10.4.21**: CSS vendor prefixing

### Testing
- **@testing-library/react 16.3.0**: React component testing
- **@testing-library/dom 10.4.1**: DOM testing utilities
- **@testing-library/user-event 13.5.0**: User interaction testing
- **@testing-library/jest-dom 6.6.4**: Custom Jest matchers

## React Skills Portfolio

This project demonstrates proficiency in:

### Modern React Patterns
- **Functional Components**: All components use modern functional syntax
- **Hooks**: useState, useRef, and custom hook patterns
- **Component Composition**: Modular, reusable component architecture
- **State Management**: Efficient local state management with React hooks

### UI/UX Development
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Modern Animations**: Smooth transitions and hover effects
- **Accessibility**: Proper form labels and semantic HTML
- **User Experience**: Intuitive navigation and feedback systems

### Technical Implementation
- **PDF Generation**: Real-time PDF creation with custom styling
- **Canvas Manipulation**: Direct canvas API usage for signature capture
- **Data Handling**: Form state management and data validation
- **File Operations**: PDF download and preview functionality

### Code Quality
- **Component Structure**: Clean separation of concerns
- **Reusable Components**: Modular design for scalability
- **Modern JavaScript**: ES6+ features and async patterns
- **CSS Architecture**: Utility-first styling with Tailwind

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd react-portofolio

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production with optimization and minification.

### `npm run eject`
**Note: This is a one-way operation!**
Removes the single build dependency and copies configuration files into the project.

## Project Structure

```
src/
├── App.js                 # Main application component
├── App.css               # Global styles
├── index.js              # Application entry point
└── projects/
    ├── AppLibrary.jsx    # Main project library component
    ├── components/       # Shared components
    │   ├── ProjectCard.jsx
    │   ├── Title.jsx
    │   └── Description.jsx
    └── 01-e-signature-app/
        ├── EsignatureApp.jsx
        └── components/
            ├── PDFGenerator.jsx
            ├── PDFRenderer.jsx
            └── DrawSignature.jsx
```

## Deployment

This project can be deployed to any static hosting service:

1. Run `npm run build` to create optimized production build
2. Deploy the `build` folder to your hosting service
3. Configure your hosting service to serve `index.html` for all routes

## Contributing

This is a personal portfolio project showcasing React development skills. The codebase demonstrates modern React patterns and best practices for building scalable applications.

## License

This project is for portfolio demonstration purposes.
