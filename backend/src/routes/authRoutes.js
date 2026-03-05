const express = require('express');
const { register, login, updateProfile, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para registro
router.post('/register', register);

// Ruta para login
router.post('/login', login);

// Ruta para actualizar perfil (protegida)
router.put('/profile', authMiddleware, updateProfile);

// Ruta para cambiar contraseña (protegida)
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
