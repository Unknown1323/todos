import React from 'react';
import type { TodoColumnProps } from '../types';
import TodoCard from '../TodoCard/TodoCard';
import styles from './TodoColumn.module.css';
import { useDroppable } from '@dnd-kit/core';
import type { UniqueIdentifier } from '@dnd-kit/core';

interface DndTodoColumnProps extends Omit<TodoColumnProps, 'onDrop' | 'onDragOver' | 'onDragStart' | 'draggedItem'> {
  activeId: UniqueIdentifier | null;
}

const TodoColumn: React.FC<DndTodoColumnProps> = ({
  id,
  title,
  color,
  todos,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditChange,
  editingId,
  editData,
  activeId,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const columnClasses = `${styles.columnWrapper} ${isOver ? styles.isOver : ''}`;

  return (
    <div ref={setNodeRef} className={columnClasses}>
      <div className={styles.columnHeader} style={{ borderBottom: `3px solid ${color}` }}>
        <div className={styles.headerDot} style={{ backgroundColor: color }} />
        <h3 className={styles.columnTitle}>{title}</h3>
        <span className={styles.todoCount}>{todos.length}</span>
      </div>
      <div className={styles.todoList}>
        {todos.map((todo) =>
          todo.id === activeId ? null : (
            <TodoCard
              key={todo.id}
              todo={todo}
              isEditing={editingId === todo.id}
              editingData={editData}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={() => onCancelEdit()}
              onDelete={onDelete}
              onEditChange={onEditChange}
              activeId={activeId}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TodoColumn;
