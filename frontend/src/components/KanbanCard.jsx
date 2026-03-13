import React from 'react';
import '../styles/KanbanCard.css';

const KanbanCard = ({ task, onDragStart }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Estudio: '#3498db',
      Trabajo: '#e74c3c',
      Personal: '#2ecc71'
    };
    return colors[category] || '#95a5a6';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <div
      className={`kanban-card ${isOverdue ? 'overdue' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
    >
      <div className="card-category">
        <span
          className="category-badge"
          style={{ backgroundColor: getCategoryColor(task.category) }}
        >
          {task.category}
        </span>
      </div>

      <h3 className="card-title">{task.title}</h3>

      {task.description && (
        <p className="card-description">{task.description}</p>
      )}

      <div className="card-meta">
        <span className="card-date">
          📅 {formatDate(task.due_date)}
        </span>
        {isOverdue && (
          <span className="card-overdue">Vencida</span>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;
