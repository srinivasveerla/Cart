import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoTile from '../TodoTile';
import { Todo } from '../../../types/todo';

describe('TodoTile', () => {
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();

  const mockTodo: Todo = {
    id: '1',
    userId: 'user123',
    title: 'Test Todo',
    description: 'Test description',
    priority: 'high',
    status: 'pending',
    dueDate: '2025-12-31',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    tags: ['work', 'urgent'],
  };

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnDelete.mockClear();
    mockOnEdit.mockClear();
  });

  it('should render todo with title', () => {
    render(
      <TodoTile
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('should render todo description', () => {
    render(
      <TodoTile
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should display priority chip', () => {
    render(
      <TodoTile
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('should display tags', () => {
    render(
      <TodoTile
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });

  it('should display due date', () => {
    render(
      <TodoTile
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Dec 31, 2025')).toBeInTheDocument();
  });

  it('should call onToggle when status icon is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoTile
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const statusButton = screen.getAllByRole('button')[0];
    await user.click(statusButton);

    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoTile
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByLabelText('Edit');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTodo);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoTile
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const deleteButton = screen.getByLabelText('Delete');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should show completed styling for completed todos', () => {
    const completedTodo = { ...mockTodo, status: 'completed' as const };
    render(
      <TodoTile
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const title = screen.getByText('Test Todo');
    expect(title).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('should show only first 2 tags and count', () => {
    const todoWithManyTags = {
      ...mockTodo,
      tags: ['tag1', 'tag2', 'tag3', 'tag4'],
    };

    render(
      <TodoTile
        todo={todoWithManyTags}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('should render without description', () => {
    const todoWithoutDesc = { ...mockTodo, description: undefined };
    render(
      <TodoTile
        todo={todoWithoutDesc}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });
});
