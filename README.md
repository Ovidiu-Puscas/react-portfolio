# React Portfolio - Project Library

A modern React portfolio showcasing various applications and projects with a **modular component architecture**. This repository contains a collection of React applications, each demonstrating different skills and technologies using reusable, maintainable component patterns.

## 🏗️ Modular Architecture

This portfolio follows a **component-driven development** approach with three levels of reusability:

### 📦 Global Components (`src/components/`)

Reusable components shared across the entire application:

- **SEO.jsx** - Dynamic meta tags and SEO optimization

### 🔗 Project-Shared Components (`src/projects/components/`)

Components shared between projects:

- **Title.jsx** - Consistent heading components (h1-h6)
- **Description.jsx** - Standardized description/paragraph component
- **ProjectCard.jsx** - Interactive project cards with hover effects
- **GameStats.jsx** - Configurable stats display with action buttons
- **Button.jsx** - Flexible button component with multiple variants

### 🎯 App-Specific Components

Each project maintains specialized components in its own folder for unique functionality.

## Features

- **Liquid Glass Design System**: Apple-inspired interface with sophisticated glass morphism effects, backdrop blur, and premium visual aesthetics
- **Dynamic Parallax Background**: Multi-layered animated blob system with depth-based motion simulation and smooth scroll parallax effects
- **Enhanced Interactive Cards**: Premium glass-styled project cards with subtle shine animations, hover transformations, and refined visual feedback
- **App-Style Navigation Panel**: Fixed side panel with square navigation buttons for home and GitHub access
- **Responsive Design**: Mobile-first approach with optimized layouts for desktop, tablet, and mobile devices with adaptive blob positioning
- **Component-Based Architecture**: Modular React components with proper separation of concerns
- **State Management**: Modern React hooks for efficient state management
- **Advanced Visual Effects**: Sophisticated animations, smooth transitions, and modern design patterns
- **Project Isolation**: Each app runs independently with its own navigation and state
- **⚡ Performance Optimized**: Code splitting reduces main bundle from 977KB to 51KB (94.7% reduction) with lazy loading
- **📦 Smart Bundle Management**: Large dependencies (Three.js, Firebase, Material-UI) load only when needed

## Current Projects

### ⭐ Full-Stack Task Manager **New Enterprise-Grade Application**

A complete enterprise-grade task management application demonstrating modern full-stack development with React and Firebase:

**Core Features:**

- Full user authentication system with Firebase Auth (email/password)
- Real-time collaborative project management with Firestore
- Drag-and-drop kanban board with @hello-pangea/dnd library
- Complete CRUD operations for projects and tasks
- Real-time updates and live synchronization across browser sessions
- Professional Material-UI design system with responsive layout
- Sample data system for immediate demo functionality

**React + Firebase Skills Demonstrated:**

- **Full-Stack Architecture**: Complete React frontend with Firebase backend integration
- **Real-time Database**: Firestore listeners for live data synchronization
- **Authentication System**: Firebase Auth with protected routes and user management
- **State Management**: Complex state coordination with custom React hooks
- **Drag-and-Drop**: Advanced kanban board with @hello-pangea/dnd integration
- **Component Architecture**: Enterprise-level component organization and reusability
- **Material-UI Integration**: Professional design system with consistent theming

**Technical Implementation:**

- **Firebase Integration**: Authentication, Firestore database, and real-time listeners
- **Drag-and-Drop System**: Clean implementation following @hello-pangea/dnd best practices
- **Custom Hooks**: useAuth, useProjects, useTasks for state management and API integration
- **Real-time Collaboration**: Live updates when multiple users work on the same project
- **Error Handling**: Comprehensive error handling with LocalStorage fallback
- **Responsive Design**: Mobile-first Material-UI components with proper responsive behavior
- **Security**: Firestore security rules and proper authentication flow

**Key Technical Achievements:**

