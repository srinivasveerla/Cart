import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartCreation from '../CartCreation';
import * as firebaseDb from 'firebase/database';
import { render } from '../../../test/test-utils';

// Mock firebase/database
vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  push: vi.fn(),
}));

describe('CartCreation Component', () => {
  const mockOnCartCreated = vi.fn();
  const mockRef = { key: 'new-cart-123' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(firebaseDb.push).mockReturnValue(mockRef as any);
  });

  it('should render cart creation form', () => {
    render(<CartCreation onCartCreated={mockOnCartCreated} />);

    expect(screen.getByText('Create a Cart')).toBeInTheDocument();
    expect(screen.getByLabelText('Cart Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('should disable add button when cart name is empty', () => {
    render(<CartCreation onCartCreated={mockOnCartCreated} />);

    const button = screen.getByRole('button', { name: /add/i });
    expect(button).toBeDisabled();
  });

  it('should enable add button when cart name is entered', async () => {
    const user = userEvent.setup();
    render(<CartCreation onCartCreated={mockOnCartCreated} />);

    const input = screen.getByLabelText('Cart Name');
    await user.type(input, 'Grocery List');

    const button = screen.getByRole('button', { name: /add/i });
    expect(button).not.toBeDisabled();
  });

  it('should prevent creating cart when user already has 3 carts', async () => {
    const user = userEvent.setup();
    const mockUserCartsRef = { key: 'userCarts' };

    vi.mocked(firebaseDb.ref).mockReturnValue(mockUserCartsRef as any);
    vi.mocked(firebaseDb.get).mockResolvedValue({
      exists: () => true,
      val: () => ({
        'cart1': true,
        'cart2': true,
        'cart3': true,
      }),
    } as any);

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation();

    render(<CartCreation onCartCreated={mockOnCartCreated} />);

    const input = screen.getByLabelText('Cart Name');
    await user.type(input, 'New Cart');

    const button = screen.getByRole('button', { name: /add/i });
    await user.click(button);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('You cannot be part of more than 3 carts.');
    });

    alertSpy.mockRestore();
  });

  it('should successfully create cart and call onCartCreated callback', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation();

    vi.mocked(firebaseDb.get).mockResolvedValue({
      exists: () => false,
    } as any);

    vi.mocked(firebaseDb.set).mockResolvedValue(undefined);

    render(<CartCreation onCartCreated={mockOnCartCreated} />);

    const input = screen.getByLabelText('Cart Name');
    await user.type(input, 'Grocery List');

    const button = screen.getByRole('button', { name: /add/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockOnCartCreated).toHaveBeenCalledWith('new-cart-123');
      expect(alertSpy).toHaveBeenCalledWith('Cart created successfully!');
    });

    alertSpy.mockRestore();
  });

  it('should clear cart name input after successful creation', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation();

    vi.mocked(firebaseDb.get).mockResolvedValue({
      exists: () => false,
    } as any);

    vi.mocked(firebaseDb.set).mockResolvedValue(undefined);

    render(<CartCreation onCartCreated={mockOnCartCreated} />);

    const input = screen.getByLabelText('Cart Name') as HTMLInputElement;
    await user.type(input, 'Grocery List');

    const button = screen.getByRole('button', { name: /add/i });
    await user.click(button);

    await waitFor(() => {
      expect(input.value).toBe('');
    });

    alertSpy.mockRestore();
  });

  it('should handle database errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
    const error = new Error('Database error');

    vi.mocked(firebaseDb.get).mockRejectedValue(error);

    render(<CartCreation onCartCreated={mockOnCartCreated} />);

    const input = screen.getByLabelText('Cart Name');
    await user.type(input, 'Grocery List');

    const button = screen.getByRole('button', { name: /add/i });
    await user.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating cart:', error);
    });

    consoleErrorSpy.mockRestore();
  });
});
