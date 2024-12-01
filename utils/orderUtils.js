const AppError = require("../error/AppError")
const Order = require("../models/Order")
const Product = require("../models/Product")

const validateProductStock = async (productId, quantity, session) => {
    const product = await Product.findById(productId).session(session)
    if (!product) return next(new AppError(`${product.name} Product not found!`, 400))
    if (product.stock < quantity) return next(new AppError(`Insufficient stock for product ${product.name}.`, 400))

    return product
}

const updateProductStock = async (product, quantity, session) => {
    product.stock -= quantity
    return product.save({ session })
}


const restoreProductStock = async (products, session) => {
    const updateStockPromises = products.map(async (product) => {
        const orderProduct = await Product.findById(product.productId).session(session)
        if (!orderProduct || orderProduct.stock <= 0) {
            logger.warn(`Product with ID ${product.productId} not found`)
            return 
        }
        orderProduct.stock += product.quantity
        await orderProduct.save({session})
    })

    await Promise.all(updateStockPromises)
}

const canOrderCancelled = (status) => {
    return status === 'pending' || status === 'paid'
}

module.exports = { validateProductStock, updateProductStock, restoreProductStock, canOrderCancelled }