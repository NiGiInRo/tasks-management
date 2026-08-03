import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../api/tasks';
import { PRIORITY_LABELS } from '../../api/tasks';
import { TaskForm } from './TaskForm';
import { useDeleteTask, useUpdateTask } from './queries';
import './TaskCard.css';

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
        {updateTask.isError && <p role="alert" className="alert-error">{updateTask.error.message}</p>}
      </li>
    );
  }

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`card task-card${isDragging ? ' task-card--dragging' : ''}`}
      style={{ transform: CSS.Translate.toString(transform) }}
    >
      <div className="task-card__header">
        <strong className="task-card__title">{task.title}</strong>
        <span className={`badge badge-${task.priority.toLowerCase()}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {task.description && <p className="task-card__description">{task.description}</p>}

      <div className="task-card__actions">
        <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
          Editar
        </button>

        {isConfirmingDelete ? (
          <span className="confirm-delete">
            ¿Eliminar esta tarea?
            <button
              className="btn btn-danger"
              onClick={() => deleteTask.mutate(task.id)}
              disabled={deleteTask.isPending}
            >
              Sí, eliminar
            </button>
            <button className="btn btn-secondary" onClick={() => setIsConfirmingDelete(false)}>
              Cancelar
            </button>
          </span>
        ) : (
          <button className="btn btn-danger" onClick={() => setIsConfirmingDelete(true)}>
            Eliminar
          </button>
        )}
      </div>

      {deleteTask.isError && <p role="alert" className="alert-error">{deleteTask.error.message}</p>}
    </li>
  );
}
