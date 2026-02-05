// Types for the todo application
export interface TodoItem {
  id: string;
  title: string;
  deadline: string;
  status: TodoStatus;
  subtasks?: string[];
}

export type TodoStatus = 'Urgent' | 'important but not Urgent' | 'safe';

export const TODO_STATUS_OPTIONS: TodoStatus[] = [
  'Urgent',
  'important but not Urgent',
  'safe'
];

export const STATUS_COLORS: Record<TodoStatus, string> = {
  'Urgent': 'text-red-600',
  'important but not Urgent': 'text-yellow-500',
  'safe': 'text-green-500'
};

// Utility functions for data management
export class TodoStorage {
  private static readonly STORAGE_KEY = 'todoCards';

  static getTodos(): TodoItem[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing todo data:', error);
      // Clear corrupted data
      this.clearTodos();
      return [];
    }
  }

  static saveTodos(todos: TodoItem[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todo data:', error);
    }
  }

  static addTodo(todo: Omit<TodoItem, 'id'>): TodoItem {
    const todos = this.getTodos();
    const newTodo: TodoItem = {
      ...todo,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    todos.push(newTodo);
    this.saveTodos(todos);
    return newTodo;
  }

  static deleteTodo(id: string): void {
    const todos = this.getTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    this.saveTodos(filteredTodos);
  }

  static clearTodos(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Migration function for old string-based data
  static migrateFromLegacyFormat(): void {
    if (typeof window === 'undefined') return;

    const legacyData = localStorage.getItem('Cards');
    if (!legacyData || legacyData.trim() === '') return;

    try {
      const todos: TodoItem[] = [];
      const cards = legacyData.split('$$').filter(Boolean);

      for (const card of cards) {
        const parts = card.split('%%');
        if (parts.length === 3) {
          const [title, deadline, status] = parts;
          if (title && deadline && status && TODO_STATUS_OPTIONS.includes(status as TodoStatus)) {
            todos.push({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              title: title.trim(),
              deadline: deadline.trim(),
              status: status as TodoStatus
            });
          }
        }
      }

      if (todos.length > 0) {
        this.saveTodos(todos);
        localStorage.removeItem('Cards'); // Remove legacy data
        console.log(`Migrated ${todos.length} todos from legacy format`);
      }
    } catch (error) {
      console.error('Error migrating legacy data:', error);
    }
  }
}

// Subtask management utilities
export class SubtaskStorage {
  static getSubtasks(todoTitle: string): string[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(`subtasks_${todoTitle}`);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing subtasks:', error);
      return [];
    }
  }

  static saveSubtasks(todoTitle: string, subtasks: string[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(`subtasks_${todoTitle}`, JSON.stringify(subtasks));
    } catch (error) {
      console.error('Error saving subtasks:', error);
    }
  }

  static addSubtask(todoTitle: string, subtask: string): void {
    const subtasks = this.getSubtasks(todoTitle);
    subtasks.push(subtask.trim());
    this.saveSubtasks(todoTitle, subtasks);
  }

  static deleteSubtask(todoTitle: string, subtask: string): void {
    const subtasks = this.getSubtasks(todoTitle);
    const filtered = subtasks.filter(task => task !== subtask);
    this.saveSubtasks(todoTitle, filtered);
  }

  // Migration function for old subtask format
  static migrateLegacySubtasks(): void {
    if (typeof window === 'undefined') return;

    // Get all localStorage keys that might be subtask keys (not our new format)
    const keys = Object.keys(localStorage);
    const legacyKeys = keys.filter(key =>
      !key.startsWith('subtasks_') &&
      !key.startsWith('todoCards') &&
      key !== 'Cards'
    );

    for (const key of legacyKeys) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const subtasks = data.split('%%').filter(Boolean);
          if (subtasks.length > 0) {
            this.saveSubtasks(key, subtasks);
            localStorage.removeItem(key);
            console.log(`Migrated subtasks for "${key}"`);
          }
        }
      } catch (error) {
        console.error(`Error migrating subtasks for "${key}":`, error);
      }
    }
  }
}