import type { Task, TaskStatus } from '../../api/tasks';
import { STATUS_LABELS } from '../../api/tasks';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  return (
    <div>
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