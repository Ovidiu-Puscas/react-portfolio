import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameStats from '../GameStats';

describe('GameStats Component', () => {
  // Basic rendering tests
  it('renders without crashing', () => {
    render(<GameStats />);
    const container = document.querySelector('.game-stats');
    expect(container).toBeInTheDocument();
  });

  it('renders with empty props', () => {
    render(<GameStats stats={[]} buttons={[]} />);
    const container = document.querySelector('.game-stats');
    expect(container).toHaveClass('game-stats');
  });

  // Stats rendering tests
  it('renders stats when provided', () => {
    const stats = [
      { label: 'Score', value: '100' },
      { label: 'Level', value: '5' },
    ];

    render(<GameStats stats={stats} />);

    expect(screen.getByText('Score:')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Level:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders multiple stats with correct structure', () => {
    const stats = [
      { label: 'Points', value: '1500' },
      { label: 'Lives', value: '3' },
      { label: 'Time', value: '2:30' },
    ];

    render(<GameStats stats={stats} />);

    // Check that all stats are rendered
    stats.forEach((stat) => {
      expect(screen.getByText(`${stat.label}:`)).toBeInTheDocument();
      expect(screen.getByText(stat.value)).toBeInTheDocument();
    });
  });

  it('does not render stats container when stats array is empty', () => {
    render(<GameStats stats={[]} />);
    expect(screen.queryByText('stat-label')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes to stats', () => {
    const stats = [{ label: 'Score', value: '100' }];

    render(<GameStats stats={stats} />);

    const label = screen.getByText('Score:');
    const value = screen.getByText('100');

    expect(label).toHaveClass('stat-label', 'font-medium', 'text-gray-700');
    expect(value).toHaveClass('stat-value', 'ml-2', 'font-bold', 'text-blue-600');
  });

  // Buttons rendering tests
  it('renders buttons when provided', () => {
    const buttons = [
      { text: 'Start Game', onClick: jest.fn() },
      { text: 'Reset', onClick: jest.fn() },
    ];

    render(<GameStats buttons={buttons} />);

    expect(screen.getByText('Start Game')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('handles button clicks', () => {
    const mockClick = jest.fn();
    const buttons = [{ text: 'Click Me', onClick: mockClick }];

    render(<GameStats buttons={buttons} />);

    fireEvent.click(screen.getByText('Click Me'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when button is disabled', () => {
    const mockClick = jest.fn();
    const buttons = [{ text: 'Disabled Button', onClick: mockClick, disabled: true }];

    render(<GameStats buttons={buttons} />);

    const button = screen.getByText('Disabled Button');
    fireEvent.click(button);
    expect(mockClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('applies disabled styles to disabled buttons', () => {
    const buttons = [{ text: 'Disabled', onClick: jest.fn(), disabled: true }];

    render(<GameStats buttons={buttons} />);

    const button = screen.getByText('Disabled');
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    expect(button).not.toHaveClass('hover:scale-105', 'active:scale-95');
  });

  // Button variant tests
  describe('Button variants', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'danger', 'default'];

    variants.forEach((variant) => {
      it(`renders ${variant} variant with correct styles`, () => {
        const buttons = [{ text: `${variant} Button`, onClick: jest.fn(), variant }];

        render(<GameStats buttons={buttons} />);

        const button = screen.getByText(`${variant} Button`);
        expect(button).toHaveClass('px-4', 'py-2', 'rounded-lg', 'font-medium');

        // Check for variant-specific background colors
        if (variant === 'primary') {
          expect(button).toHaveClass('bg-blue-500', 'hover:bg-blue-600', 'text-white');
        } else if (variant === 'secondary') {
          expect(button).toHaveClass('bg-gray-500', 'hover:bg-gray-600', 'text-white');
        } else if (variant === 'success') {
          expect(button).toHaveClass('bg-green-500', 'hover:bg-green-600', 'text-white');
        } else if (variant === 'warning') {
          expect(button).toHaveClass('bg-orange-500', 'hover:bg-orange-600', 'text-white');
        } else if (variant === 'danger') {
          expect(button).toHaveClass('bg-red-500', 'hover:bg-red-600', 'text-white');
        } else {
          expect(button).toHaveClass('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
        }
      });
    });
  });

  // Button icons tests
  it('renders button with icon', () => {
    const icon = <span data-testid="play-icon">▶️</span>;
    const buttons = [{ text: 'Play', onClick: jest.fn(), icon }];

    render(<GameStats buttons={buttons} />);

    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    expect(screen.getByText('Play')).toBeInTheDocument();
  });

  it('applies correct margin to icon', () => {
    const icon = <span data-testid="icon">🎮</span>;
    const buttons = [{ text: 'Game', onClick: jest.fn(), icon }];

    render(<GameStats buttons={buttons} />);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toHaveClass('mr-2');
  });

  it('renders button with only icon (no text)', () => {
    const icon = <span data-testid="icon-only">⚙️</span>;
    const buttons = [{ text: '', onClick: jest.fn(), icon }];

    render(<GameStats buttons={buttons} />);

    expect(screen.getByTestId('icon-only')).toBeInTheDocument();
  });

  // Layout tests
  it('applies horizontal layout by default', () => {
    const stats = [{ label: 'Score', value: '100' }];

    render(<GameStats stats={stats} />);

    const container = document.querySelector('.game-stats');
    expect(container).toHaveClass('flex', 'flex-wrap', 'items-center', 'gap-4');
    expect(container).not.toHaveClass('flex-col', 'space-y-4');
  });

  it('applies vertical layout when specified', () => {
    const stats = [{ label: 'Score', value: '100' }];

    render(<GameStats stats={stats} layout="vertical" />);

    const container = document.querySelector('.game-stats');
    expect(container).toHaveClass('flex', 'flex-col', 'space-y-4');
    expect(container).not.toHaveClass('flex-wrap', 'items-center', 'gap-4');
  });

  // Custom className tests
  it('applies custom className', () => {
    render(<GameStats className="custom-stats-class" />);

    const container = document.querySelector('.game-stats');
    expect(container).toHaveClass('custom-stats-class');
  });

  it('applies custom className to buttons', () => {
    const buttons = [
      { text: 'Custom Button', onClick: jest.fn(), className: 'custom-button-class' },
    ];

    render(<GameStats buttons={buttons} />);

    const button = screen.getByText('Custom Button');
    expect(button).toHaveClass('custom-button-class');
  });

  // Complex integration tests
  it('renders both stats and buttons together', () => {
    const stats = [
      { label: 'Score', value: '2500' },
      { label: 'Level', value: '8' },
    ];

    const buttons = [
      { text: 'Pause', onClick: jest.fn(), variant: 'secondary' },
      { text: 'Restart', onClick: jest.fn(), variant: 'danger' },
    ];

    render(<GameStats stats={stats} buttons={buttons} />);

    // Check stats
    expect(screen.getByText('Score:')).toBeInTheDocument();
    expect(screen.getByText('2500')).toBeInTheDocument();
    expect(screen.getByText('Level:')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    // Check buttons
    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(screen.getByText('Restart')).toBeInTheDocument();
  });

  it('handles complex button configurations', () => {
    const mockFunctions = {
      start: jest.fn(),
      pause: jest.fn(),
      reset: jest.fn(),
    };

    const buttons = [
      {
        text: 'Start',
        onClick: mockFunctions.start,
        variant: 'success',
        icon: <span data-testid="start-icon">▶️</span>,
      },
      {
        text: 'Pause',
        onClick: mockFunctions.pause,
        variant: 'warning',
        disabled: true,
      },
      {
        text: 'Reset',
        onClick: mockFunctions.reset,
        variant: 'danger',
        className: 'ml-auto',
      },
    ];

    render(<GameStats buttons={buttons} />);

    // Test enabled button
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    expect(mockFunctions.start).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();

    // Test disabled button
    const pauseButton = screen.getByText('Pause');
    fireEvent.click(pauseButton);
    expect(mockFunctions.pause).not.toHaveBeenCalled();
    expect(pauseButton).toBeDisabled();

    // Test button with custom class
    const resetButton = screen.getByText('Reset');
    expect(resetButton).toHaveClass('ml-auto');
    fireEvent.click(resetButton);
    expect(mockFunctions.reset).toHaveBeenCalledTimes(1);
  });

  // Edge cases
  it('handles stats with numeric values', () => {
    const stats = [
      { label: 'Number', value: 42 },
      { label: 'Zero', value: 0 },
    ];

    render(<GameStats stats={stats} />);

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles stats with special characters', () => {
    const stats = [
      { label: 'Special & Chars', value: '$1,000.50' },
      { label: 'Unicode 🎮', value: '★★★★☆' },
    ];

    render(<GameStats stats={stats} />);

    expect(screen.getByText('Special & Chars:')).toBeInTheDocument();
    expect(screen.getByText('$1,000.50')).toBeInTheDocument();
    expect(screen.getByText('Unicode 🎮:')).toBeInTheDocument();
    expect(screen.getByText('★★★★☆')).toBeInTheDocument();
  });

  it('handles empty button text gracefully', () => {
    const buttons = [{ text: '', onClick: jest.fn() }];

    render(<GameStats buttons={buttons} />);

    // Button should still be clickable even without text
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
  });

  // Accessibility tests
  it('buttons are keyboard accessible', () => {
    const mockClick = jest.fn();
    const buttons = [{ text: 'Test Button', onClick: mockClick }];

    render(<GameStats buttons={buttons} />);

    const button = screen.getByText('Test Button');
    expect(button.tagName).toBe('BUTTON');
    expect(button).not.toHaveAttribute('tabIndex', '-1');
  });

  it('disabled buttons are not focusable', () => {
    const buttons = [{ text: 'Disabled Button', onClick: jest.fn(), disabled: true }];

    render(<GameStats buttons={buttons} />);

    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });
});
