const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, toggleCompleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas las rutas de tareas requieren autenticación
router.use(authMiddleware);

// Obtener todas las tareas del usuario
router.get('/', getTasks);

// Crear nueva tarea
router.post('/', createTask);

// Actualizar una tarea
router.put('/:id', updateTask);

// Marcar tarea como completada/no completada
router.patch('/:id/toggle', toggleCompleteTask);

// Eliminar una tarea
router.delete('/:id', deleteTask);

module.exports = router;
