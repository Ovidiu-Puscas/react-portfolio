import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Description from '../Description';

describe('Description Component', () => {
  // Basic rendering tests
  it('renders description text when provided', () => {
    const descriptionProps = {
      text: 'This is a test description',
      class: 'text-gray-600 leading-relaxed',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('renders as a paragraph element', () => {
    const descriptionProps = {
      text: 'Test paragraph',
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    const paragraph = screen.getByText('Test paragraph');
    expect(paragraph.tagName).toBe('P');
  });

  // Text content tests
  it('displays provided text content', () => {
    const descriptionProps = {
      text: 'Custom description content goes here',
      class: 'text-lg text-gray-700',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('Custom description content goes here')).toBeInTheDocument();
  });

  it('displays default "Description" when text is empty string', () => {
    const descriptionProps = {
      text: '',
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('displays default "Description" when text is null', () => {
    const descriptionProps = {
      text: null,
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('displays default "Description" when text is undefined', () => {
    const descriptionProps = {
      text: undefined,
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('displays default "Description" when text is falsy (0)', () => {
    const descriptionProps = {
      text: 0,
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('displays default "Description" when text is falsy (false)', () => {
    const descriptionProps = {
      text: false,
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  // CSS class tests
  it('applies custom CSS classes', () => {
    const descriptionProps = {
      text: 'Styled description',
      class: 'text-lg text-gray-600 leading-relaxed mb-4',
    };

    render(<Description description={descriptionProps} />);
    const paragraph = screen.getByText('Styled description');
    expect(paragraph).toHaveClass('text-lg', 'text-gray-600', 'leading-relaxed', 'mb-4');
  });

  it('applies single CSS class', () => {
    const descriptionProps = {
      text: 'Simple styling',
      class: 'text-center',
    };

    render(<Description description={descriptionProps} />);
    const paragraph = screen.getByText('Simple styling');
    expect(paragraph).toHaveClass('text-center');
  });

  it('handles empty class string', () => {
    const descriptionProps = {
      text: 'No styling',
      class: '',
    };

    render(<Description description={descriptionProps} />);
    const paragraph = screen.getByText('No styling');
    expect(paragraph.className).toBe('');
  });

  it('handles undefined class', () => {
    const descriptionProps = {
      text: 'Undefined class',
      class: undefined,
    };

    render(<Description description={descriptionProps} />);
    const paragraph = screen.getByText('Undefined class');
    expect(paragraph.className).toBe('');
  });

  // Edge cases
  it('handles missing description prop gracefully', () => {
    // This should not throw an error - provide empty object
    expect(() => render(<Description description={{}} />)).not.toThrow();
  });

  it('handles empty description object', () => {
    const descriptionProps = {};

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('handles partial description object (missing text)', () => {
    const descriptionProps = {
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('handles partial description object (missing class)', () => {
    const descriptionProps = {
      text: 'Text without class',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('Text without class')).toBeInTheDocument();
  });

  // Content type tests
  it('works with long text content', () => {
    const longText =
      'This is a very long description that contains multiple sentences and might wrap to several lines. It should render correctly without breaking the layout or causing any issues with the component functionality. The text can be quite extensive and include various punctuation marks, numbers like 123, and other characters that might appear in a typical description.';
    const descriptionProps = {
      text: longText,
      class: 'text-base leading-relaxed',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('works with special characters in text', () => {
    const specialText = 'Description with special chars: @#$%^&*()_+{}[]|\\:";\'<>?,./';
    const descriptionProps = {
      text: specialText,
      class: 'text-sm',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText(specialText)).toBeInTheDocument();
  });

  it('works with Unicode and emoji in text', () => {
    const unicodeText = 'Description with emojis 📝 and Unicode: café, naïve, résumé, 中文';
    const descriptionProps = {
      text: unicodeText,
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText(unicodeText)).toBeInTheDocument();
  });

  it('works with HTML entities (should render as text)', () => {
    const htmlText = 'Description with &lt;HTML&gt; entities &amp; symbols';
    const descriptionProps = {
      text: htmlText,
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText(htmlText)).toBeInTheDocument();
  });

  it('works with newline characters', () => {
    const textWithNewlines = 'First line\nSecond line\nThird line';
    const descriptionProps = {
      text: textWithNewlines,
      class: 'whitespace-pre-line',
    };

    render(<Description description={descriptionProps} />);
    // Use more flexible text matching for multiline content
    expect(
      screen.getByText((content, element) => element?.textContent === textWithNewlines)
    ).toBeInTheDocument();
  });

  // Numbers and other data types as text
  it('handles numeric text properly', () => {
    const descriptionProps = {
      text: '12345',
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('converts number to string when passed as text', () => {
    const descriptionProps = {
      text: 42,
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  // Accessibility tests
  it('is readable by screen readers', () => {
    const descriptionProps = {
      text: 'This description should be accessible',
      class: 'text-base',
    };

    render(<Description description={descriptionProps} />);
    const paragraph = screen.getByText('This description should be accessible');

    // Check that it's a proper paragraph element
    expect(paragraph.tagName).toBe('P');
    // Check that it has text content
    expect(paragraph).toHaveTextContent('This description should be accessible');
  });

  // Styling integration tests
  it('applies responsive classes correctly', () => {
    const descriptionProps = {
      text: 'Responsive description',
      class: 'text-sm md:text-base lg:text-lg xl:text-xl',
    };

    render(<Description description={descriptionProps} />);
    const paragraph = screen.getByText('Responsive description');
    expect(paragraph).toHaveClass('text-sm', 'md:text-base', 'lg:text-lg', 'xl:text-xl');
  });

  it('applies complex Tailwind classes', () => {
    const descriptionProps = {
      text: 'Complex styling',
      class:
        'text-gray-700 font-medium leading-relaxed tracking-wide max-w-prose mx-auto px-4 py-2',
    };

    render(<Description description={descriptionProps} />);
    const paragraph = screen.getByText('Complex styling');
    expect(paragraph).toHaveClass(
      'text-gray-700',
      'font-medium',
      'leading-relaxed',
      'tracking-wide',
      'max-w-prose',
      'mx-auto',
      'px-4',
      'py-2'
    );
  });
});
