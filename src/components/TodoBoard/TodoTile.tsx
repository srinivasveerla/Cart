import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Todo, TodoPriority } from '../../types/todo';

interface TodoTileProps {
  todo: Todo;
  onToggle: (todoId: string) => void;
  onDelete: (todoId: string) => void;
  onEdit: (todo: Todo) => void;
}

const priorityColors: Record<TodoPriority, string> = {
  high: '#ff5252',
  medium: '#ff9800',
  low: '#4caf50',
};

const priorityLabels: Record<TodoPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const TodoTile: React.FC<TodoTileProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const isCompleted = todo.status === 'completed';
  const isOverdue = todo.status === 'overdue';

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card
      sx={{
        height: '220px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: isCompleted ? '#f5f5f5' : '#fff',
        borderLeft: `4px solid ${priorityColors[todo.priority]}`,
        opacity: isCompleted ? 0.7 : 1,
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
          '& .action-buttons': {
            opacity: 1,
          },
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Status Icon */}
        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(todo.id);
            }}
            sx={{ color: isCompleted ? 'success.main' : 'text.secondary' }}
          >
            {isCompleted ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
          </IconButton>
        </Box>

        {/* Action Buttons */}
        <Box
          className="action-buttons"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(todo);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(todo.id);
              }}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            mt: 5,
            mb: 1,
            fontSize: '1.1rem',
            fontWeight: 600,
            textDecoration: isCompleted ? 'line-through' : 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {todo.title}
        </Typography>

        {/* Description */}
        {todo.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1,
            }}
          >
            {todo.description}
          </Typography>
        )}

        {/* Tags */}
        {todo.tags && todo.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {todo.tags.slice(0, 2).map((tag, index) => (
              <Chip key={index} label={tag} size="small" sx={{ fontSize: '0.7rem' }} />
            ))}
            {todo.tags.length > 2 && (
              <Chip label={`+${todo.tags.length - 2}`} size="small" sx={{ fontSize: '0.7rem' }} />
            )}
          </Box>
        )}
      </CardContent>

      {/* Footer */}
      <Box
        sx={{
          px: 2,
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Due Date */}
        {todo.dueDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarIcon sx={{ fontSize: '0.9rem', color: isOverdue ? 'error.main' : 'text.secondary' }} />
            <Typography
              variant="caption"
              sx={{
                color: isOverdue ? 'error.main' : 'text.secondary',
                fontWeight: isOverdue ? 600 : 400,
              }}
            >
              {formatDate(todo.dueDate)}
            </Typography>
          </Box>
        )}

        {/* Priority Chip */}
        <Chip
          label={priorityLabels[todo.priority]}
          size="small"
          sx={{
            backgroundColor: priorityColors[todo.priority],
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />
      </Box>
    </Card>
  );
};

export default React.memo(TodoTile);
