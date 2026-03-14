const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { startNotificationScheduler } = require('./jobs/notificationJob');
const { runMigrations } = require('./services/migrationService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Ejecutar migraciones al iniciar
runMigrations();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Sistema de Tareas funcionando' });
});

// Iniciar scheduler de notificaciones
startNotificationScheduler();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});