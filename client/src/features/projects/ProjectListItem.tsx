import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../api/projects';
import { ProjectForm } from './ProjectForm';
import { useDeleteProject, useUpdateProject } from './queries';
import './ProjectListItem.css';

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
        {updateProject.isError && <p role="alert" className="alert-error">{updateProject.error.message}</p>}
      </li>
    );
  }

  return (
    <li className="card project-item">
      <div className="project-item__main">
        <Link to={`/projects/${project.id}`} className="project-item__title">
          {project.name}
        </Link>
        {project.description && <p className="project-item__description">{project.description}</p>}
      </div>

      <div className="project-item__actions">
        <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
          Editar
        </button>

        {isConfirmingDelete ? (
          <span className="confirm-delete">
            ¿Eliminar este proyecto?
            <button
              className="btn btn-danger"
              onClick={() => deleteProject.mutate(project.id)}
              disabled={deleteProject.isPending}
            >
              Sí, eliminar
            </button>
            <button className="btn btn-secondary" onClick={() => setIsConfirmingDelete(false)}>
              Cancelar
            </button>
          </span>
        ) : (
          <button className="btn btn-danger" onClick={() => setIsConfirmingDelete(true)}>
            Eliminar
          </button>
        )}
      </div>

      {deleteProject.isError && <p role="alert" className="alert-error">{deleteProject.error.message}</p>}
    </li>
  );
}
