const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigrations() {
  try {
    const migrationsDir = path.join(__dirname, '../../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await pool.query(sql);
        console.log(`✓ Migration ejecutada: ${file}`);
      } catch (error) {
        // Si la migración ya existe (tabla ya creada), no es un error
        if (error.code === '42P07' || error.message.includes('already exists')) {
          console.log(`→ ${file} ya estaba ejecutada`);
        } else {
          throw error;
        }
      }
    }
    console.log('✓ Todas las migraciones completadas');
  } catch (error) {
    console.error('Error ejecutando migraciones:', error.message);
    // No salir del proceso, el servidor sigue corriendo
  }
}

module.exports = { runMigrations };
