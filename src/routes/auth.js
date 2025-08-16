const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, nombre, apellido, rol = 'vendedor' } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        $or: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario o email ya existe'
      });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    // Crear el usuario
    const user = await User.create({
      username,
      email,
      password_hash,
      nombre,
      apellido,
      rol
    });

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({
      where: { username, activo: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último acceso
    await user.update({ ultimo_acceso: new Date() });

    // Generar token
    const token = jwt.sign(
      { userId: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el login',
      error: error.message
    });
  }
});

// Verificar token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token válido',
    data: {
      user: req.user
    }
  });
});

// Logout (invalidar token del lado del cliente)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

module.exports = router;
