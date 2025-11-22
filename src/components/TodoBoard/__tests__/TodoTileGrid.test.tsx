import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TodoTileGrid from '../TodoTileGrid';
import { Todo } from '../../../types/todo';

describe('TodoTileGrid', () => {
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();

  const mockTodos: Todo[] = [
    {
      id: '1',
      userId: 'user123',
      title: 'Todo 1',
      description: 'Description 1',
      priority: 'high',
      status: 'pending',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      userId: 'user123',
      title: 'Todo 2',
      description: 'Description 2',
      priority: 'medium',
      status: 'completed',
      createdAt: '2025-01-02T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    },
  ];

  it('should render empty state when no todos', () => {
    render(
      <TodoTileGrid
        todos={[]}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('No todos yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first todo to get started!')).toBeInTheDocument();
  });

  it('should render all todos in grid', () => {
    render(
      <TodoTileGrid
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should render todos with descriptions', () => {
    render(
      <TodoTileGrid
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('should render correct number of todo tiles', () => {
    const { container } = render(
      <TodoTileGrid
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const tiles = container.querySelectorAll('.MuiCard-root');
    expect(tiles).toHaveLength(2);
  });
});
