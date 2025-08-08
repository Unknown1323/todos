import React, { useState } from 'react';
import type { Todo } from '../types';
import AddTodoForm from '../AddTodoForm/AddTodoForm';
import TodoColumn from '../TodoColumn/TodoColumn';
import Spinner from '../../../ui/Spinner';
import { useGetTodosQuery, useUpdateTodoMutation, useDeleteTodoMutation } from '../../../api/todoApi';
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor, KeyboardSensor, DragOverlay } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { DragEndEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import TodoCard from '../TodoCard/TodoCard';
import styles from './TodoBoard.module.css';

const TodoBoard: React.FC = () => {
  const { data: todos, isLoading, isError } = useGetTodosQuery();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '' });
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditData({ title: todo.title });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateTodo({ id: editingId, ...editData });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: '' });
  };

  const handleEditChange = (field: 'title', value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);

    const draggedTodo = todos?.find((t) => t.id === active.id);
    setActiveTodo(draggedTodo || null);

    if (editingId) {
      cancelEdit();
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveTodo(null);

    if (!over || active.id === over.id) return;

    const draggedTodo = todos?.find((t) => t.id === active.id);
    const newStatus = over.id as Todo['status'];

    if (draggedTodo && draggedTodo.status !== newStatus) {
      try {
        await updateTodo({ id: active.id as string, status: newStatus });
      } catch (error) {
        console.error('Помилка оновлення статусу:', error);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveTodo(null);
  };

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) return <div className={styles.error}>Помилка завантаження завдань.</div>;
  if (!todos) return <div className={styles.notFound}>Завдань не знайдено.</div>;

  const todosByStatus = {
    todo: todos.filter((t) => t.status === 'todo'),
    'in-progress': todos.filter((t) => t.status === 'in-progress'),
    done: todos.filter((t) => t.status === 'done'),
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: '#ef4444' },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
    { id: 'done', title: 'Done', color: '#10b981' },
  ] as const;

  return (
    <div className={styles.boardWrapper}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
        <div className={styles.boardContent}>
          <h1 className={styles.boardTitle}>ToDo Board</h1>
          <AddTodoForm />
          <div className={styles.columnsContainer}>
            {columns.map((column) => (
              <TodoColumn
                key={column.id}
                id={column.id as Todo['status']}
                title={column.title}
                color={column.color}
                todos={todosByStatus[column.id as keyof typeof todosByStatus]}
                onDelete={deleteTodo}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onEditChange={handleEditChange}
                editingId={editingId}
                activeId={activeId}
                editData={editData}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTodo && (
            <TodoCard
              todo={activeTodo}
              isEditing={false}
              editingData={editData}
              onStartEdit={() => {}}
              onSaveEdit={() => {}}
              onCancelEdit={() => {}}
              onDelete={() => {}}
              onEditChange={() => {}}
              activeId={activeId}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TodoBoard;
