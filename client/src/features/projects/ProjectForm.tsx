import { useState, type FormEvent } from 'react';
import type { Project } from '../../api/projects';

interface ProjectFormProps {
  initialProject?: Project;
  onSubmit: (values: { name: string; description: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ProjectForm({ initialProject, onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
  const [name, setName] = useState(initialProject?.name ?? '');
  const [description, setDescription] = useState(initialProject?.description ?? '');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ name: name.trim(), description: description.trim() });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="project-name">Nombre</label>
        <input
          id="project-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="project-description">Descripción</label>
        <textarea
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {initialProject ? 'Guardar cambios' : 'Crear proyecto'}
      </button>
      <button type="button" onClick={onCancel} disabled={isSubmitting}>
        Cancelar
      </button>
    </form>
  );
}