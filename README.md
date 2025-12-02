# 📝 TaskManager - Sistema de Gestión de Tareas

Un sistema completo de gestión de tareas con autenticación, notificaciones por email y diseño moderno.

## ✨ Características

### 🔐 Autenticación
- ✅ Registro seguro con validación de email
- ✅ Login con JWT (7 días de expiración)
- ✅ Contraseñas encriptadas con bcrypt

### 📋 Gestión de Tareas (CRUD)
- ✅ Crear nuevas tareas
- ✅ Editar tareas existentes
- ✅ Eliminar tareas con confirmación
- ✅ Marcar como completadas
- ✅ Ordenado por fecha de vencimiento

### 📊 Características Avanzadas
- ✅ Notificaciones por email (24 horas antes)
- ✅ Toast notifications para feedback
- ✅ Modal de confirmación elegante
- ✅ Diseño responsive (mobile-first)
- ✅ Paleta de colores pastel moderna

### 📧 Categorías de Tareas
- 📚 Estudio
- 💼 Trabajo
- 🏠 Personal

## 🛠️ Tech Stack

### Backend
```
Node.js + Express.js
PostgreSQL (Supabase)
JWT + bcryptjs
Nodemailer (para emails)
CORS habilitado
```

### Frontend
```
React 19
React Router v7
Context API (Autenticación)
CSS3 (diseño pastel)
Axios (HTTP client)
```

## 📦 Requisitos Previos

- Node.js 16+
- npm o yarn
- Base de datos PostgreSQL (Supabase)
- Cuenta de Gmail (para emails)

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/task-manage.git
cd task-manage
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env (copiar de .env.example)
cp .env.example .env

# Editar .env con tus valores
# - DATABASE_URL de Supabase
# - JWT_SECRET (mínimo 32 caracteres)
# - EMAIL_USER y EMAIL_PASS de Gmail

npm start
# Servidor en http://localhost:5000
```

### 3. Configurar Frontend

```bash
cd frontend
npm install

# Crear archivo .env (copiar de .env.example)
cp .env.example .env

# Editar .env con la URL del backend
npm start
# Aplicación en http://localhost:3000
```

## 🗄️ Configuración de Base de Datos

### Crear tablas en Supabase

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de tareas
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Estudio', 'Trabajo', 'Personal')),
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(user_id, completed);
CREATE INDEX idx_tasks_notification ON tasks(notification_sent, due_date);
```

## 📧 Configuración de Emails (Gmail)

1. Ve a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Selecciona "Mail" y "Windows Computer"
3. Copia la contraseña generada
4. Pégala en `EMAIL_PASS` en tu `.env`

## 🚀 Deployment

### Backend - Render

1. Ve a [render.com](https://render.com)
2. Conecta tu repositorio GitHub
3. Nuevo "Web Service"
4. Build: `cd backend && npm install`
5. Start: `cd backend && npm start`
6. Agregar variables de entorno
7. Deploy ✅

### Frontend - Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio
3. Root Directory: `frontend`
4. Agregar variable: `REACT_APP_API_URL=https://tu-api-backend.onrender.com/api`
5. Deploy ✅

## 📝 Variables de Entorno

### Backend `.env`
```env
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=tu_secreto_largo_aqui
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app
EMAIL_FROM=tu_email@gmail.com
FRONTEND_URL=https://tu-frontend.vercel.app
```

### Frontend `.env`
```env
REACT_APP_API_URL=https://tu-backend.onrender.com/api
```

## 🧪 Testing

### Probar emails manualmente

```bash
cd backend
node test-email.js
```

### Crear tarea de prueba

1. Regístrate en la aplicación
2. Crea una tarea que venza en 12 horas
3. Espera 30 minutos o ejecuta el test
4. Revisa tu email

## 📊 Estructura del Proyecto

```
task-manage/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── email.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── services/
│   │   │   └── notificationService.js
│   │   ├── jobs/
│   │   │   └── notificationJob.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ToastContext.jsx
│   │   │   └── ConfirmContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── styles/
│   │   │   ├── Navbar.css
│   │   │   ├── TaskCard.css
│   │   │   ├── TaskForm.css
│   │   │   ├── Toast.css
│   │   │   └── ConfirmDialog.css
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## 🎨 Paleta de Colores

```
Primary:    #b8a5f0 (Púrpura pastel)
Secondary:  #a8d8ea (Azul pastel)
Success:    #a8d5ba (Verde pastel)
Error:      #f5a9a9 (Rosa pastel)
Background: #fafaf8 (Blanco cálido)
```

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT con expiración
- ✅ CORS configurado
- ✅ Validaciones en frontend y backend
- ✅ Autenticación requerida para tareas
- ✅ Usuario solo accede a sus propias tareas

## 🚀 Mejoras Futuras

- [ ] Filtros avanzados (búsqueda, por categoría)
- [ ] Prioridades en tareas
- [ ] Etiquetas/tags
- [ ] Historial de tareas completadas
- [ ] Dark mode
- [ ] Exportar tareas a PDF
- [ ] Sincronización en tiempo real (WebSockets)
