const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, toggleCompleteTask, getProductivityStats, getProductivityStreak, exportTasksToIcs, updateTaskStatus } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas las rutas de tareas requieren autenticación
router.use(authMiddleware);

// Rutas específicas PRIMERO (más específicas que genéricas)
// Obtener estadísticas de productividad
router.get('/stats', getProductivityStats);

// Obtener información de streak
router.get('/streak', getProductivityStreak);

// Exportar tareas como archivo iCalendar
router.get('/export/ics', exportTasksToIcs);

// Rutas genéricas DESPUÉS
// Obtener todas las tareas del usuario (con filtros opcionales)
router.get('/', getTasks);

// Crear nueva tarea
router.post('/', createTask);

// Actualizar una tarea
router.put('/:id', updateTask);

// Actualizar estado de tarea (Kanban)
router.patch('/:id/status', updateTaskStatus);

// Marcar tarea como completada/no completada
router.patch('/:id/toggle', toggleCompleteTask);

// Eliminar una tarea
router.delete('/:id', deleteTask);

module.exports = router;
