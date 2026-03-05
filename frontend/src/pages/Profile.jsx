import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);
  const { success, error } = useToast();

  const [personalData, setPersonalData] = useState({
    fullName: user?.name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/tasks');
      const tasks = response.data;
      const completedTasks = tasks.filter(t => t.completed).length;
      const pendingTasks = tasks.filter(t => !t.completed).length;
      
      setStats({
        totalTasks: tasks.length,
        completedTasks: completedTasks,
        pendingTasks: pendingTasks
      });
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'No disponible';

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/profile', {
        name: personalData.fullName,
        email: personalData.email
      });
      setUser(response.data.user);
      success('Información personal actualizada exitosamente');
    } catch (err) {
      error(err.response?.data?.message || 'Error al actualizar información');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      error('Todos los campos de contraseña son requeridos');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('Las contraseñas nuevas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      success('Contraseña actualizada exitosamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      error(err.response?.data?.message || 'Error al cambiar contraseña');
    }
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'V';

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">{userInitial}</div>
          <div className="header-info">
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
            <small>Miembro desde {memberSince}</small>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-value">📋 {stats.totalTasks}</div>
            <div className="stat-label">Tareas totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">✅ {stats.completedTasks}</div>
            <div className="stat-label">Completadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">⏳ {stats.pendingTasks}</div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>

        <div className="profile-content">
          <section className="profile-section">
            <h2>Información Personal</h2>
            <form onSubmit={handleSavePersonalInfo}>
              <div className="form-group">
                <label htmlFor="fullName">Nombre completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={personalData.fullName}
                  onChange={handlePersonalChange}
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={personalData.email}
                  onChange={handlePersonalChange}
                  placeholder="tu@email.com"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </form>
          </section>

          <section className="profile-section">
            <h2>Seguridad</h2>
            <div className="security-subsection">
              <h3>Cambiar contraseña</h3>
              <form onSubmit={handleUpdatePassword}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Contraseña actual</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Tu contraseña actual"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Nueva contraseña</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nueva contraseña"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>

                <button type="submit" className="btn btn-dark">
                  Actualizar contraseña
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Profile;
