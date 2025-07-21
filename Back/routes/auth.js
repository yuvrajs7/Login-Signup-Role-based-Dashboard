const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('firstName').notEmpty().trim().isLength({ min: 2, max: 50 }),
  body('lastName').notEmpty().trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['employee', 'admin'])
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', auth, getProfile);

module.exports = router;
