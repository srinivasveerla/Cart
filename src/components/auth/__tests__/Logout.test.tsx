import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Logout from '../Logout';
import * as firebaseAuth from 'firebase/auth';
import { render } from '../../../test/test-utils';

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  signOut: vi.fn(),
}));

describe('Logout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render logout button', () => {
    render(<Logout />);

    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
  });

  it('should call signOut when logout button is clicked', async () => {
    vi.mocked(firebaseAuth.signOut).mockResolvedValue(undefined);

    render(<Logout />);

    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(firebaseAuth.signOut).toHaveBeenCalled();
    });
  });

  it('should have secondary color', () => {
    render(<Logout />);

    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toHaveClass('MuiButton-containedSecondary');
  });
});
