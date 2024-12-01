const generateToken = require("../config/token")
const User = require("../models/User")
const bcrypt = require('bcrypt')
const logger = require('../config/Logger')
const AppError = require("../error/AppError")
const sendEmail = require("../utils/emailService")

const registerUser = async (req, res, next) => {
    try {
        // HASH THE PASSWORD
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // SAVE USER
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        await user.save()

        // GENERATE TOKEN
        const token = generateToken(user)

        // SEND VERIFICATION EMAIL
        await sendEmail(user.email, `Welcome to ${user.username}! Registration Successful`, {username: user.username, email: user.email}, 'ConfirmationEmail', next)

        // SEND RESPONSE
        const { password, ...others } = user._doc
        logger.info(`User registered: ${user._id} - ${user.username}`)
        res.status(201).json({ token, ...others })
    } catch (error) {
        next(error)
    }
}


const loginUser = async (req, res, next) => {
    try {
        // CHECK PASSWORD
        const samePassword = await bcrypt.compare(req.body.password, req.user.password)
        if (!samePassword) return next(new AppError('Username or password are wrong!', 401))

        // GENERATE TOKEN
        const token = generateToken(req.user)

        // SEND RESPONSE
        const { password, ...others } = req.user._doc
        res.status(200).json({ token, ...others })
    } catch (error) {
        next(error)
    }
}

module.exports = { registerUser, loginUser }