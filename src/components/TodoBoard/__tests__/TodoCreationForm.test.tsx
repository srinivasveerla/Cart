import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoCreationForm from '../TodoCreationForm';

describe('TodoCreationForm', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });

  it('should render form when open', () => {
    render(
      <TodoCreationForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Create New Todo')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <TodoCreationForm
        open={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText('Create New Todo')).not.toBeInTheDocument();
  });

  it('should call onSubmit with form data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <TodoCreationForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    await user.type(screen.getByLabelText(/Title/i), 'New Todo');
    await user.type(screen.getByLabelText(/Description/i), 'Test description');

    const submitButton = screen.getByRole('button', { name: /Create/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Todo',
        description: 'Test description',
        priority: 'medium',
        dueDate: undefined,
        tags: undefined,
      });
    });
  });

  it('should show error when title is empty', async () => {
    const user = userEvent.setup();

    render(
      <TodoCreationForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const titleInput = screen.getByLabelText(/Title/i);
    await user.type(titleInput, 'a');
    await user.clear(titleInput);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('should call onClose when cancel is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TodoCreationForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should add tags to the form', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <TodoCreationForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    await user.type(screen.getByLabelText(/Title/i), 'New Todo');
    await user.type(screen.getByLabelText(/Add Tag/i), 'urgent');
    await user.click(screen.getByRole('button', { name: '' })); // Add tag button

    expect(screen.getByText('urgent')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Create/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ['urgent'],
        })
      );
    });
  });

  it('should show edit mode title when editing', () => {
    const editTodo = {
      id: '1',
      userId: 'user123',
      title: 'Edit Me',
      priority: 'high' as const,
      status: 'pending' as const,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    };

    render(
      <TodoCreationForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        editTodo={editTodo}
      />
    );

    expect(screen.getByText('Edit Todo')).toBeInTheDocument();
  });

  it('should populate form with edit data', () => {
    const editTodo = {
      id: '1',
      userId: 'user123',
      title: 'Edit Me',
      description: 'Old description',
      priority: 'high' as const,
      status: 'pending' as const,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    };

    render(
      <TodoCreationForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        editTodo={editTodo}
      />
    );

    expect(screen.getByDisplayValue('Edit Me')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Old description')).toBeInTheDocument();
  });
});
