import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { success, error } = useToast();
  const { confirm } = useConfirm();

  // Cargar tareas al montar el componente
  useEffect(() => {
    fetchTasks();
  });

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
      error('Error al cargar las tareas');
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      success('Tarea creada exitosamente');
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      error(err.response?.data?.message || 'Error al crear tarea');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await api.put(`/tasks/${editingTask.id}`, taskData);
      success('Tarea actualizada exitosamente');
      setShowModal(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      error(err.response?.data?.message || 'Error al actualizar tarea');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = await confirm({
      title: 'Eliminar Tarea',
      message: '¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmType: 'danger'
    });

    if (confirmed) {
      try {
        await api.delete(`/tasks/${taskId}`);
        success('Tarea eliminada exitosamente');
        fetchTasks();
      } catch (err) {
        error(err.response?.data?.message || 'Error al eliminar tarea');
      }
    }
  };

  const handleToggleComplete = async (taskId, isCompleted) => {
    try {
      await api.patch(`/tasks/${taskId}/toggle`, { completed: isCompleted });
      const message = isCompleted ? 'Tarea marcada como completada' : 'Tarea marcada como pendiente';
      success(message);
      fetchTasks();
    } catch (err) {
      error(err.response?.data?.message || 'Error al actualizar tarea');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleSave = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Cargando tareas...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h2>Mis Tareas ({tasks.length})</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            ➕ Nueva Tarea
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tienes tareas pendientes</h3>
            <p>¡Crea tu primera tarea para empezar a organizarte!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}

        {showModal && (
          <TaskForm
            task={editingTask}
            onSave={handleSave}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;