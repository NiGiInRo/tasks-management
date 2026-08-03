import { useState } from 'react';
import type { Task } from '../../api/tasks';
import { TASK_STATUSES } from '../../api/tasks';
import { useCreateTask, useTasks } from './queries';
import { TaskForm } from './TaskForm';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  projectId: string;
}

function groupByStatus(tasks: Task[]): Record<Task['status'], Task[]> {
  const grouped: Record<Task['status'], Task[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
  for (const task of tasks) {
    grouped[task.status].push(task);
  }
  return grouped;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { data: tasks, isLoading, isError, error } = useTasks(projectId);
  const [isCreating, setIsCreating] = useState(false);
  const createTask = useCreateTask(projectId);

  if (isLoading) {
    return <p>Cargando tareas...</p>;
  }

  if (isError) {
    return <p role="alert">Error al cargar tareas: {error.message}</p>;
  }

  const tasksByStatus = groupByStatus(tasks ?? []);

  return (
    <div>
      {isCreating ? (
        <TaskForm
          isSubmitting={createTask.isPending}
          onCancel={() => setIsCreating(false)}
          onSubmit={({ title, description, priority }) => {
            createTask.mutate(
              { title, priority, ...(description ? { description } : {}) },
              { onSuccess: () => setIsCreating(false) },
            );
          }}
        />
      ) : (
        <button onClick={() => setIsCreating(true)}>Nueva tarea</button>
      )}

      {createTask.isError && <p role="alert">{createTask.error.message}</p>}

      <div style={{ display: 'flex', gap: '16px' }}>
        {TASK_STATUSES.map((status) => (
          <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
        ))}
      </div>
    </div>
  );
}