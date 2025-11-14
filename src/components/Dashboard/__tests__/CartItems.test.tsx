import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartItems from '../CartItems';
import * as firebaseDb from 'firebase/database';
import { render } from '../../../test/test-utils';

// Mock firebase/database
vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  push: vi.fn(),
  remove: vi.fn(),
}));

describe('CartItems Component', () => {
  const mockItems = {
    'item-1': { name: 'Apples', quantity: '5', addedBy: 'John' },
    'item-2': { name: 'Milk', quantity: '2L', addedBy: 'Jane' },
  };

  const mockNewItemRef = { key: 'new-item-123' };

  beforeEach(() => {
    vi.clearAllMocks();
    (firebaseDb.push as any).mockReturnValue(mockNewItemRef);
  });

  it('should render item list with existing items', () => {
    render(<CartItems cartId="cart-123" items={mockItems} />);

    expect(screen.getByText(/apples - 5/i)).toBeInTheDocument();
    expect(screen.getByText(/milk - 2L/i)).toBeInTheDocument();
  });

  it('should render add item form', () => {
    render(<CartItems cartId="cart-123" items={mockItems} />);

    expect(screen.getByLabelText('Item Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });

  it('should disable add item button when item name is empty', () => {
    render(<CartItems cartId="cart-123" items={mockItems} />);

    const button = screen.getByRole('button', { name: /add item/i });
    expect(button).toBeDisabled();
  });

  it('should enable add item button when item name is entered', async () => {
    const user = userEvent.setup();
    render(<CartItems cartId="cart-123" items={mockItems} />);

    const input = screen.getByLabelText('Item Name');
    await user.type(input, 'Bread');

    const button = screen.getByRole('button', { name: /add item/i });
    expect(button).not.toBeDisabled();
  });

  it('should show alert when trying to add item without name', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation();

    render(<CartItems cartId="cart-123" items={mockItems} />);

    const button = screen.getByRole('button', { name: /add item/i });
    await user.click(button);

    expect(alertSpy).toHaveBeenCalledWith('Item name is required!');

    alertSpy.mockRestore();
  });

  it('should add item successfully with name and quantity', async () => {
    const user = userEvent.setup();

    (firebaseDb.set as any).mockResolvedValue(undefined);

    render(<CartItems cartId="cart-123" items={mockItems} />);

    const itemNameInput = screen.getByLabelText('Item Name');
    const quantityInput = screen.getByLabelText('Quantity');
    const button = screen.getByRole('button', { name: /add item/i });

    await user.type(itemNameInput, 'Bread');
    await user.type(quantityInput, '2');
    await user.click(button);

    await waitFor(() => {
      expect(firebaseDb.set).toHaveBeenCalled();
    });
  });

  it('should add item successfully with name only', async () => {
    const user = userEvent.setup();

    (firebaseDb.set as any).mockResolvedValue(undefined);

    render(<CartItems cartId="cart-123" items={mockItems} />);

    const itemNameInput = screen.getByLabelText('Item Name');
    const button = screen.getByRole('button', { name: /add item/i });

    await user.type(itemNameInput, 'Eggs');
    await user.click(button);

    await waitFor(() => {
      expect(firebaseDb.set).toHaveBeenCalled();
    });
  });

  it('should clear inputs after adding item', async () => {
    const user = userEvent.setup();

    (firebaseDb.set as any).mockResolvedValue(undefined);

    render(<CartItems cartId="cart-123" items={mockItems} />);

    const itemNameInput = screen.getByLabelText('Item Name') as HTMLInputElement;
    const quantityInput = screen.getByLabelText('Quantity') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /add item/i });

    await user.type(itemNameInput, 'Bread');
    await user.type(quantityInput, '2');
    await user.click(button);

    await waitFor(() => {
      expect(itemNameInput.value).toBe('');
      expect(quantityInput.value).toBe('');
    });
  });

  it('should remove item on double click', async () => {
    (firebaseDb.remove as any).mockResolvedValue(undefined);

    render(<CartItems cartId="cart-123" items={mockItems} />);

    const itemElement = screen.getByText(/apples - 5/i);
    fireEvent.doubleClick(itemElement.closest('div'));

    await waitFor(() => {
      expect(firebaseDb.remove).toHaveBeenCalled();
    });
  });

  it('should handle add item errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
    const error = new Error('Database error');

    vi.mocked(firebaseDb.set).mockRejectedValue(error);

    render(<CartItems cartId="cart-123" items={mockItems} />);

    const itemNameInput = screen.getByLabelText('Item Name');
    const button = screen.getByRole('button', { name: /add item/i });

    await user.type(itemNameInput, 'Bread');
    await user.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding item:', error);
    });

    consoleErrorSpy.mockRestore();
  });

  it('should handle remove item errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
    const error = new Error('Database error');

    vi.mocked(firebaseDb.remove).mockRejectedValue(error);

    render(<CartItems cartId="cart-123" items={mockItems} />);

    const itemElement = screen.getByText(/apples - 5/i);
    fireEvent.doubleClick(itemElement.closest('div'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error removing item:', error);
    });

    consoleErrorSpy.mockRestore();
  });

  it('should display item without quantity when quantity is empty', () => {
    const itemsWithoutQuantity = {
      'item-1': { name: 'Apples', quantity: '', addedBy: 'John' },
    };

    render(<CartItems cartId="cart-123" items={itemsWithoutQuantity} />);

    expect(screen.getByText('Apples')).toBeInTheDocument();
  });
});
