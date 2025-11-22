import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ref, onValue, push, set, remove, update } from 'firebase/database';
import { database } from '../auth/firebaseConfig';
import { Todo, TodoFormData, TodoStatus } from '../types/todo';
import { useUserContext } from './UserContext';

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (todoData: TodoFormData) => Promise<void>;
  updateTodo: (todoId: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  toggleTodoStatus: (todoId: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const { user } = useUserContext();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    const todosRef = ref(database, `todos/${user.uid}`);

    const unsubscribe = onValue(
      todosRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const todosArray = Object.entries(data).map(([id, todo]) => ({
            ...(todo as Omit<Todo, 'id'>),
            id,
          }));

          // Update status based on due date
          const updatedTodos = todosArray.map((todo) => {
            if (todo.status !== 'completed' && todo.dueDate) {
              const now = new Date();
              const dueDate = new Date(todo.dueDate);
              if (dueDate < now) {
                return { ...todo, status: 'overdue' as TodoStatus };
              }
            }
            return todo;
          });

          // Sort by creation date (newest first)
          updatedTodos.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setTodos(updatedTodos);
        } else {
          setTodos([]);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching todos:', err);
        setError('Failed to load todos');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTodo = async (todoData: TodoFormData): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to add todos');
    }

    try {
      const todosRef = ref(database, `todos/${user.uid}`);
      const newTodoRef = push(todosRef);

      const now = new Date().toISOString();
      const todo: Omit<Todo, 'id'> = {
        userId: user.uid,
        title: todoData.title,
        description: todoData.description,
        priority: todoData.priority,
        status: 'pending',
        dueDate: todoData.dueDate,
        createdAt: now,
        updatedAt: now,
        tags: todoData.tags || [],
      };

      await set(newTodoRef, todo);
    } catch (err) {
      console.error('Error adding todo:', err);
      throw new Error('Failed to add todo');
    }
  };

  const updateTodo = async (todoId: string, updates: Partial<Todo>): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to update todos');
    }

    try {
      const todoRef = ref(database, `todos/${user.uid}/${todoId}`);
      await update(todoRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error updating todo:', err);
      throw new Error('Failed to update todo');
    }
  };

  const deleteTodo = async (todoId: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to delete todos');
    }

    try {
      const todoRef = ref(database, `todos/${user.uid}/${todoId}`);
      await remove(todoRef);
    } catch (err) {
      console.error('Error deleting todo:', err);
      throw new Error('Failed to delete todo');
    }
  };

  const toggleTodoStatus = async (todoId: string): Promise<void> => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) {
      throw new Error('Todo not found');
    }

    const newStatus: TodoStatus = todo.status === 'completed' ? 'pending' : 'completed';
    await updateTodo(todoId, { status: newStatus });
  };

  const value: TodoContextType = {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
