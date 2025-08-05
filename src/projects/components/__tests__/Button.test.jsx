import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

describe('Button Component', () => {
  // Basic rendering tests
  it('renders with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders without children (icon only)', () => {
    const icon = <span data-testid="icon">🔍</span>;
    render(<Button icon={icon} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  // Click handler tests
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Disabled state tests
  it('applies disabled attribute when disabled prop is true', () => {
    render(<Button disabled>Disabled button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies opacity and cursor styles when disabled', () => {
    render(<Button disabled>Disabled button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  // Variant tests
  describe('Button variants', () => {
    const variants = [
      'default',
      'primary',
      'secondary',
      'success',
      'warning',
      'danger',
      'outline',
      'ghost',
    ];

    variants.forEach((variant) => {
      it(`renders ${variant} variant with correct styles`, () => {
        render(<Button variant={variant}>Test</Button>);
        const button = screen.getByRole('button');

        // Check that button has the base classes
        expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');

        // Check that it has variant-specific classes (at least one should match)
        const classes = button.className;
        expect(classes.includes('bg-') || classes.includes('border-')).toBe(true);
      });
    });
  });

  // Size tests
  describe('Button sizes', () => {
    it('renders small size with correct padding', () => {
      render(<Button size="small">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('renders medium size with correct padding (default)', () => {
      render(<Button>Medium</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('renders large size with correct padding', () => {
      render(<Button size="large">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  // Icon tests
  describe('Button with icons', () => {
    const icon = <span data-testid="test-icon">🔍</span>;

    it('renders icon on the left by default', () => {
      render(<Button icon={icon}>Search</Button>);
      const iconElement = screen.getByTestId('test-icon');

      expect(iconElement).toBeInTheDocument();
      expect(iconElement).toHaveClass('mr-2');
    });

    it('renders icon on the right when iconPosition is right', () => {
      render(
        <Button icon={icon} iconPosition="right">
          Search
        </Button>
      );
      const iconElement = screen.getByTestId('test-icon');

      expect(iconElement).toBeInTheDocument();
      expect(iconElement).toHaveClass('ml-2');
    });

    it('renders icon without margin when no children', () => {
      render(<Button icon={icon} />);
      const iconElement = screen.getByTestId('test-icon');

      expect(iconElement).toBeInTheDocument();
      expect(iconElement).not.toHaveClass('mr-2', 'ml-2');
    });
  });

  // Layout tests
  it('renders full width when fullWidth prop is true', () => {
    render(<Button fullWidth>Full width</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('does not render full width by default', () => {
    render(<Button>Normal width</Button>);
    expect(screen.getByRole('button')).not.toHaveClass('w-full');
  });

  // Custom className tests
  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('merges custom className with default classes', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('inline-flex'); // Should still have base classes
  });

  // Props spreading tests
  it('spreads additional props to button element', () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom label">
        Test
      </Button>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom label');
  });

  // Accessibility tests
  it('is focusable when not disabled', () => {
    render(<Button>Focusable</Button>);
    const button = screen.getByRole('button');

    button.focus();
    expect(button).toHaveFocus();
  });

  it('has correct focus styles', () => {
    render(<Button>Focus me</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2'
    );
  });

  // Interaction tests
  it('has hover and active scale effects when not disabled', () => {
    render(<Button>Interactive</Button>);
    expect(screen.getByRole('button')).toHaveClass('hover:scale-105', 'active:scale-95');
  });

  it('does not have scale effects when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('hover:scale-105', 'active:scale-95');
  });
});
