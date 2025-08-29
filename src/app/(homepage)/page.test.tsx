import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '@/app/(homepage)/page';

describe('Homepage', () => {
  it('renders a heading with the text "Get Started!"', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });
    const headingText = heading.textContent;

    expect(heading).toBeInTheDocument();
    expect(headingText).toBe('Get Started!');
  });
});
