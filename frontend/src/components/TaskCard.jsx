import React from 'react';
import '../styles/TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Estudio: '#3498db',
      Trabajo: '#e74c3c',
      Personal: '#2ecc71'
    };
    return colors[category] || '#95a5a6';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES');
  };

  const isOverdue = new Date(task.due_date) < new Date() && !task.completed;

  const handleCheckboxChange = () => {
    onToggleComplete(task.id, !task.completed);
  };

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''} ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <div className="task-checkbox-container">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.completed || false}
            onChange={handleCheckboxChange}
            aria-label="Marcar tarea como completada"
          />
        </div>
        <h3 className={task.completed ? 'line-through' : ''}>{task.title}</h3>
        <span 
          className="category-badge"
          style={{ backgroundColor: getCategoryColor(task.category) }}
        >
          {task.category}
        </span>
      </div>

      {task.description && (
        <p className={`task-description ${task.completed ? 'line-through' : ''}`}>
          {task.description}
        </p>
      )}

      <div className="task-meta">
        <span className="due-date">📅 {formatDate(task.due_date)}</span>
        {isOverdue && <span className="overdue-label">Vencida</span>}
        {task.completed && <span className="completed-label">✓ Completada</span>}
      </div>

      <div className="task-actions">
        <button 
          className="btn btn-edit"
          onClick={() => onEdit(task)}
          disabled={task.completed}
        >
          ✏️ Editar
        </button>
        <button 
          className="btn btn-delete"
          onClick={() => onDelete(task.id)}
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
