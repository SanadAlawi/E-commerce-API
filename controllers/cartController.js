const Cart = require("../models/Cart")
const AppError = require('../error/AppError')
const logger = require('../config/Logger')
const { getCart, findProductInCart, updateExistingProduct, addNewProductToCart, calculateTotalCost } = require("../utils/cartUtils")

const addToCart = async (req, res, next) => {

    try {

        let cart = await getCart(req.user.id)
        if (!cart) cart = new Cart({ userId: req.user.id, products: [] })

        const productIndex = findProductInCart(cart, req.product.id)
        if (productIndex !== -1) {
            updateExistingProduct(cart.products[productIndex], req.body.quantity, req.product.price, req.product.stock, next)
        } else
            addNewProductToCart(cart, req.product.id, req.body.quantity, req.product.price)

        await cart.save()

        logger.info(`Cart updated: Product added/updated successfully for userId: ${req.user.username}`)
        res.status(200).json(cart)
    } catch (error) {
        next(error)
    }
}

const viewCart = async (req, res, next) => {
    try {
        const cart = await req.cart.populate({ path: 'products.productId', select: 'name price imageUrl' })

        const totalCost = calculateTotalCost(cart.products)

        logger.info(`Fetch The Cart for User: ${req.user.id}`)
        res.status(200).json({ products: cart.products, totalCost })
    } catch (error) {
        next(error)
    }
}


const updateProductFromCart = async (req, res, next) => {
    try {
        if (req.body.quantity < 0) return next('Quantity Not Valid', 400)

        const cart = req.cart

        const productIndex = findProductInCart(cart, req.product.id)
        if (productIndex === -1) return next('Product Not Found!', 404)

        if (req.body.quantity === 0) cart.products.splice(productIndex, 1)
        else {
            if (req.body.quantity + cart.products[productIndex].quantity > req.product.stock) return next('Product Quantity Exceeds The Stock!', 400)
            cart.products[productIndex].quantity += req.body.quantity
            cart.products[productIndex].totalPrice = cart.products[productIndex].quantity * cart.products[productIndex].price

        }

        await cart.save()

        logger.info(`Cart Product updated: Product increment/removed successfully for username: ${req.user.username} - ${req.product.name}`)
        res.status(200).json(cart.products[productIndex])

    } catch (error) {
        next(error)
    }
}

const deleteProductFromCart = async (req, res, next) => {
    try {
        const cart = req.cart
        const productIndex = findProductInCart(cart, req.product.id)
        if (productIndex === -1) return next('Product Not Found!', 404)

        cart.products.splice(productIndex, 1)
        await cart.save()

        logger.info(`Cart Product Removed: Product removed successfully for username: ${req.user.username} - ${req.product.name}`)
        res.status(200).json(req.product)
    } catch (error) {
        next(error)
    }
}

const clearCart = async (req, res, next) => {
    try {
        req.cart.products = []
        await req.cart.save()


        logger.info(`Cart Cleared: Cart cleared successfully for username: ${req.user.username}`)
        res.status(200).json(req.cart.products)
    } catch (error) {
        next(error)
    }
}
module.exports = { addToCart, viewCart, updateProductFromCart, deleteProductFromCart, clearCart }