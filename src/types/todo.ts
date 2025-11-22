export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoStatus = 'pending' | 'completed' | 'overdue';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  subtasks?: Record<string, Subtask>;
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority: TodoPriority;
  dueDate?: string;
  tags?: string[];
}
