import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../api/projects';
import { ProjectForm } from './ProjectForm';
import { useDeleteProject, useUpdateProject } from './queries';

interface ProjectListItemProps {
  project: Project;
}

export function ProjectListItem({ project }: ProjectListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  if (isEditing) {
    return (
      <li>
        <ProjectForm
          initialProject={project}
          isSubmitting={updateProject.isPending}
          onCancel={() => setIsEditing(false)}
          onSubmit={({ name, description }) => {
            updateProject.mutate(
              { id: project.id, input: { name, description: description || null } },
              { onSuccess: () => setIsEditing(false) },
            );
          }}
        />
        {updateProject.isError && <p role="alert">{updateProject.error.message}</p>}
      </li>
    );
  }

  return (
    <li>
      <Link to={`/projects/${project.id}`}>{project.name}</Link>
      {project.description && <p>{project.description}</p>}

      <button onClick={() => setIsEditing(true)}>Editar</button>

      {isConfirmingDelete ? (
        <>
          <span>¿Eliminar este proyecto?</span>
          <button onClick={() => deleteProject.mutate(project.id)} disabled={deleteProject.isPending}>
            Sí, eliminar
          </button>
          <button onClick={() => setIsConfirmingDelete(false)}>Cancelar</button>
        </>
      ) : (
        <button onClick={() => setIsConfirmingDelete(true)}>Eliminar</button>
      )}

      {deleteProject.isError && <p role="alert">{deleteProject.error.message}</p>}
    </li>
  );
}