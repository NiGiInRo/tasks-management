import { useState, type FormEvent } from 'react';
import type { Task, TaskPriority, TaskStatus } from '../../api/tasks';
import { PRIORITY_LABELS, STATUS_LABELS, TASK_PRIORITIES, TASK_STATUSES } from '../../api/tasks';

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (values: {
    title: string;
    description: string;
    priority: TaskPriority;
    status?: TaskStatus;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function TaskForm({ initialTask, onSubmit, onCancel, isSubmitting }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority ?? 'MEDIUM');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? 'TODO');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      ...(initialTask ? { status } : {}),
    });
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="task-title">Título</label>
        <input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="task-description">Descripción</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="task-priority">Prioridad</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
      </div>
      {initialTask && (
        <div className="field">
          <label htmlFor="task-status">Estado</label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {initialTask ? 'Guardar cambios' : 'Crear tarea'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
