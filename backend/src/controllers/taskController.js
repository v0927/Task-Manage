const pool = require('../config/database');

// Obtener todas las tareas del usuario con filtros y búsqueda
const getTasks = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    
    // Construir query dinámicamente
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [req.userId];
    let paramIndex = 2;

    // Filtro de búsqueda por texto (título o descripción)
    if (search && search.trim() !== '') {
      const searchTerm = `%${search}%`;
      query += ` AND (LOWER(title) LIKE LOWER($${paramIndex}) OR LOWER(description) LIKE LOWER($${paramIndex + 1}))`;
      params.push(searchTerm);
      params.push(searchTerm);
      paramIndex += 2;
    }

    // Filtro por categoría
    if (category && category.trim() !== '') {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Filtro por estado (completed/pending)
    if (status && status !== '') {
      if (status === 'completed') {
        query += ` AND completed = true`;
      } else if (status === 'pending') {
        query += ` AND completed = false`;
      }
    }

    // Ordenar por fecha de vencimiento
    query += ' ORDER BY due_date ASC';

    const tasks = await pool.query(query, params);

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

    // Marcar first_login como false si era la primera tarea
    await pool.query(
      'UPDATE users SET first_login = false WHERE id = $1 AND first_login = true',
      [req.userId]
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

// Obtener estadísticas de productividad
const getProductivityStats = async (req, res) => {
  try {
    // Obtener todas las tareas del usuario
    const allTasks = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1',
      [req.userId]
    );

    const allTasksData = allTasks.rows;
    const totalTasks = allTasksData.length;
    const completedTasks = allTasksData.filter(task => task.completed).length;

    // Calcular tareas completadas esta semana (últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const completedThisWeek = allTasksData.filter(task => {
      if (!task.completed || !task.completed_at) return false;
      const completedDate = new Date(task.completed_at);
      return completedDate >= sevenDaysAgo;
    }).length;

    // Calcular porcentaje de completitud
    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.json({
      completedThisWeek,
      totalTasks,
      completedTasks,
      completionPercentage
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

// Obtener streak de días productivos
const getProductivityStreak = async (req, res) => {
  try {
    // Obtener todas las tareas completadas del usuario
    const completedTasks = await pool.query(
      'SELECT completed_at FROM tasks WHERE user_id = $1 AND completed = true ORDER BY completed_at DESC',
      [req.userId]
    );

    const tasksData = completedTasks.rows;

    if (tasksData.length === 0) {
      return res.json({
        currentStreak: 0,
        longestStreak: 0,
        lastProductiveDay: null
      });
    }

    // Agrupar tareas por fecha
    const datesSet = new Set();
    tasksData.forEach(task => {
      if (task.completed_at) {
        const dateString = new Date(task.completed_at).toISOString().split('T')[0];
        datesSet.add(dateString);
      }
    });

    const sortedDates = Array.from(datesSet).sort().reverse(); // Más reciente primero

    if (sortedDates.length === 0) {
      return res.json({
        currentStreak: 0,
        longestStreak: 0,
        lastProductiveDay: null
      });
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Calcular streak actual (desde hoy hacia atrás)
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
    
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      // Hay actividad hoy o ayer, comenzar a contar
      let currentDate = new Date(sortedDates[0]);
      let currentDateString = sortedDates[0];
      currentStreak = 1;

      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateString = prevDate.toISOString().split('T')[0];

        if (sortedDates[i] === prevDateString) {
          currentStreak++;
          currentDate = new Date(sortedDates[i]);
        } else {
          break;
        }
      }
    }

    // Calcular el streak más largo
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedDates[i - 1]);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateString = prevDate.toISOString().split('T')[0];

        if (sortedDates[i] === prevDateString) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    res.json({
      currentStreak,
      longestStreak,
      lastProductiveDay: sortedDates[0]
    });
  } catch (error) {
    console.error('Error al obtener streak:', error);
    res.status(500).json({ message: 'Error al obtener información de streak' });
  }
};

// Exportar tareas como archivo iCalendar (.ics)
const exportTasksToIcs = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Obtener solo las tareas pendientes
    const tasks = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 AND completed = false ORDER BY due_date ASC',
      [userId]
    );

    // Generar contenido iCalendar
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Task Manager App//NONSGML v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Mis Tareas Pendientes
X-WR-TIMEZONE:America/La_Paz
BEGIN:VTIMEZONE
TZID:America/La_Paz
BEGIN:STANDARD
DTSTART:20260101T000000
TZOFFSETFROM:-0400
TZOFFSETTO:-0400
TZNAME:BOT
END:STANDARD
END:VTIMEZONE
`;

    // Agregar cada tarea como evento
    tasks.rows.forEach((task, index) => {
      const taskId = task.id || index;
      const dueDate = task.due_date ? new Date(task.due_date) : new Date();
      
      // Formatear fecha para iCalendar (YYYYMMDDTHHMMSSZ)
      const startDate = dueDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      // Evento de 1 hora
      const endDate = new Date(dueDate.getTime() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      // Escapar caracteres especiales en descripción
      const description = (task.description || '').replace(/\n/g, '\\n').replace(/,/g, '\\,');
      const summary = (task.title || '').replace(/,/g, '\\,');
      
      icsContent += `BEGIN:VEVENT
UID:task-${taskId}@taskmanager-app
DTSTAMP:${timestamp}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${summary}
DESCRIPTION:${description}
CATEGORIES:${task.category || 'General'}
STATUS:CONFIRMED
PRIORITY:5
SEQUENCE:0
END:VEVENT
`;
    });

    icsContent += `END:VCALENDAR`;

    // Configurar headers para descarga de archivo
    const filename = `tareas-pendientes-${now.toISOString().split('T')[0]}.ics`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Length', Buffer.byteLength(icsContent, 'utf8'));
    
    res.send(icsContent);
  } catch (error) {
    console.error('Error al exportar tareas a ICS:', error);
    res.status(500).json({ message: 'Error al exportar tareas' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleCompleteTask,
  getProductivityStats,
  getProductivityStreak,
  exportTasksToIcs
};