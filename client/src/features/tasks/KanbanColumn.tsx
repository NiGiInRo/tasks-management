import type { Task, TaskStatus } from '../../api/tasks';
import { useDroppable } from '@dnd-kit/core';
import { STATUS_LABELS } from '../../api/tasks';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      style={{ minHeight: 120, background: isOver ? '#eef2ff' : undefined }}
    >
      <h2>{STATUS_LABELS[status]}</h2>
      {tasks.length === 0 ? (
        <p>Sin tareas</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  );
}