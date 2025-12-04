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