- **Enterprise Architecture**: Modular component structure following React best practices
- **Performance Optimization**: Efficient real-time updates without unnecessary re-renders
- **Library Integration**: Successfully resolved complex drag-and-drop compatibility issues
- **Data Management**: Sophisticated task and project relationship management
- **User Experience**: Intuitive kanban board with smooth drag-and-drop interactions
- **Production Ready**: Comprehensive error handling and graceful degradation

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

### Complementary Colors App

An interactive color theory application demonstrating advanced UI/UX and color manipulation skills:

**Core Features:**

- Interactive color wheel with real-time color selection
- Complementary color calculation and display
- Color harmony analysis (analogous, triadic, split-complementary)
- Color preview with hex and RGB values
- Responsive design with mobile-optimized touch interactions

**React Skills Demonstrated:**

- **State Management**: useState for color state, harmony calculations, and UI interactions
- **Custom Hooks**: Color utility functions and harmony calculations
- **Component Composition**: Modular color picker, wheel, and display components
- **Event Handling**: Mouse and touch interactions for color selection
- **Responsive Design**: Mobile-first approach with touch-friendly controls
- **Real-time Updates**: Dynamic color calculations and preview updates

**Technical Implementation:**

- Color theory algorithms (complementary, analogous, triadic harmonies)
- Interactive SVG-based color wheel with precise color selection
- Real-time color value calculations and conversions
- Responsive layout with smooth animations and transitions
- Modern UI with gradients, shadows, and hover effects

### Like My Photo App

An interactive photo gallery application demonstrating social media-like functionality and user interaction patterns:

**Core Features:**

- Interactive photo grid with masonry layout
- Double-click to like functionality with heart animations
- Real-time like counter updates
- Responsive masonry grid layout
- Heart animation effects on like interaction
- Photo overlay with like indicators

**React Skills Demonstrated:**

- **Custom Hooks**: useLikePhoto hook for like state management
- **State Management**: useState for photo data and like interactions
- **Component Composition**: Modular photo card, grid, and overlay components
- **Event Handling**: Double-click interactions and like/unlike functionality
- **Responsive Design**: Masonry grid layout with responsive breakpoints
- **Animation Effects**: Heart animations and visual feedback

**Technical Implementation:**

- Custom useLikePhoto hook for like state management
- Masonry grid layout using CSS columns
- Heart animation with setTimeout for visual feedback
- Responsive design with mobile-first approach
- Photo data management with dynamic like updates
- Modern UI with hover effects and smooth transitions

### Tax Calculator App

A comprehensive financial calculator for Romanian Micro SRL tax calculations with real-time exchange rates:

**Core Features:**

- Real-time currency exchange rates via CurrencyAPI integration
- Comprehensive tax calculations for Micro SRL (2025-2026)
- Multi-currency support (USD, RON, EUR) with automatic conversion
- Configurable tax rates and exchange rates
- Responsive table layout with mobile optimization
- Live rate updates with fallback to default values

**React Skills Demonstrated:**

- **API Integration**: Real-time currency data fetching with error handling
- **State Management**: Complex state for multiple calculation parameters
- **Component Composition**: Modular calculator components (InputForm, ResultsTable, etc.)
- **Custom Hooks**: Currency service with async data fetching
- **Error Handling**: Graceful fallbacks and user feedback
- **Responsive Design**: Mobile-optimized table layout

**Technical Implementation:**

- CurrencyAPI integration for real-time exchange rates
- Complex tax calculation algorithms (CASS, dividend taxes, Micro SRL)
- Multi-currency conversion with proper formatting
- Responsive table with mobile-friendly layout
- Error handling with default fallback rates
- Modern UI with Tailwind CSS and proper loading states

**Key Features:**

- **Real-time Rates**: Automatic USD/RON/EUR exchange rate updates
- **Tax Calculations**: Micro SRL tax, dividend tax, and CASS calculations
- **Multi-year Support**: 2025 and 2026 tax scenarios
- **Currency Conversion**: Automatic conversion between USD, RON, and EUR
- **Responsive Design**: Mobile-optimized with horizontal scrolling
- **Error Resilience**: Fallback rates when API is unavailable

