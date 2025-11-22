import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Fab,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  Checklist as ChecklistIcon,
  ShoppingCart as ShoppingCartIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTodos } from '../../context/TodoContext';
import { useUserContext } from '../../context/UserContext';
import TodoTileGrid from './TodoTileGrid';
import TodoCreationForm from './TodoCreationForm';
import { Todo, TodoStatus, TodoPriority, TodoFormData } from '../../types/todo';

type FilterStatus = 'all' | TodoStatus;
type SortOption = 'createdAt' | 'dueDate' | 'priority';

const TodoBoard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { todos, loading, error, addTodo, updateTodo, deleteTodo, toggleTodoStatus } = useTodos();
  const [formOpen, setFormOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<TodoPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredAndSortedTodos = useMemo(() => {
    let result = [...todos];

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter((todo) => todo.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      result = result.filter((todo) => todo.priority === filterPriority);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query) ||
          todo.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [todos, filterStatus, filterPriority, sortBy, searchQuery]);

  const handleAddTodo = async (todoData: TodoFormData) => {
    await addTodo(todoData);
  };

  const handleEditTodo = async (todoData: TodoFormData) => {
    if (editTodo) {
      await updateTodo(editTodo.id, todoData);
      setEditTodo(null);
    }
  };

  const handleOpenEdit = (todo: Todo) => {
    setEditTodo(todo);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditTodo(null);
  };

  const handleDelete = async (todoId: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await deleteTodo(todoId);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Todos
          </Typography>
          <Typography variant="body2">
            {user?.displayName}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }} role="presentation">
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            Navigation
          </Typography>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/todos'); setDrawerOpen(false); }}>
                <ListItemIcon>
                  <ChecklistIcon />
                </ListItemIcon>
                <ListItemText primary="My Todos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/dashboard'); setDrawerOpen(false); }}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Shopping Carts" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/'); setDrawerOpen(false); }}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
            My Todos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {todos.length} {todos.length === 1 ? 'todo' : 'todos'} total
          </Typography>
        </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters and Search */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: '200px', maxWidth: '400px' }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filterPriority}
            label="Priority"
            onChange={(e) => setFilterPriority(e.target.value as TodoPriority | 'all')}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          sx={{ ml: 'auto' }}
        >
          New Todo
        </Button>
      </Box>

      {/* Todo Grid */}
      <TodoTileGrid
        todos={filteredAndSortedTodos}
        onToggle={toggleTodoStatus}
        onDelete={handleDelete}
        onEdit={handleOpenEdit}
      />

      {/* Creation/Edit Form */}
      <TodoCreationForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={editTodo ? handleEditTodo : handleAddTodo}
        editTodo={editTodo}
      />

        {/* Floating Action Button (mobile) */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setFormOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' },
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default TodoBoard;
