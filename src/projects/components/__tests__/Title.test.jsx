import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Title from '../Title';

describe('Title Component', () => {
  // Basic rendering tests
  it('renders h1 element when heading is h1', () => {
    const titleProps = {
      heading: 'h1',
      text: 'Test H1 Title',
      class: 'text-4xl font-bold',
    };

    render(<Title title={titleProps} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test H1 Title');
  });

  it('renders h2 element when heading is h2', () => {
    const titleProps = {
      heading: 'h2',
      text: 'Test H2 Title',
      class: 'text-3xl font-semibold',
    };

    render(<Title title={titleProps} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test H2 Title');
  });

  it('renders h3 element when heading is h3', () => {
    const titleProps = {
      heading: 'h3',
      text: 'Test H3 Title',
      class: 'text-2xl font-medium',
    };

    render(<Title title={titleProps} />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test H3 Title');
  });

  it('renders h4 element when heading is h4', () => {
    const titleProps = {
      heading: 'h4',
      text: 'Test H4 Title',
      class: 'text-xl font-medium',
    };

    render(<Title title={titleProps} />);
    const heading = screen.getByRole('heading', { level: 4 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test H4 Title');
  });

  it('renders h5 element when heading is h5', () => {
    const titleProps = {
      heading: 'h5',
      text: 'Test H5 Title',
      class: 'text-lg font-medium',
    };

    render(<Title title={titleProps} />);
    const heading = screen.getByRole('heading', { level: 5 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test H5 Title');
  });

  it('renders h6 element when heading is h6', () => {
    const titleProps = {
      heading: 'h6',
      text: 'Test H6 Title',
      class: 'text-base font-medium',
    };

    render(<Title title={titleProps} />);
    const heading = screen.getByRole('heading', { level: 6 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test H6 Title');
  });

  // Text content tests
  it('displays provided text content', () => {
    const titleProps = {
      heading: 'h1',
      text: 'Custom Title Text',
      class: 'text-4xl',
    };

    render(<Title title={titleProps} />);
    expect(screen.getByText('Custom Title Text')).toBeInTheDocument();
  });

  it('displays default "Title" when text is empty string', () => {
    const titleProps = {
      heading: 'h2',
      text: '',
      class: 'text-3xl',
    };

    render(<Title title={titleProps} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('displays default "Title" when text is null', () => {
    const titleProps = {
      heading: 'h3',
      text: null,
      class: 'text-2xl',
    };

    render(<Title title={titleProps} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('displays default "Title" when text is undefined', () => {
    const titleProps = {
      heading: 'h4',
      text: undefined,
      class: 'text-xl',
    };

    render(<Title title={titleProps} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  // CSS class tests
  it('applies custom CSS classes', () => {
    const titleProps = {
      heading: 'h1',
      text: 'Styled Title',
      class: 'text-4xl font-bold custom-class',
    };

    render(<Title title={titleProps} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'custom-class');
  });

  it('applies default blue text color and hover styles', () => {
    const titleProps = {
      heading: 'h2',
      text: 'Blue Title',
      class: 'text-3xl',
    };

    render(<Title title={titleProps} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass(
      'text-blue-600',
      'hover:text-blue-800',
      'transition-colors',
      'duration-300'
    );
  });

  it('combines custom classes with default styling', () => {
    const titleProps = {
      heading: 'h3',
      text: 'Combined Styles',
      class: 'text-2xl font-semibold mb-4',
    };

    render(<Title title={titleProps} />);
    const heading = screen.getByRole('heading', { level: 3 });

    // Should have both custom and default classes
    expect(heading).toHaveClass('text-2xl', 'font-semibold', 'mb-4');
    expect(heading).toHaveClass('text-blue-600', 'hover:text-blue-800');
  });

  it('handles empty class string', () => {
    const titleProps = {
      heading: 'h1',
      text: 'No Custom Class',
      class: '',
    };

    render(<Title title={titleProps} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('text-blue-600', 'hover:text-blue-800');
  });

  // Edge cases
  it('handles missing title prop gracefully', () => {
    // This should not throw an error - provide empty object
    expect(() => render(<Title title={{}} />)).not.toThrow();
  });

  it('renders nothing when heading type is invalid', () => {
    const titleProps = {
      heading: 'h7', // Invalid heading
      text: 'Invalid Heading',
      class: 'text-xl',
    };

    render(<Title title={titleProps} />);
    expect(screen.queryByText('Invalid Heading')).not.toBeInTheDocument();
  });

  it('renders nothing when heading is missing', () => {
    const titleProps = {
      text: 'No Heading Type',
      class: 'text-xl',
    };

    render(<Title title={titleProps} />);
    expect(screen.queryByText('No Heading Type')).not.toBeInTheDocument();
  });

  // Accessibility tests
  it('provides proper heading hierarchy for screen readers', () => {
    const titleProps = {
      heading: 'h1',
      text: 'Main Page Title',
      class: 'text-4xl font-bold',
    };

    render(<Title title={titleProps} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('class');
    expect(heading.tagName).toBe('H1');
  });

  it('maintains semantic meaning for different heading levels', () => {
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    headingLevels.forEach((level, index) => {
      const titleProps = {
        heading: level,
        text: `Level ${index + 1} Heading`,
        class: 'text-xl',
      };

      const { unmount } = render(<Title title={titleProps} />);
      const heading = screen.getByRole('heading', { level: index + 1 });
      expect(heading.tagName).toBe(level.toUpperCase());
      unmount();
    });
  });

  // Integration tests
  it('works with long text content', () => {
    const longText =
      'This is a very long title that might wrap to multiple lines and should still render correctly without breaking the layout or functionality';
    const titleProps = {
      heading: 'h2',
      text: longText,
      class: 'text-3xl font-semibold',
    };

    render(<Title title={titleProps} />);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('works with special characters in text', () => {
    const specialText = 'Title with special chars: @#$%^&*()_+{}[]|\\:";\'<>?,./';
    const titleProps = {
      heading: 'h3',
      text: specialText,
      class: 'text-2xl',
    };

    render(<Title title={titleProps} />);
    expect(screen.getByText(specialText)).toBeInTheDocument();
  });

  it('works with Unicode and emoji in text', () => {
    const unicodeText = 'Title with emojis 🚀 and Unicode: café, naïve, résumé';
    const titleProps = {
      heading: 'h1',
      text: unicodeText,
      class: 'text-4xl',
    };

    render(<Title title={titleProps} />);
    expect(screen.getByText(unicodeText)).toBeInTheDocument();
  });
});