### React Three.js 3D Painting App ⭐ **Interactive 3D Experience with Advanced Brush System**

An immersive 3D painting application built with Three.js and React, demonstrating advanced 3D graphics programming and interactive media techniques:

**Core Features:**

- Interactive 3D canvas painting on a virtual easel using real GLB model
- **Advanced Brush System**: Smooth continuous strokes with interpolation for fast mouse movements
- Real-time brush system with adjustable size and opacity controls
- Dynamic color palette with 3D color spheres for selection
- Shape challenge game system with target drawing replication
- Advanced 3D lighting system with multiple light sources positioned behind camera
- Camera rotation controls for exploring the 3D scene from different angles
- Modern React component architecture integrated with Three.js systems
- Loading states and responsive design for optimal user experience

**React + Three.js Skills Demonstrated:**

- **3D Graphics Integration**: Seamless Three.js integration within React ecosystem
- **Canvas Texture Mapping**: Real-time painting system with UV coordinate mapping
- **3D Interaction Systems**: Mouse/touch interactions translated to 3D space coordinates
- **State Management**: Complex state coordination between React and Three.js systems
- **Component Architecture**: Clean separation between React UI and 3D rendering logic
- **Performance Optimization**: Efficient rendering loops and memory management
- **Modern React Patterns**: Hooks-based architecture with proper cleanup and lifecycle management

**Technical Implementation:**

- **Three.js Scene Management**: Professional 3D scene setup with proper lighting and camera systems
- **Real-time Texture Painting**: Canvas-based painting system mapped to 3D mesh textures with stroke interpolation
- **Brush Stroke Interpolation**: Advanced algorithm that fills gaps between mouse positions for smooth continuous strokes during fast movements
- **Interactive 3D UI**: Color palette implemented as interactive 3D spheres in scene
- **Advanced Lighting**: Multi-light setup with directional, spot, and point lights positioned behind camera
- **GLB Model Loading**: Production-ready 3D model loading with proper error handling
- **Responsive 3D Controls**: Camera rotation and scene interaction optimized for all devices
- **Memory Management**: Proper cleanup of Three.js resources and event listeners
- **Security Hardening**: XSS prevention and safe DOM manipulation practices

### Road Builder Puzzle ⭐ **Recently Refactored with Modular Architecture**

An interactive sliding puzzle game showcasing **component-driven development** and advanced pathfinding algorithms:

**Core Features:**

- Interactive 4x4 sliding tile puzzle with road tile pieces
- Dynamic car with automatic rotation based on start tile orientation
- Advanced pathfinding validation using breadth-first search algorithm
- Start and end tile validation for proper race track construction
- Visual connection editor for tile relationship configuration
- JSON export functionality for tile connection data
- Animated victory and failure feedback with explosions and confetti

**Modular Component Architecture:**

- **Global Components Used**: SEO for dynamic meta tags and SEO optimization
- **Project Components Used**: Title, Description, GameStats, Button for consistent UI patterns
- **App-Specific Components**:
  - `PuzzleBoard.jsx` - Game board rendering
  - `PuzzleTile.jsx` - Individual puzzle tiles
  - `ConnectionEditor.jsx` - Visual road connection editor
  - `AnimationOverlay.jsx` - Success/failure animations
  - `GameOverlay.jsx` - Victory screens
  - `GameInstructions.jsx` - Game instructions

**React Skills Demonstrated:**

- **Modular Design**: Component separation for reusability and maintainability
- **Complex State Management**: Multiple useState hooks for game state, board configuration, and editor mode
- **Algorithm Implementation**: Breadth-first search for path validation and tile connectivity
- **Component Composition**: Modular game board, editor, and animation components
- **Props Management**: Clean data flow between parent and child components
- **Global Component Integration**: Seamless use of shared components across the app

