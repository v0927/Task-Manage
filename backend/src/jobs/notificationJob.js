const { checkAndNotifyUpcomingTasks } = require('../services/notificationService');

/**
 * Inicia el job scheduler para verificar tareas próximas a vencer
 * Se ejecuta cada 30 minutos
 */
const startNotificationScheduler = () => {
  console.log('🕐 Iniciando scheduler de notificaciones...');

  // Ejecutar inmediatamente al iniciar
  checkAndNotifyUpcomingTasks();

  // Ejecutar cada 30 minutos (1800000 ms)
  setInterval(() => {
    console.log('🔍 Verificando tareas próximas a vencer...');
    checkAndNotifyUpcomingTasks();
  }, 30 * 60 * 1000);
};

module.exports = { startNotificationScheduler };
