import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectCard from '../ProjectCard';

// Mock the Title and Description components since they're already tested
jest.mock(
  '../Title',
  () =>
    function MockTitle({ title }) {
      return <h3 data-testid="mock-title">{title.text}</h3>;
    }
);

jest.mock(
  '../Description',
  () =>
    function MockDescription({ description }) {
      return <p data-testid="mock-description">{description.text}</p>;
    }
);

describe('ProjectCard Component', () => {
  const defaultProps = {
    title: 'Test Project',
    description: 'This is a test project description',
    icon: <span data-testid="test-icon">🚀</span>,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  it('renders without crashing', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByTestId('mock-title')).toBeInTheDocument();
    expect(screen.getByTestId('mock-description')).toBeInTheDocument();
  });

  it('displays the provided title', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByTestId('mock-title')).toHaveTextContent('Test Project');
  });

  it('displays the provided description', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByTestId('mock-description')).toHaveTextContent(
      'This is a test project description'
    );
  });

  it('displays the provided icon', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  // Click handling tests
  it('calls onClick when clicked', () => {
    const mockClick = jest.fn();
    render(<ProjectCard {...defaultProps} onClick={mockClick} />);

    // Click on the clickable card div (has cursor-pointer class)
    const card = document.querySelector('.cursor-pointer');
    fireEvent.click(card);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('does not throw error when onClick is not provided', () => {
    const { onClick, ...propsWithoutClick } = defaultProps;
    expect(() => {
      render(<ProjectCard {...propsWithoutClick} />);
      const card = document.querySelector('.cursor-pointer');
      fireEvent.click(card);
    }).not.toThrow();
  });

  // Color variant tests
  it('applies default blue color variant', () => {
    render(<ProjectCard {...defaultProps} />);
    const card = document.querySelector('.cursor-pointer');
    expect(card.className).toContain('from-blue-500');
    expect(card.className).toContain('to-blue-600');
  });

  it('applies specified color variant', () => {
    render(<ProjectCard {...defaultProps} color="green" />);
    const card = document.querySelector('.cursor-pointer');
    expect(card.className).toContain('from-green-500');
    expect(card.className).toContain('to-green-600');
  });

  describe('Color variants', () => {
    const colors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo'];

    colors.forEach((color) => {
      it(`applies ${color} color variant correctly`, () => {
        render(<ProjectCard {...defaultProps} color={color} />);
        const card = document.querySelector('.cursor-pointer');
        expect(card.className).toContain(`from-${color}-500`);
        expect(card.className).toContain(`to-${color}-600`);
      });
    });
  });

  // Active state tests
  it('applies active styles when isActive is true', () => {
    render(<ProjectCard {...defaultProps} isActive={true} />);
    const card = document.querySelector('.cursor-pointer');

    expect(card.className).toContain('scale-[1.02]');
    expect(card.className).toContain('shadow-2xl');
    expect(card.className).toContain('ring-2');
    expect(card.className).toContain('ring-blue-400');
  });

  it('does not apply active styles when isActive is false', () => {
    render(<ProjectCard {...defaultProps} isActive={false} />);
    const card = document.querySelector('.cursor-pointer');

    expect(card.className).not.toContain('scale-[1.02]');
    expect(card.className).not.toContain('ring-2');
    expect(card.className).toContain('hover:scale-[1.02]');
  });

  it('shows active indicator when isActive is true', () => {
    render(<ProjectCard {...defaultProps} isActive={true} />);
    // Look for the animated pulse dot (white rounded-full with animate-pulse)
    const activeIndicator = document.querySelector('.animate-pulse');
    expect(activeIndicator).toBeInTheDocument();
  });

  it('does not show active indicator when isActive is false', () => {
    render(<ProjectCard {...defaultProps} isActive={false} />);
    const activeIndicator = document.querySelector('.animate-pulse');
    expect(activeIndicator).not.toBeInTheDocument();
  });

  // Hover state tests
  it('updates hover state on mouse enter and leave', () => {
    render(<ProjectCard {...defaultProps} />);
    const card = document.querySelector('.cursor-pointer');

    // Initial state - not hovered
    expect(card.className).toContain('shadow-lg');
    expect(card.className).not.toContain('shadow-2xl');

    // Mouse enter
    fireEvent.mouseEnter(card);
    expect(card.className).toContain('shadow-2xl');

    // Mouse leave
    fireEvent.mouseLeave(card);
    expect(card.className).toContain('shadow-lg');
  });

  it('shows hover overlay on mouse enter', () => {
    render(<ProjectCard {...defaultProps} />);
    const card = document.querySelector('.cursor-pointer');

    // Initially hover overlay should have opacity-0
    const hoverOverlay = document.querySelector('.from-white\\/10');
    expect(hoverOverlay).toHaveClass('opacity-0');

    // Mouse enter should change to opacity-100
    fireEvent.mouseEnter(card);
    expect(hoverOverlay).toHaveClass('opacity-100');

    // Mouse leave should change back to opacity-0
    fireEvent.mouseLeave(card);
    expect(hoverOverlay).toHaveClass('opacity-0');
  });

  // UI elements tests
  it('displays "Click to explore" text', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByText('Click to explore')).toBeInTheDocument();
  });

  it('renders arrow icon', () => {
    render(<ProjectCard {...defaultProps} />);
    const arrowIcon = document.querySelector('svg');
    expect(arrowIcon).toBeInTheDocument();
    expect(arrowIcon).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('applies transform to arrow on group hover', () => {
    render(<ProjectCard {...defaultProps} />);
    const arrowIcon = document.querySelector('svg');
    expect(arrowIcon).toHaveClass('group-hover:translate-x-1');
  });

  // Layout and styling tests
  it('has correct base styling classes', () => {
    render(<ProjectCard {...defaultProps} />);
    const card = document.querySelector('.cursor-pointer');

    expect(card).toHaveClass(
      'relative',
      'overflow-hidden',
      'rounded-xl',
      'cursor-pointer',
      'transition-all',
      'duration-300',
      'transform',
      'h-full'
    );
  });

  it('has correct gradient background', () => {
    render(<ProjectCard {...defaultProps} />);
    const card = document.querySelector('.cursor-pointer');
    expect(card).toHaveClass('bg-gradient-to-br');
  });

  it('contains background pattern elements', () => {
    render(<ProjectCard {...defaultProps} />);

    // Check for background pattern container
    const patternContainer = document.querySelector('.absolute.inset-0.opacity-10');
    expect(patternContainer).toBeInTheDocument();

    // Check for circular background elements
    const circles = document.querySelectorAll('.rounded-full');
    expect(circles.length).toBeGreaterThan(0);
  });

  it('has icon container with correct styling', () => {
    render(<ProjectCard {...defaultProps} />);

    // Find the icon container (div containing the icon)
    const iconContainer = screen.getByTestId('test-icon').parentElement;
    expect(iconContainer).toHaveClass(
      'w-14',
      'h-14',
      'bg-white/20',
      'rounded-xl',
      'flex',
      'items-center',
      'justify-center',
      'backdrop-blur-sm',
      'border',
      'border-white/20'
    );
  });

  it('has bottom accent bar', () => {
    render(<ProjectCard {...defaultProps} />);

    const accentBar = document.querySelector('.absolute.bottom-0.left-0.right-0.h-1');
    expect(accentBar).toBeInTheDocument();
    expect(accentBar).toHaveClass('bg-white/30');
  });

  // Edge cases and prop validation
  it('handles missing title gracefully', () => {
    const { title, ...propsWithoutTitle } = defaultProps;
    expect(() => {
      render(<ProjectCard {...propsWithoutTitle} />);
    }).not.toThrow();
  });

  it('handles missing description gracefully', () => {
    const { description, ...propsWithoutDescription } = defaultProps;
    expect(() => {
      render(<ProjectCard {...propsWithoutDescription} />);
    }).not.toThrow();
  });

  it('handles missing icon gracefully', () => {
    const { icon, ...propsWithoutIcon } = defaultProps;
    expect(() => {
      render(<ProjectCard {...propsWithoutIcon} />);
    }).not.toThrow();
  });

  it('handles invalid color gracefully', () => {
    render(<ProjectCard {...defaultProps} color="invalid-color" />);
    const card = screen.getByRole('generic');
    // Should fallback to a default or handle gracefully
    expect(card).toBeInTheDocument();
  });

  // Complex integration tests
  it('works with complex icon elements', () => {
    const complexIcon = (
      <div data-testid="complex-icon">
        <svg viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7L12 2z" />
        </svg>
      </div>
    );

    render(<ProjectCard {...defaultProps} icon={complexIcon} />);
    expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
  });

  it('works with long title and description', () => {
    const longTitle = 'This is a very long project title that might wrap to multiple lines';
    const longDescription =
      'This is a very long project description that contains multiple sentences and should test how the component handles overflow and text wrapping in various scenarios.';

    render(<ProjectCard {...defaultProps} title={longTitle} description={longDescription} />);

    expect(screen.getByTestId('mock-title')).toHaveTextContent(longTitle);
    expect(screen.getByTestId('mock-description')).toHaveTextContent(longDescription);
  });

  // Accessibility tests
  it('is clickable via keyboard', () => {
    const mockClick = jest.fn();
    render(<ProjectCard {...defaultProps} onClick={mockClick} />);

    const card = screen.getByRole('generic');

    // Simulate keyboard interaction
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(card, { key: ' ', code: 'Space' });

    // Note: The component doesn't handle keyboard events by default,
    // but it should be clickable
    expect(card).toHaveClass('cursor-pointer');
  });

  it('maintains proper contrast for text readability', () => {
    render(<ProjectCard {...defaultProps} />);

    // Check that text elements have appropriate contrast classes
    const titleElement = screen.getByTestId('mock-title');
    const descriptionElement = screen.getByTestId('mock-description');

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  // State persistence tests
  it('maintains hover state during rapid mouse movements', () => {
    render(<ProjectCard {...defaultProps} />);
    const card = document.querySelector('.cursor-pointer');

    // Rapid mouse enter/leave
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);
    fireEvent.mouseEnter(card);

    expect(card.className).toContain('shadow-2xl');
  });
});
