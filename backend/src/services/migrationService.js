const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigrations() {
  try {
    // Calcular ruta de migraciones desde el archivo actual
    // Este archivo está en: /backend/src/services/migrationService.js
    // Las migraciones están en: /backend/migrations
    const migrationsDir = path.resolve(__dirname, '../../migrations');
    
    console.log(`🔍 Buscando migraciones en: ${migrationsDir}`);
    
    if (!fs.existsSync(migrationsDir)) {
      console.log(`⚠️  Carpeta de migraciones no encontrada en: ${migrationsDir}`);
      return;
    }

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
