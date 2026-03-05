import React, { useState } from 'react';
import '../styles/OnboardingModal.css';

const OnboardingModal = ({ user, onComplete, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    due_date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.due_date) {
      alert('Por favor completa título y fecha');
      return;
    }
    onComplete(formData);
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        {/* Header */}
        <div className="onboarding-header">
          <h2>👋 ¡Bienvenido, {user?.email?.split('@')[0] || 'usuario'}!</h2>
          <p>Una pequeña tarea para comenzar</p>
        </div>

        {/* Contenido */}
        <div className="onboarding-content">
          <p className="onboarding-intro">
            Vamos a crear tu primera tarea para que empieces a organizarte. 
            ¡No te preocupes, puedes cambiarla después!
          </p>

          <form onSubmit={handleSubmit} className="onboarding-form">
            <div className="form-group">
              <label>Título de tu primera tarea</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Estudiar React, Comprar groceries, etc."
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Descripción (opcional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Agrega detalles si lo necesitas..."
                rows="3"
                maxLength={500}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoría</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Estudio">📚 Estudio</option>
                  <option value="Trabajo">💼 Trabajo</option>
                  <option value="Personal">🏠 Personal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fecha de vencimiento</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="onboarding-actions">
              <button type="button" className="btn-skip" onClick={onClose}>
                Saltar por ahora
              </button>
              <button type="submit" className="btn-create">
                Crear tarea
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
