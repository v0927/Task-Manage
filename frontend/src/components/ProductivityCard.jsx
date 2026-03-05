import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/ProductivityCard.css';

const ProductivityCard = ({ refreshTrigger }) => {
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductivityData();
  }, [refreshTrigger]);

  const fetchProductivityData = async () => {
    try {
      const [statsResponse, streakResponse] = await Promise.all([
        api.get('/tasks/stats'),
        api.get('/tasks/streak')
      ]);

      setStats(statsResponse.data);
      setStreak(streakResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener datos de productividad:', error);
      setLoading(false);
    }
  };

  if (loading || !stats || !streak) {
    return <div className="productivity-card">Cargando estadísticas...</div>;
  }

  return (
    <div className="productivity-card">
      <h3 className="productivity-title">📊 Tu Productividad</h3>
      
      <div className="productivity-grid">
        {/* Tareas completadas esta semana */}
        <div className="productivity-stat">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <p className="stat-label">Esta Semana</p>
            <p className="stat-value">{stats.completedThisWeek}</p>
            <p className="stat-name">Completadas</p>
          </div>
        </div>

        {/* Porcentaje de completitud */}
        <div className="productivity-stat">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <p className="stat-label">Completitud</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
            <p className="stat-value">{stats.completionPercentage}%</p>
            <p className="stat-subtext">
              {stats.completedTasks} de {stats.totalTasks} tareas
            </p>
          </div>
        </div>

        {/* Streak de días productivos */}
        <div className="productivity-stat">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <p className="stat-label">Streak Actual</p>
            <p className="stat-value">{streak.currentStreak}</p>
            <p className="stat-name">Días consecutivos</p>
            {streak.longestStreak > 0 && (
              <p className="stat-subtext">
                Mejor: {streak.longestStreak} días
              </p>
            )}
          </div>
        </div>
      </div>

      {streak.lastProductiveDay && (
        <div className="productivity-footer">
          <p className="last-activity">
            Último día productivo: {new Date(streak.lastProductiveDay).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductivityCard;
