const jwt = require('jsonwebtoken')
const AppError = require('../error/AppError')
const logger = require('../config/Logger')

const verifyToken = (req, res, next) => {
    const tokenHeader = req.headers.token
    if (!tokenHeader) return next(new AppError('You are not authenticated!', 401))

    const token = tokenHeader.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
        if (err) return next(new AppError('Token is not valid!', 401))
        req.user = user
        next()
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err)
        if (req.user.role !== 'admin') return next(new AppError('You have no access!', 403))
        next()
    })
}

module.exports = { verifyToken, verifyTokenAndAdmin }