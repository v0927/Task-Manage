const transporter = require('../config/email');
const pool = require('../config/database');

// Enviar email de tarea próxima a vencer
const sendTaskReminderEmail = async (email, taskTitle, dueDate) => {
  const formattedDate = new Date(dueDate).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #c5b3f0 0%, #a8d8ea 100%); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: #333; margin: 0;">📝 Recordatorio de Tarea</h1>
      </div>
      
      <div style="background: #fafaf8; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="color: #333; font-size: 16px;">Hola,</p>
        
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Te recordamos que tienes una tarea próxima a vencer:
        </p>
        
        <div style="background: white; border-left: 4px solid #b8a5f0; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #333; margin: 0 0 10px 0;">${taskTitle}</h3>
          <p style="color: #666; margin: 0;">
            <strong>Vence:</strong> ${formattedDate}
          </p>
        </div>
        
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Accede a tu dashboard para gestionar esta tarea:
        </p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="background: linear-gradient(135deg, #b8a5f0, #a8d8ea); 
                    color: #333; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    display: inline-block;
                    font-weight: bold;">
            Ir al Dashboard
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          TaskManager | Sistema de Gestión de Tareas
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `⏰ Recordatorio: ${taskTitle} vence próximamente`,
      html
    });
    console.log(`✓ Email de recordatorio enviado a ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de recordatorio:', error);
    return false;
  }
};

// Función para verificar y enviar notificaciones de tareas próximas a vencer
const checkAndNotifyUpcomingTasks = async () => {
  try {
    // Calcular fecha límite: ahora + 24 horas
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Buscar tareas que vencen en las próximas 24 horas y que no estén completadas
    const result = await pool.query(
      `SELECT t.*, u.email 
       FROM tasks t
       JOIN users u ON t.user_id = u.id
       WHERE t.due_date >= $1 
       AND t.due_date <= $2 
       AND t.completed = FALSE
       AND t.notification_sent = FALSE
       ORDER BY t.due_date ASC`,
      [now, tomorrow]
    );

    if (result.rows.length === 0) {
      console.log('ℹ️ No hay tareas próximas a vencer');
      return;
    }

    console.log(`📧 Encontradas ${result.rows.length} tareas próximas a vencer`);

    // Enviar email para cada tarea
    for (const task of result.rows) {
      const emailSent = await sendTaskReminderEmail(
        task.email,
        task.title,
        task.due_date
      );

      // Marcar notificación como enviada
      if (emailSent) {
        await pool.query(
          'UPDATE tasks SET notification_sent = TRUE WHERE id = $1',
          [task.id]
        );
      }
    }

    console.log(`✓ Proceso de notificación completado`);
  } catch (error) {
    console.error('❌ Error en checkAndNotifyUpcomingTasks:', error);
  }
};

module.exports = {
  sendTaskReminderEmail,
  checkAndNotifyUpcomingTasks
};
