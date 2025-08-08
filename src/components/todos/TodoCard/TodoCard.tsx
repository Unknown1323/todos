import React from 'react';
import { X, Edit2, Save } from 'lucide-react';
import type { TodoCardProps } from '../types';
import styles from './TodoCard.module.css';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { UniqueIdentifier } from '@dnd-kit/core';

interface DndTodoCardProps extends Omit<TodoCardProps, 'onDragStart' | 'isDraggedItem'> {
  activeId: UniqueIdentifier | null;
  editingData: {
    title: string;
  };
}

const TodoCard: React.FC<DndTodoCardProps> = ({ todo, isEditing, editingData, onStartEdit, onSaveEdit, onCancelEdit, onDelete, onEditChange }) => {
  const columnColor = {
    todo: '#ef4444',
    'in-progress': '#f59e0b',
    done: '#10b981',
  }[todo.status];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  const dragProps = isEditing ? {} : { ...listeners, ...attributes };

  return (
    <div ref={setNodeRef} style={style} {...dragProps} className={styles.cardWrapper} data-dragging={isDragging}>
      {isEditing ? (
        <div className={styles.editForm}>
          <input className={styles.editInput} value={editingData.title} onChange={(e) => onEditChange('title', e.target.value)} />
          <div className={styles.editActions}>
            <button onClick={onSaveEdit} className={styles.saveButton}>
              <Save className="w-3 h-3" />
            </button>
            <button onClick={onCancelEdit} className={styles.cancelButton}>
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.cardHeader}>
            <h4 className={styles.cardTitle}>{todo.title}</h4>
            <div className={styles.actions}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartEdit(todo);
                }}
                className={`${styles.iconButton} ${styles.editButton}`}
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(todo.id);
                }}
                className={`${styles.iconButton} ${styles.deleteButton}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className={styles.cardFooter}>
            <span>{new Date(todo.createdAt).toLocaleDateString('uk-UA')}</span>
            <div className={styles.statusIndicator} style={{ backgroundColor: columnColor }} />
          </div>
        </>
      )}
    </div>
  );
};

export default TodoCard;
