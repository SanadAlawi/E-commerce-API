const generateToken = require('../config/token')
const { registerSchema, loginSchema, userSchema } = require('../config/validationSchema')
const { registerUser, loginUser } = require('../controllers/userController')
const AppError = require('../error/AppError')
const verifyToken = require('../middleware/authentication')
const { validateRequest, UsernameOrEmailTaken, UsernameOrEmailNotTaken } = require('../middleware/validation')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { findByUsernameOrEmail } = require('../utils')
const router = require('express').Router()

// REGISTER
router.post('/register', validateRequest(registerSchema), UsernameOrEmailTaken, registerUser)

// LOGIN
router.post('/login', validateRequest(loginSchema), UsernameOrEmailNotTaken, loginUser)

module.exports = router