**Technical Implementation:**

- **Component-Driven Architecture**: Refactored from monolithic to modular structure
- Breadth-first search algorithm for validating road connectivity
- Dynamic tile validation system with configurable start/end tiles
- Real-time path checking with tile connection matrix
- JSON-based tile relationship configuration system
- Responsive grid layout with touch-friendly mobile controls
- CSS animations for car rotation and visual feedback
- **SEO Integration**: Dynamic meta tags for better search optimization

**Key Features:**

- **Modular Architecture**: Clean component separation following React best practices
- **Reusable Components**: Uses global GameStats and Button components
- **Intelligent Validation**: Ensures proper start tiles (roadsBottomTopEnd, roadsRightEndLeft) and end tiles
- **Dynamic Car Rotation**: Car automatically rotates -90° when on roadsRightEndLeft start tile
- **Advanced Pathfinding**: BFS algorithm validates complete road connections
- **Visual Editor**: Interactive tile connection editor with JSON export capability
- **Responsive Design**: Mobile-optimized with touch interactions
- **Production Ready**: Clean, maintainable codebase with modular architecture

### Coming Soon

- Weather Dashboard with real-time data
- Chat Application with real-time messaging
- E-Commerce Store with full shopping features
- Portfolio Gallery with interactive galleries

## Technology Stack

### Core Technologies

- **React 18.2.0**: Stable React features with modern hooks and patterns
- **React DOM 18.2.0**: Stable DOM rendering capabilities
- **Tailwind CSS 3.4.17**: Utility-first CSS framework for responsive design

### Full-Stack & Backend

- **Firebase 10.x**: Complete backend-as-a-service platform
- **Firebase Authentication**: User authentication with email/password
- **Firestore**: NoSQL real-time database with live listeners
- **Material-UI (MUI) 5.x**: Professional React component library with theming system

### Signature & PDF Functionality

- **react-signature-canvas 1.1.0-alpha.2**: Digital signature capture and manipulation
- **@react-pdf/renderer 4.3.0**: PDF generation, preview, and download capabilities

### 3D Graphics & Interactive Media

- **three 0.178.0**: Professional 3D graphics library for WebGL rendering
- **GLTFLoader**: 3D model loading and parsing for GLB/GLTF files
- **Canvas API**: Real-time texture painting and manipulation
- **WebGL**: Hardware-accelerated 3D rendering

### Interactive UI Components

- **@hello-pangea/dnd**: Modern drag-and-drop library for React 18 compatibility
- **@uiw/react-color-wheel 2.7.1**: Interactive color wheel component
- **@tailwindcss/line-clamp 0.4.4**: Text truncation utilities

### Financial & API Integration

- **CurrencyAPI**: Real-time exchange rate data
- **Custom Currency Service**: Fallback handling and rate management

### UI/UX Design System

- **Liquid Glass Components**: Custom glass morphism design system inspired by Apple's aesthetic
- **Advanced CSS Effects**: Backdrop filters, blur effects, and sophisticated visual layering
- **Parallax Animation System**: Multi-layered blob backgrounds with depth-based motion simulation
- **Interactive Visual Feedback**: Subtle shine effects, hover transformations, and smooth transitions

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
- **Hooks**: useState, useRef, useEffect, and custom hook patterns
- **Component Composition**: Modular, reusable component architecture
- **State Management**: Efficient local state management with React hooks

### UI/UX Development

- **Advanced Design Systems**: Liquid glass morphism with Apple-inspired aesthetics and sophisticated visual effects
- **Parallax Animation Systems**: Multi-layered background animations with depth-based motion simulation and smooth scroll interactions
- **Premium Interactive Design**: Enhanced card interfaces with subtle shine effects, hover transformations, and refined visual feedback
- **Responsive Design**: Mobile-first approach with adaptive layouts and optimized blob positioning across all devices
- **Modern Animations**: Smooth transitions, hover effects, and sophisticated animation choreography
- **Accessibility**: Proper form labels, semantic HTML, and reduced motion support
- **User Experience**: Intuitive navigation, app-style interface panels, and polished feedback systems

