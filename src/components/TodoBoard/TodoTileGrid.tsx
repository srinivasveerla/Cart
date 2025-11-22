import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import TodoTile from './TodoTile';
import { Todo } from '../../types/todo';

interface TodoTileGridProps {
  todos: Todo[];
  onToggle: (todoId: string) => void;
  onDelete: (todoId: string) => void;
  onEdit: (todo: Todo) => void;
}

const TodoTileGrid: React.FC<TodoTileGridProps> = ({ todos, onToggle, onDelete, onEdit }) => {
  if (todos.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center',
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No todos yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first todo to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {todos.map((todo) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={todo.id}>
          <TodoTile
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TodoTileGrid;
