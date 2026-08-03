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
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="project-name">Nombre</label>
        <input
          id="project-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="project-description">Descripción</label>
        <textarea
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {initialProject ? 'Guardar cambios' : 'Crear proyecto'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
