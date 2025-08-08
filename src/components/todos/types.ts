export interface Todo {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
}

export type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export interface TodoCardProps {
  todo: Todo;
  isEditing: boolean;
  onStartEdit: (todo: Todo) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onEditChange: (field: 'title', value: string) => void;
  editingData: {
    title: string;
  };
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  isDraggedItem: boolean;
}

export interface TodoColumnProps {
  id: 'todo' | 'in-progress' | 'done';
  title: string;
  color: string;
  todos: Todo[];
  onDrop: (e: React.DragEvent, status: Todo['status']) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDelete: (id: string) => void;
  onStartEdit: (todo: Todo) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditChange: (field: 'title', value: string) => void;
  editingId: string | null;
  editData: { title: string };
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  draggedItem: Todo | null;
}
