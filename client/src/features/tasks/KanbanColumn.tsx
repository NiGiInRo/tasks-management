import type { Task, TaskStatus } from '../../api/tasks';
import { useDroppable } from '@dnd-kit/core';
import { STATUS_LABELS } from '../../api/tasks';
import { TaskCard } from './TaskCard';
import './KanbanColumn.css';

const STATUS_MODIFIER: Record<TaskStatus, string> = {
  TODO: '',
  IN_PROGRESS: 'kanban-column--in-progress',
  DONE: 'kanban-column--done',
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const className = ['kanban-column', STATUS_MODIFIER[status], isOver ? 'kanban-column--over' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={setNodeRef} className={className}>
      <h2 className="kanban-column__title">{STATUS_LABELS[status]}</h2>
      {tasks.length === 0 ? (
        <p className="kanban-column__empty">Sin tareas</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  );
}
