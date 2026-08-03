import { useState } from 'react';
import { useCreateProject, useProjects } from './queries';
import { ProjectForm } from './ProjectForm';
import { ProjectListItem } from './ProjectListItem';
import './ProjectsPage.css';

export function ProjectsPage() {
  const { data: projects, isLoading, isError, error } = useProjects();
  const [isCreating, setIsCreating] = useState(false);
  const createProject = useCreateProject();

  if (isLoading) {
    return <p>Cargando proyectos...</p>;
  }

  if (isError) {
    return <p role="alert" className="alert-error">Error al cargar proyectos: {error.message}</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Proyectos</h1>
        {!isCreating && (
          <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
            Nuevo proyecto
          </button>
        )}
      </div>

      {isCreating && (
        <ProjectForm
          isSubmitting={createProject.isPending}
          onCancel={() => setIsCreating(false)}
          onSubmit={({ name, description }) => {
            createProject.mutate(
              { name, ...(description ? { description } : {}) },
              { onSuccess: () => setIsCreating(false) },
            );
          }}
        />
      )}

      {createProject.isError && <p role="alert" className="alert-error">{createProject.error.message}</p>}

      {projects && projects.length === 0 ? (
        <p className="project-empty">Todavía no hay proyectos. Creá el primero.</p>
      ) : (
        <ul className="project-list">
          {projects?.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </ul>
      )}
    </div>
  );
}
