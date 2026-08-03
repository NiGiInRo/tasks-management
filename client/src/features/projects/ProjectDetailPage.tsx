import { Link, useParams } from 'react-router-dom';
import { useProject } from './queries';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError, error } = useProject(id ?? '');

  return (
    <div>
      <Link to="/projects">← Volver a proyectos</Link>

      {isLoading && <p>Cargando proyecto...</p>}
      {isError && <p role="alert">Error: {error.message}</p>}
      {project && (
        <>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <p><em>Tablero kanban — HU-4</em></p>
        </>
      )}
    </div>
  );
}