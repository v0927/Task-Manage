# 📝 TaskManager - Sistema de Gestión de Tareas

Un sistema completo de gestión de tareas con autenticación, tablero Kanban y modo oscuro.

## ✨ Características

### 🔐 Autenticación & Perfil de Usuario
- ✅ Registro seguro con validación de email
- ✅ Login con JWT (7 días de expiración)
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Perfil de usuario con estadísticas dinámicas
- ✅ Cambio seguro de contraseña
- ✅ Cierre de sesión (logout)

### 📋 Gestión de Tareas (CRUD)
- ✅ Crear nuevas tareas con descripción y categoría
- ✅ Editar tareas existentes
- ✅ Eliminar tareas con confirmación
- ✅ Marcar como completadas
- ✅ Ordenado por fecha de vencimiento

### 🔍 Búsqueda y Filtros Inteligentes
- ✅ Búsqueda en tiempo real (debounce 500ms)
- ✅ Filtrar por categoría de tareas
- ✅ Filtrar por estado (completadas/pendientes)
- ✅ Combinar múltiples filtros

### 📊 Estadísticas de Productividad
- ✅ Total de tareas y tareas completadas
- ✅ Porcentaje de completitud visual
- ✅ Tareas completadas esta semana
- ✅ Estadísticas dinámicas en perfil de usuario

### 📤 Exportar Tareas
- ✅ Exportar tareas a formato iCalendar (.ics)
- ✅ Compatible con Google Calendar, Apple Calendar, Outlook
- ✅ Incluye título, descripción, categoría y fecha de vencimiento
- ✅ Descarga con nombre: `tareas-pendientes-YYYY-MM-DD.ics`

### 🛫 Onboarding
- ✅ Modal de bienvenida en primer acceso
- ✅ Flag persistent (`first_login`) 
- ✅ Fácil creación de primera tarea

### 🎨 UI/UX Moderno
- ✅ Notificaciones tipo Toast (éxito, error, info)
- ✅ Modal de confirmación elegante
- ✅ Paleta de colores profesional (Indigo/Purple/Gray)
- ✅ Diseño responsive (mobile-first)
- ✅ 80+ variables CSS para temas consistentes

### � Tablero Kanban
- ✅ Visualización de tareas en tablero tipo Kanban
- ✅ Tres columnas: Pendiente, En Progreso, Completada
- ✅ Drag & Drop para mover tareas entre columnas
- ✅ Actualización automática sin recargar página
- ✅ Información completa en cada tarjeta (título, descripción, categoría, fecha)

### 🌙 Modo Oscuro (Dark Mode)
- ✅ Toggle para activar/desactivar modo oscuro
- ✅ Preferencia guardada en navegador (localStorage)
- ✅ Aplicado a todas las páginas principales
- ✅ Transiciones suave entre temas
- ✅ Paleta de colores optimizada para modo oscuro

### �📧 Categorías de Tareas
- 📚 Estudio (azul)
- 💼 Trabajo (ámbar)
- 🏠 Personal (verde)

## 🛠️ Tech Stack

**Backend:** Node.js + Express + PostgreSQL  
**Frontend:** React 19 + Context API + CSS3  
**Auth:** JWT + bcryptjs  

## ⚙️ Instalación Rápida

### 1. Backend
```bash
cd backend && npm install
```

Crear `.env`:
```
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=tu_clave_secreta
PORT=5000
```

```bash
npm run dev
```

### 2. Frontend
```bash
cd frontend && npm install && npm start
```

Abre http://localhost:3000

### 3. Base de Datos (Supabase)

En Supabase SQL Editor:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Estudio', 'Trabajo', 'Personal')),
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

## 🎯 Cómo Usar

**Dashboard:** Crea tareas, busca y filtra  
**Kanban:** Click en "Kanban" → Arrastra tareas entre columnas  
**Dark Mode:** Click en 🌙 en la navbar  
**Exportar:** Click en "Exportar .ics" para descargar tareas  

## 📱 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Crear cuenta |
| POST | `/auth/login` | Login |
| GET | `/tasks` | Obtener tareas |
| POST | `/tasks` | Crear tarea |
| PUT | `/tasks/:id` | Editar tarea |
| PATCH | `/tasks/:id/status` | Cambiar estado |
| DELETE | `/tasks/:id` | Eliminar tarea |
| GET | `/tasks/export/ics` | Exportar .ics |


## 📝 Notas

- JWT expira en 7 días
- Búsquedas con debounce 500ms
- Drag & Drop nativo HTML5
- CSS variables para Dark Mode
- Sin librerías UI externas

