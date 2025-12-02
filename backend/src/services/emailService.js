const transporter = require('../config/email');

// Enviar email de recordatorio
const sendTaskReminder = async (userEmail, task) => {
  try {
    const mailOptions = {
      from: `"Sistema de Tareas" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Recordatorio: ${task.title} vence mañana`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🔔 Recordatorio de Tarea</h2>
          <p>Hola,</p>
          <p>Te recordamos que tienes una tarea próxima a vencer:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4a90e2; margin-top: 0;">${task.title}</h3>
            ${task.description ? `<p><strong>Descripción:</strong> ${task.description}</p>` : ''}
            <p><strong>Categoría:</strong> ${task.category}</p>
            <p><strong>Fecha de vencimiento:</strong> ${new Date(task.due_date).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          <p>¡No lo olvides!</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Este es un mensaje automático del Sistema de Gestión de Tareas.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendTaskReminder };