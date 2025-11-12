import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';
import * as firebaseAuth from 'firebase/auth';
import { render } from '../../../test/test-utils';
import { mockUser } from '../../../test/mocks/firebase';

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the login page with welcome message', () => {
    render(<Login />);

    const heading = screen.getByText('Welcome to the Cart App');
    expect(heading).toBeInTheDocument();
  });

  it('should render login button with correct text', () => {
    render(<Login />);

    const button = screen.getByRole('button', { name: /login with google/i });
    expect(button).toBeInTheDocument();
  });

  it('should call signInWithPopup when login button is clicked', async () => {
    const user = userEvent.setup();
    (firebaseAuth.signInWithPopup as any).mockResolvedValue({
      user: mockUser,
    });

    render(<Login />);

    const button = screen.getByRole('button', { name: /login with google/i });
    await user.click(button);

    await waitFor(() => {
      expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();
    });
  });

  it('should navigate to dashboard after successful login', async () => {
    const user = userEvent.setup();
    (firebaseAuth.signInWithPopup as any).mockResolvedValue({
      user: mockUser,
    });

    render(<Login />);

    const button = screen.getByRole('button', { name: /login with google/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should handle login errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
    const loginError = new Error('Login failed');

    (firebaseAuth.signInWithPopup as any).mockRejectedValue(loginError);

    render(<Login />);

    const button = screen.getByRole('button', { name: /login with google/i });
    await user.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Login Error:', loginError);
    });

    consoleErrorSpy.mockRestore();
  });
});
