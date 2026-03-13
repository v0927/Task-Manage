import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import OnboardingModal from '../components/OnboardingModal.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ProductivityCard from '../components/ProductivityCard.jsx';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({ category: '', status: '' });
  const [refreshProductivityTrigger, setRefreshProductivityTrigger] = useState(0);
  const [stats, setStats] = useState({
    completedThisWeek: 0,
    progressPercentage: 0,
    productiveStreak: 0,
    totalCompleted: 0,
    totalTasks: 0
  });
  const { success, error } = useToast();
  const { confirm } = useConfirm();
  const { user } = useContext(AuthContext);

  // Cargar tareas al montar el componente
  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, []);

  // Debounce para búsqueda y filtros - espera 500ms antes de buscar
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setLoading(true);
      fetchTasks();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchValue, filters]);

  const fetchTasks = async () => {
    try {
      setErrorLoading(null);
      // Construir query parameters
      const params = new URLSearchParams();
      if (searchValue) params.append('search', searchValue);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data);
      
      // Calcular estadísticas
      const totalTasks = response.data.length;
      const completedTasks = response.data.filter(t => t.completed).length;
      const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      setStats({
        completedThisWeek: completedTasks,
        progressPercentage: Math.round(progressPercentage),
        productiveStreak: 0,
        totalCompleted: completedTasks,
        totalTasks: totalTasks
      });

      // Mostrar onboarding si es primer acceso y no hay tareas
      if (user?.first_login && response.data.length === 0 && !searchValue && !filters.category && !filters.status) {
        setShowOnboarding(true);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
      console.error('Error detalles:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      const errorMsg = err.response?.data?.message || 'Error al cargar las tareas';
      setErrorLoading(errorMsg);
      error(errorMsg);
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      console.log('🚀 Creando tarea con datos:', taskData);
      const response = await api.post('/tasks', taskData);
      console.log('✅ Respuesta del servidor:', response.data);
      success('Tarea creada exitosamente');
      setShowModal(false);
      setShowOnboarding(false);
      fetchTasks();
    } catch (err) {
      console.error('❌ Error al crear tarea:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      });
      const errorMsg = err.response?.data?.message || err.message || 'Error al crear tarea';
      error(errorMsg);
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
      // Trigger refresh de ProductivityCard cuando se completa una tarea
      setRefreshProductivityTrigger(prev => prev + 1);
    } catch (err) {
      error(err.response?.data?.message || 'Error al actualizar tarea');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleExportIcs = async () => {
    try {
      const response = await api.get('/tasks/export/ics', {
        responseType: 'blob'
      });
      
      // Crear un blob y descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tareas-pendientes-${new Date().toISOString().split('T')[0]}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      success('Archivo exportado exitosamente');
    } catch (err) {
      error(err.response?.data?.message || 'Error al exportar tareas');
    }
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

  if (errorLoading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-state">
            <h2>⚠️ Error al cargar las tareas</h2>
            <p>{errorLoading}</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setLoading(true);
                setErrorLoading(null);
                fetchTasks();
              }}
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        {/* Banner de Bienvenida */}
        {tasks.length === 0 && !searchValue && !filters.category && !filters.status && (
          <div className="welcome-banner">
            <div className="banner-content">
              <h2>¡Buenas tardes, {user?.name?.split(' ')[0]}!</h2>
              <p>¡No tienes pendientes hoy!</p>
            </div>
            <div className="banner-actions">
              <button 
                className="btn btn-secondary"
                onClick={handleExportIcs}
              >
                📥 Exportar .ics
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                ➕ Nueva tarea
              </button>
            </div>
          </div>
        )}

        {/* Mensaje de Bienvenida al Usuario Nuevo */}
        {tasks.length === 0 && !searchValue && !filters.category && !filters.status && (
          <div className="onboarding-message">
            <p>Estás a punto de crear tu primera tarea. ¡Haz clic en <strong>Nueva tarea</strong> para comenzar!</p>
          </div>
        )}

        {/* Tarjetas de Estadísticas */}
        {tasks.length > 0 && (
          <ProductivityCard refreshTrigger={refreshProductivityTrigger} />
        )}

        <div className="dashboard-header">
          <h2>Mis tareas ({tasks.length})</h2>
          <div className="header-actions">
            {tasks.length > 0 && (
              <button 
                className="btn btn-secondary"
                onClick={handleExportIcs}
                title="Exportar tareas pendientes como archivo .ics"
              >
                📥 Exportar .ics
              </button>
            )}
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              ➕ Nueva tarea
            </button>
          </div>
        </div>

        <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />
        <FilterBar onFiltersChange={setFilters} initialFilters={filters} />

        {tasks.length === 0 && (searchValue || filters.category || filters.status) ? (
          <div className="empty-state">
            <h3>No hay tareas con eso</h3>
            <p>Intenta ajustar los filtros o tu búsqueda</p>
          </div>
        ) : tasks.length === 0 ? (
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

        {showOnboarding && (
          <OnboardingModal
            user={user}
            onComplete={handleCreateTask}
            onClose={() => setShowOnboarding(false)}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;