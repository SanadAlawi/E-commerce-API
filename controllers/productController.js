const Product = require("../models/Product")
const logger = require('../config/Logger')
const AppError = require("../error/AppError")

const createProduct = async (req, res, next) => {
    try {

        // SAVE PRODUCT
        const product = new Product({ ...req.body })
        await product.save()

        // SEND RESPONSE
        logger.info(`Product Saved ${product.id} - ${product.name}`)
        res.status(201).json(product)
    } catch (error) {
        next(error)
    }
}

const viewOneProduct = async (req, res, next) => {
    try {

        // GET PRODUCTS
        const product = await Product.findOne({ _id: req.params.productId })
        if (!product) return next(new AppError('Product Not Found!', 404))

        // SEND RESPONSE
        logger.info(`View products`)
        res.status(201).json(product)

    } catch (error) {
        next(error)
    }
}

const viewProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, search } = req.query
        if (page < 0) page = 1
        if (limit < 0) limit = 10
        // FILTER OPTIONS
        const filter = { stock: { $gt: 0 } }
        if (category) filter.category = category
        if (search) filter.name = { $regex: search, $options: 'i' }

        // FETCH PRODUCT
        const products = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)

        // SEND RESPONSE
        logger.info('Fetch Product ')
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        // UPDATE PRODUCT
        const product = await Product.findByIdAndUpdate(req.params.productId, { $set: req.body }, { new: true })

        // SEND RESPONSE
        logger.info(`Product Updated ${product.id} - ${product.name}`)
        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        // Delete PRODUCT
        const product = await Product.findByIdAndDelete(req.params.productId)

        // SEND RESPONSE
        logger.info(`Product Removed ${product.id} - ${product.name}`)
        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

module.exports = { createProduct, viewOneProduct, viewProducts, updateProduct, deleteProduct }