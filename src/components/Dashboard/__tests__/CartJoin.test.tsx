import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartJoin from '../CartJoin';
import * as firebaseDb from 'firebase/database';
import { render } from '../../../test/test-utils';

// Mock firebase/database
vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  push: vi.fn(),
}));

describe('CartJoin Component', () => {
  const mockOnCartJoined = vi.fn();
  const mockCartRef = { key: 'cart-123' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render cart join form', () => {
    render(<CartJoin onCartJoined={mockOnCartJoined} />);

    expect(screen.getByText('Join a Cart')).toBeInTheDocument();
    expect(screen.getByLabelText('Cart ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join/i })).toBeInTheDocument();
  });

  it('should disable join button when cart id is empty', () => {
    render(<CartJoin onCartJoined={mockOnCartJoined} />);

    const button = screen.getByRole('button', { name: /join/i });
    expect(button).toBeDisabled();
  });

  it('should enable join button when cart id is entered', async () => {
    const user = userEvent.setup();
    render(<CartJoin onCartJoined={mockOnCartJoined} />);

    const input = screen.getByLabelText('Cart ID');
    await user.type(input, 'cart-123');

    const button = screen.getByRole('button', { name: /join/i });
    expect(button).not.toBeDisabled();
  });

  it('should show alert when cart id is empty on join click', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation();

    render(<CartJoin onCartJoined={mockOnCartJoined} />);

    const button = screen.getByRole('button', { name: /join/i });
    await user.click(button);

    expect(alertSpy).toHaveBeenCalledWith('Please enter a valid cart ID');

    alertSpy.mockRestore();
  });

  it('should prevent joining when user already has 3 carts', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation();

    vi.mocked(firebaseDb.get).mockResolvedValue({
      exists: () => true,
      val: () => ({
        'cart1': true,
        'cart2': true,
        'cart3': true,
      }),
      child: () => ({ val: () => null }),
    } as any);

    render(<CartJoin onCartJoined={mockOnCartJoined} />);

    const input = screen.getByLabelText('Cart ID');
    await user.type(input, 'cart-456');

    const button = screen.getByRole('button', { name: /join/i });
    await user.click(button);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('You cannot be part of more than 3 carts.');
    });

    alertSpy.mockRestore();
  });

  it('should prevent joining when cart is full (5 users)', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation();

    vi.mocked(firebaseDb.get)
      .mockResolvedValueOnce({
        exists: () => false,
      } as any)
      .mockResolvedValueOnce({
        exists: () => true,
        child: () => ({
          val: () => ({
            'user1': { name: 'User 1' },
            'user2': { name: 'User 2' },
            'user3': { name: 'User 3' },
            'user4': { name: 'User 4' },
            'user5': { name: 'User 5' },
          }),
        }),
      } as any);

    render(<CartJoin onCartJoined={mockOnCartJoined} />);

    const input = screen.getByLabelText('Cart ID');
    await user.type(input, 'cart-456');

    const button = screen.getByRole('button', { name: /join/i });
    await user.click(button);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Cart is full. You cannot join this cart.');
    });

    alertSpy.mockRestore();
  });

  it('should show alert when cart does not exist', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation();

    vi.mocked(firebaseDb.get)
      .mockResolvedValueOnce({
        exists: () => false,
      } as any)
      .mockResolvedValueOnce({
        exists: () => false,
        child: () => ({ val: () => null }),
      } as any);

    render(<CartJoin onCartJoined={mockOnCartJoined} />);

    const input = screen.getByLabelText('Cart ID');
    await user.type(input, 'invalid-cart-id');

    const button = screen.getByRole('button', { name: /join/i });
    await user.click(button);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Cart not found. Please check the ID and try again.');
    });

    alertSpy.mockRestore();
  });

  it('should successfully join cart and call onCartJoined callback', async () => {
    const user = userEvent.setup();

    vi.mocked(firebaseDb.get)
      .mockResolvedValueOnce({
        exists: () => false,
      } as any)
      .mockResolvedValueOnce({
        exists: () => true,
        child: () => ({
          val: () => ({
            'user1': { name: 'User 1' },
          }),
        }),
      } as any);

    vi.mocked(firebaseDb.set).mockResolvedValue(undefined);

    render(<CartJoin onCartJoined={mockOnCartJoined} />);

    const input = screen.getByLabelText('Cart ID');
    await user.type(input, 'cart-456');

    const button = screen.getByRole('button', { name: /join/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockOnCartJoined).toHaveBeenCalledWith('cart-456');
    });
  });

  it('should clear cart id input after successful join', async () => {
    const user = userEvent.setup();

    vi.mocked(firebaseDb.get)
      .mockResolvedValueOnce({
        exists: () => false,
      } as any)
      .mockResolvedValueOnce({
        exists: () => true,
        child: () => ({
          val: () => ({
            'user1': { name: 'User 1' },
          }),
        }),
      } as any);

    vi.mocked(firebaseDb.set).mockResolvedValue(undefined);

    render(<CartJoin onCartJoined={mockOnCartJoined} />);

    const input = screen.getByLabelText('Cart ID') as HTMLInputElement;
    await user.type(input, 'cart-456');

    const button = screen.getByRole('button', { name: /join/i });
    await user.click(button);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should handle database errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
    const error = new Error('Database error');

    vi.mocked(firebaseDb.get).mockRejectedValue(error);

    render(<CartJoin onCartJoined={mockOnCartJoined} />);

    const input = screen.getByLabelText('Cart ID');
    await user.type(input, 'cart-456');

    const button = screen.getByRole('button', { name: /join/i });
    await user.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error joining cart:', error);
      expect(alertSpy).toHaveBeenCalledWith('Failed to join the cart. Please try again.');
    });

    consoleErrorSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
