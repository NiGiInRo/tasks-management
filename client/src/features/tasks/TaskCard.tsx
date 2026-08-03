import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskPriority } from '../../api/tasks';
import { PRIORITY_LABELS } from '../../api/tasks';
import { TaskForm } from './TaskForm';
import { useDeleteTask, useUpdateTask } from './queries';

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  LOW: '#6b7280',
  MEDIUM: '#b45309',
  HIGH: '#b91c1c',
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const updateTask = useUpdateTask(task.projectId);
  const deleteTask = useDeleteTask(task.projectId);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: isEditing,
  });

  if (isEditing) {
    return (
      <li>
        <TaskForm
          initialTask={task}
          isSubmitting={updateTask.isPending}
          onCancel={() => setIsEditing(false)}
          onSubmit={({ title, description, priority, status }) => {
            updateTask.mutate(
              { id: task.id, input: { title, description: description || null, priority, status } },
              { onSuccess: () => setIsEditing(false) },
            );
          }}
        />
        {updateTask.isError && <p role="alert">{updateTask.error.message}</p>}
      </li>
    );
  }

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      <strong>{task.title}</strong>{' '}
      <span style={{ color: PRIORITY_COLOR[task.priority] }}>{PRIORITY_LABELS[task.priority]}</span>
      {task.description && <p>{task.description}</p>}

      <button onClick={() => setIsEditing(true)}>Editar</button>

      {isConfirmingDelete ? (
        <>
          <span>¿Eliminar esta tarea?</span>
          <button onClick={() => deleteTask.mutate(task.id)} disabled={deleteTask.isPending}>
            Sí, eliminar
          </button>
          <button onClick={() => setIsConfirmingDelete(false)}>Cancelar</button>
        </>
      ) : (
        <button onClick={() => setIsConfirmingDelete(true)}>Eliminar</button>
      )}

      {deleteTask.isError && <p role="alert">{deleteTask.error.message}</p>}
    </li>
  );
}