### Technical Implementation

- **Full-Stack Development**: Complete React + Firebase applications with authentication and real-time data
- **Real-time Systems**: Live collaboration with Firestore listeners and optimistic updates
- **Drag-and-Drop Interfaces**: Advanced kanban boards with @hello-pangea/dnd integration
- **Authentication Systems**: Firebase Auth with protected routes and user session management
- **Database Design**: Firestore data modeling and real-time synchronization patterns
- **Performance Optimization**: Code splitting with React.lazy() reduces main bundle by 94.7% (977KB → 51KB)
- **Smart Loading**: Large dependencies (Three.js, Firebase, Material-UI) load only when accessed
- **Bundle Management**: Separate chunks for each major feature (3D: 489KB, Task Manager: 221KB)
- **3D Graphics Programming**: Three.js integration with React for immersive 3D experiences
- **Real-time Texture Painting**: Canvas-based painting systems with stroke interpolation for smooth brush strokes
- **3D Scene Management**: Professional lighting setups, camera controls, and model loading
- **WebGL Optimization**: Efficient 3D rendering with proper memory management
- **PDF Generation**: Real-time PDF creation with custom styling
- **Canvas Manipulation**: Direct canvas API usage for signature capture and 3D textures
- **Color Theory**: Advanced color calculations and harmony analysis
- **Social Interactions**: Like functionality with animations and state management
- **API Integration**: Real-time data fetching with error handling
- **Financial Calculations**: Complex tax and currency conversion algorithms
- **Data Handling**: Form state management and data validation
- **File Operations**: PDF download and preview functionality

### Code Quality

- **Component Structure**: Clean separation of concerns
- **Reusable Components**: Modular design for scalability
- **Custom Hooks**: Encapsulated logic for reusability
- **Modern JavaScript**: ES6+ features and async patterns
- **CSS Architecture**: Utility-first styling with Tailwind
- **Error Handling**: Graceful fallbacks and user feedback

## 🚀 Live Demo

The portfolio is deployed and available at: **https://react-portfolio-9f9fd.web.app**

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Environment Variables

For the Tax Calculator app to work with real-time exchange rates, create a `.env` file in the root directory:

```bash
REACT_APP_CURRENCY_API_KEY=your_currency_api_key_here
```

