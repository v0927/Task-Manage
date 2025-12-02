require('dotenv').config();
const { sendTaskReminderEmail, checkAndNotifyUpcomingTasks } = require('./src/services/notificationService');

// ============================================
// TEST 1: Enviar email de prueba
// ============================================
const testEmail = async () => {
  console.log('📧 Enviando email de prueba...\n');

  const emailSent = await sendTaskReminderEmail(
    'vahegiraldo@gmail.com', // ⬅️ Cambia a tu email
    'Estudiar React',
    new Date(Date.now() + 12 * 60 * 60 * 1000) // Tarea en 12 horas
  );

  if (emailSent) {
    console.log('✅ Email enviado exitosamente!');
    console.log('Revisa tu bandeja de entrada\n');
  } else {
    console.log('❌ Error al enviar email\n');
  }
};

// ============================================
// TEST 2: Verificar tareas próximas (completo)
// ============================================
const testNotificationCheck = async () => {
  console.log('🔍 Verificando tareas próximas a vencer...\n');
  await checkAndNotifyUpcomingTasks();
  console.log('\n✅ Verificación completada\n');
};

// Ejecutar
(async () => {
  try {
    // Descomenta el test que quieras ejecutar:

    // Test 1: Email simple
    await testEmail();

    // Test 2: Verificar todas las tareas (descomentar si necesitas)
    // await testNotificationCheck();

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en test:', error);
    process.exit(1);
  }
})();