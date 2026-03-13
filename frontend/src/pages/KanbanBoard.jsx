import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import KanbanColumn from '../components/KanbanColumn';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import '../styles/KanbanBoard.css';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({ pending: [], in_progress: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        console.log('Tareas cargadas:', response.data);
        const groupedTasks = {
          pending: response.data.filter(t => t.status === 'pending' || (t.status === null && !t.completed)),
          in_progress: response.data.filter(t => t.status === 'in_progress'),
          completed: response.data.filter(t => t.status === 'completed' || t.completed)
        };
        console.log('Tareas agrupadas:', groupedTasks);
        setTasks(groupedTasks);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar tareas:', err);
        error('Error al cargar tareas');
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [error]);

  const handleDragStart = (e, task) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceColumn', task.status || 'pending');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskIdStr = e.dataTransfer.getData('taskId');
    const taskId = parseInt(taskIdStr, 10);
    const sourceColumn = e.dataTransfer.getData('sourceColumn');

    if (sourceColumn === targetStatus) {
      console.log('Misma columna, sin cambios');
      return;
    }

    if (!taskId || isNaN(taskId)) {
      console.error('Task ID inválido:', taskIdStr);
      error('Error: ID de tarea inválido');
      return;
    }

    try {
      // Actualizar estado en backend
      const response = await api.patch(`/tasks/${taskId}/status`, { status: targetStatus });
      console.log('Respuesta del servidor:', response.data);

      // Actualizar estado local
      const allTasks = [...tasks.pending, ...tasks.in_progress, ...tasks.completed];
      const task = allTasks.find(t => t.id === taskId);

      if (task) {
        const newTasks = {
          pending: tasks.pending.filter(t => t.id !== taskId),
          in_progress: tasks.in_progress.filter(t => t.id !== taskId),
          completed: tasks.completed.filter(t => t.id !== taskId)
        };

        task.status = targetStatus;
        task.completed = targetStatus === 'completed';

        newTasks[targetStatus].push(task);
        setTasks(newTasks);
        success(`Tarea movida a ${targetStatus}`);
      }
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
      console.error('Detalles del error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      error(err.response?.data?.message || 'Error al actualizar tarea');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Cargando tablero Kanban...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="kanban-container">
        <div className="kanban-header">
          <h1>Tablero Kanban</h1>
          <p>Arrastra las tareas para cambiar su estado</p>
        </div>
        
        <div className="kanban-board">
          <KanbanColumn
            title="📋 Pendiente"
            status="pending"
            tasks={tasks.pending}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="⚙️ En Progreso"
            status="in_progress"
            tasks={tasks.in_progress}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="✅ Completada"
            status="completed"
            tasks={tasks.completed}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
