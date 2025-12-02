const pool = require('../config/database');

// Obtener todas las tareas del usuario
const getTasks = async (req, res) => {
  try {
    const tasks = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC',
      [req.userId]
    );

    res.json(tasks.rows);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

// Crear nueva tarea
const createTask = async (req, res) => {
  try {
    const { title, description, category, due_date } = req.body;

    // Validaciones
    if (!title || !category || !due_date) {
      return res.status(400).json({ 
        message: 'Título, categoría y fecha de vencimiento son requeridos' 
      });
    }

    const validCategories = ['Estudio', 'Trabajo', 'Personal'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Categoría inválida' });
    }

    // Crear tarea
    const newTask = await pool.query(
      'INSERT INTO tasks (user_id, title, description, category, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.userId, title, description || null, category, due_date]
    );

    res.status(201).json({
      message: 'Tarea creada exitosamente',
      task: newTask.rows[0]
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ message: 'Error al crear tarea' });
  }
};

// Actualizar tarea
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, due_date } = req.body;

    // Verificar que la tarea pertenece al usuario
    const task = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Actualizar tarea
    const updatedTask = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, category = $3, due_date = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [title, description, category, due_date, id, req.userId]
    );

    res.json({
      message: 'Tarea actualizada exitosamente',
      task: updatedTask.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
};

// Eliminar tarea
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la tarea pertenece al usuario
    const task = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Eliminar tarea
    const deleteTask = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
};

// Marcar tarea como completada/no completada
const toggleCompleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    // Verificar que la tarea pertenece al usuario
    const task = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Actualizar estado de completada
    const updatedTask = await pool.query(
      'UPDATE tasks SET completed = $1, completed_at = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [completed, completed ? new Date() : null, id, req.userId]
    );

    res.json({
      message: completed ? 'Tarea marcada como completada' : 'Tarea marcada como pendiente',
      task: updatedTask.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar estado de tarea:', error);
    res.status(500).json({ message: 'Error al actualizar estado de tarea' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleCompleteTask
};