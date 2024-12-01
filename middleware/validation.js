const { objectIdSchema } = require('../config/validationSchema')
const AppError = require('../error/AppError')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const User = require('../models/User')
const { findByUsernameOrEmail } = require('../utils')

const validateRequest = (schema) => async (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
        const errorMessages = error.details.map(err => err.message)
        return next(new AppError(errorMessages, 400))
    }

    next()
}

const validateSingleProperty = (schema, property) => async (req, res, next) => {
    const { error } = schema.validate(req.body[property], { abortEarly: false })
    if (error) return next(new AppError(error, 400))

    next()
}
const validateQueryRequest = (schema) => async (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false })
    console.log(error)
    if (error) {
        const errorMessages = error.details.map(err => err.message)
        return next(new AppError(errorMessages, 400))
    }

    next()
}

const UsernameOrEmailTaken = async (req, res, next) => {
    const user = await findByUsernameOrEmail(req.body.username, req.body.email)
    if (user) return next(new AppError('Username or Email Already Taken!', 409))
    next()
}

const UsernameOrEmailNotTaken = async (req, res, next) => {
    const user = await findByUsernameOrEmail(req.body.username, req.body.email)
    if (!user) return next(new AppError('Username or Email Not Found!', 409))
    req.user = user
    next()
}

const checkProductName = async (req, res, next) => {
    const product = await Product.findOne({ name: req.body.name })
    if (product) return next(new AppError('Product Already Exist!', 409))
    next()
}

const checkProductIdAndName = async (req, res, next) => {
    const product = await Product.findById(req.params.productId)
    if (!product) return next(new AppError('Product Not Found!', 404))

    if (req.body.name) {
        const productName = await Product.findOne({ name: req.body.name })
        if (productName) return next(new AppError('Product Already Exist!', 409))
    }
    next()
}


const validateProductId = async (req, res, next) => {
    const {error} = objectIdSchema.validate(req.params.productId || req.body.productId)
    if(error) return next(new AppError(error))

    const product = await Product.findById(req.params.productId || req.body.productId)
    if (!product) return next(new AppError('Product Not Found!', 404))
    req.product = product
    next()
}


const checkStock = (req, res, next) => {
    if (req.product.stock <= 0) return next('Sorry, Product is out of stock', 400)
    if (req.body.quantity > req.product.stock) return next('Product Quantity Exceeds The Stock!', 400)
    next()
}

const checkCart = async (req, res, next) => {
    const cart = await Cart.findOne({ userId: req.user.id })
    if (!cart) next(new AppError('Cart Not Exist', 404))
    req.cart = cart
    next()
}


module.exports = { validateRequest, validateQueryRequest, UsernameOrEmailTaken, UsernameOrEmailNotTaken, checkProductName, checkProductIdAndName, checkStock, validateProductId, checkCart, validateSingleProperty }