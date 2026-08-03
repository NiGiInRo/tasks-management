import { useState } from 'react';
import { useCreateProject, useProjects } from './queries';
import { ProjectForm } from './ProjectForm';
import { ProjectListItem } from './ProjectListItem';

export function ProjectsPage() {
  const { data: projects, isLoading, isError, error } = useProjects();
  const [isCreating, setIsCreating] = useState(false);
  const createProject = useCreateProject();

  if (isLoading) {
    return <p>Cargando proyectos...</p>;
  }

  if (isError) {
    return <p role="alert">Error al cargar proyectos: {error.message}</p>;
  }

  return (
    <div>
      <h1>Proyectos</h1>

      {isCreating ? (
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
      ) : (
        <button onClick={() => setIsCreating(true)}>Nuevo proyecto</button>
      )}

      {createProject.isError && <p role="alert">{createProject.error.message}</p>}

      {projects && projects.length === 0 ? (
        <p>Todavía no hay proyectos. Creá el primero.</p>
      ) : (
        <ul>
          {projects?.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </ul>
      )}
    </div>
  );
}