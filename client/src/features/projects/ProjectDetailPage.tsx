import { Link, useParams } from 'react-router-dom';
import { useProject } from './queries';
import { KanbanBoard } from '../tasks/KanbanBoard';
import './ProjectDetailPage.css';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError, error } = useProject(id ?? '');

  return (
    <div>
      <Link to="/projects" className="back-link">← Volver a proyectos</Link>

      {isLoading && <p>Cargando proyecto...</p>}
      {isError && <p role="alert" className="alert-error">Error: {error.message}</p>}
      {project && (
        <>
          <div className="project-header">
            <h1>{project.name}</h1>
            <p className="muted">{project.description}</p>
          </div>
          <KanbanBoard projectId={project.id} />
        </>
      )}
    </div>
  );
}