You can get a free API key from [CurrencyAPI](https://currencyapi.com/).

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

### `npm run deploy`

Builds the application and deploys to Firebase Hosting (both functions and hosting).

### `npm run deploy:hosting`

Deploys only the hosting portion to Firebase (recommended for most updates).

### `npm run eject`

**Note: This is a one-way operation!**
Removes the single build dependency and copies configuration files into the project.

## Project Structure

```
src/
├── App.js                 # Main application component
├── App.css               # Global styles
├── index.js              # Application entry point
├── components/
│   └── SEO.jsx          # Global SEO component
└── projects/
    ├── AppLibrary.jsx    # Main project library component
    ├── components/       # Project-shared components
    │   ├── ProjectCard.jsx
    │   ├── Title.jsx
    │   ├── Description.jsx
    │   ├── GameStats.jsx
    │   └── Button.jsx
    ├── 01-e-signature-app/
    │   ├── EsignatureApp.jsx
    │   └── components/
    │       ├── PDFGenerator.jsx
    │       ├── PDFRenderer.jsx
    │       └── DrawSignature.jsx
    ├── 02-complementary-colors/
    │   ├── ComplementaryColorsApp.jsx
    │   ├── components/
    │   │   ├── ColorCombination.jsx
    │   │   ├── ColorDisplay.jsx
    │   │   ├── ColorPicker.jsx
    │   │   ├── ColorPreview.jsx
    │   │   ├── ColorWheel.jsx
    │   │   └── HarmonyDisplay.jsx
    │   └── utils/
    │       └── colorUtils.js
    ├── 03-like-my-photo/
    │   ├── LikePhotoApp.jsx
    │   ├── components/
    │   │   ├── PhotoCard.jsx
    │   │   ├── PhotoGrid.jsx
    │   │   ├── PhotoContainer.jsx
    │   │   ├── PhotoOverlay.jsx
    │   │   ├── LikeIndicator.jsx
    │   │   ├── HeartAnimation.jsx
    │   │   ├── PhotoImage.jsx
    │   │   └── LikeButtons.jsx
    │   └── hooks/
    │       └── useLikePhoto.js
    └── 04-tax-calculator/
        ├── TaxCalculatorApp.jsx
        ├── TaxCalculator.css
        ├── components/
        │   ├── InputForm.jsx
        │   ├── SelectionOptions.jsx
        │   ├── ResultsTable.jsx
        │   └── Disclaimer.jsx
        └── services/
            └── currencyService.js
    ├── 05-road-builder-puzzle/
    │   ├── RoadBuilderPuzzleApp.jsx
    │   ├── RoadBuilderPuzzleApp.css
    │   ├── assets/
    │   │   ├── f1.png
    │   │   ├── explosion.gif
    │   │   ├── road_tile_connections_with_sides.json
    │   │   └── [road tile images]
    │   └── components/
    │       ├── PuzzleBoard.jsx      # Game board rendering
    │       ├── PuzzleTile.jsx       # Individual puzzle tiles
    │       ├── ConnectionEditor.jsx # Visual connection editor
    │       ├── AnimationOverlay.jsx # Success/failure animations
    │       ├── GameOverlay.jsx      # Victory screens
    │       └── GameInstructions.jsx # Game instructions
    ├── 06-react-threejs/
    │   ├── ReactThreejsApp.jsx      # Main 3D application component
    │   ├── classes/
    │   │   ├── ColorPalette.js      # 3D color sphere management
    │   │   └── ShapeChallenge.js    # Game logic for shape drawing
    │   ├── components/
    │   │   ├── CameraController.js  # 3D camera rotation controls
    │   │   ├── PaintingSystem.js    # Real-time 3D texture painting
    │   │   ├── GameUI.js           # Traditional DOM-based game UI
    │   │   ├── GameUIComponent.jsx  # Modern React component UI
    │   │   └── DevControls.js      # Developer debugging tools
    │   └── config/
    │       └── settings.js         # Configuration and constants
    └── 07-fullstack-task-manager/
        ├── TaskManagerApp.jsx       # Main task manager application
        ├── components/
        │   ├── auth/               # Authentication components
        │   │   ├── AuthPage.jsx    # Login/Register page
        │   │   ├── LoginForm.jsx   # Login form component
        │   │   ├── RegisterForm.jsx # Registration form
        │   │   └── ProtectedRoute.jsx # Route protection
        │   ├── common/
        │   │   └── Header.jsx      # Application header
        │   ├── projects/
        │   │   ├── ProjectDetail.jsx # Project detail with kanban board
        │   │   └── ProjectForm.jsx  # Create/edit project form
        │   └── tasks/
        │       ├── KanbanBoard.jsx  # Drag-and-drop kanban board
        │       ├── TaskCard.jsx     # Individual task card
        │       └── TaskForm.jsx     # Create/edit task form
        ├── hooks/
        │   ├── useAuth.jsx         # Authentication state management
        │   ├── useProjects.js      # Project CRUD operations
        │   └── useTasks.js         # Task CRUD and kanban logic
        ├── services/
        │   ├── firebase.js         # Firebase configuration
        │   ├── auth.service.js     # Authentication service
        │   └── firestore.service.js # Firestore CRUD operations
        ├── types/
        │   └── index.js           # Type definitions
        └── utils/
            ├── mockData.js        # Mock data for development
            └── sampleData.js      # Sample data creation
```
