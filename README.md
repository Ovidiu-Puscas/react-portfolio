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

### Color & UI Components

- **@uiw/react-color-wheel 2.7.1**: Interactive color wheel component
- **@tailwindcss/line-clamp 0.4.4**: Text truncation utilities

### Financial & API Integration

- **CurrencyAPI**: Real-time exchange rate data
- **Custom Currency Service**: Fallback handling and rate management

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

- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Modern Animations**: Smooth transitions and hover effects
- **Accessibility**: Proper form labels and semantic HTML
- **User Experience**: Intuitive navigation and feedback systems

### Technical Implementation

- **PDF Generation**: Real-time PDF creation with custom styling
- **Canvas Manipulation**: Direct canvas API usage for signature capture
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
├── components/
│   └── SEO.jsx          # SEO component
└── projects/
    ├── AppLibrary.jsx    # Main project library component
    ├── components/       # Shared components
    │   ├── ProjectCard.jsx
    │   ├── Title.jsx
    │   └── Description.jsx
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
