const Cart = require("../models/Cart")

const getCart = async (userId, populate = false, populateSetting) => {
    let cart
    if (populate) cart = await Cart.findOne({ userId }).populate(populateSetting)
    else cart = await Cart.findOne({ userId })
    return cart
}


const findProductInCart = (cart, productId) => {
    const productIndex = cart.products.findIndex(product => product.productId.toString() === productId.toString())
    return productIndex
}

const updateExistingProduct = (product, quantity, price, stock, next) => {
    product.quantity += quantity
    product.totalPrice = product.quantity * price
    if (product.quantity > stock) return next(new AppError('Product Quantity Exceeds The Stock!', 400))
}
const addNewProductToCart = (cart, productId, quantity, price) => {
    const totalPrice = quantity * price
    cart.products.push({ productId, quantity, price, totalPrice })
}

const calculateTotalCost = (products) => {
    const totalCost = products.reduce((acc, product) => acc + product.totalPrice, 0)
    return totalCost
}

module.exports = { getCart, findProductInCart, updateExistingProduct, addNewProductToCart, calculateTotalCost }