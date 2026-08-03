import { useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { Task, TaskStatus } from '../../api/tasks';
import { TASK_STATUSES } from '../../api/tasks';
import { useCreateTask, useTasks, useUpdateTask } from './queries';
import { TaskForm } from './TaskForm';
import { KanbanColumn } from './KanbanColumn';
import './KanbanBoard.css';

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
  const updateTask = useUpdateTask(projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = tasks?.find((t) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    updateTask.mutate({ id: taskId, input: { status: newStatus } });
  }

  if (isLoading) {
    return <p>Cargando tareas...</p>;
  }

  if (isError) {
    return <p role="alert" className="alert-error">Error al cargar tareas: {error.message}</p>;
  }

  const tasksByStatus = groupByStatus(tasks ?? []);

  return (
    <div>
      <div className="kanban-board__toolbar">
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
          <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
            Nueva tarea
          </button>
        )}

        {createTask.isError && <p role="alert" className="alert-error">{createTask.error.message}</p>}
        {updateTask.isError && <p role="alert" className="alert-error">{updateTask.error.message}</p>}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {TASK_STATUSES.map((status) => (
            <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
