const AppError = require("../error/AppError")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const Order = require("../models/Order")
const { calculateTotalCost } = require("../utils/cartUtils")
const { default: mongoose } = require("mongoose")
const { updateProductStock, validateProductStock, findOrder, manageRefunds, canOrderCancelled, restoreProductStock } = require("../utils/orderUtils")
const logger = require("../config/Logger")
const sendEmail = require('../utils/emailService')

const placeOrder = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const cart = req.cart

        const productPromises = cart.products.map(async item => {
            const product = await validateProductStock(item.productId, item.quantity)
            await updateProductStock(product, item.quantity, session)

            return {
                name: product.name,
                quantity: item.quantity,
                price: product.price
            }
        })

        const products = await Promise.all(productPromises)

        const totalAmount = calculateTotalCost(cart.products)
        const order = new Order({
            userId: req.user.id,
            products: cart.products,
            paymentMethod: req.body.paymentMethod,
            shippingAddress: req.body.shippingAddress,
            totalAmount
        })
        await order.save()

        await Cart.deleteOne({ userId: req.user.id }).session(session)
        
        const subject = `Order Confirmation #${order._id} - Thank You for Your Purchase!`
        await sendEmail(req.user.email, subject, { username: req.user.username, orderId: order.id, totalAmount: order.totalAmount, products }, 'ConfirmOrderEmail', next)

        await session.commitTransaction()
        session.endSession()

        res.status(201).json(order)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

const orderHistory = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, status, startDate, endDate } = req.query

        // page = Math.max(1, Number(page))
        // limit = Math.max(1, Number(limit))

        // FILTER OPTIONS
        const filter = { userId: req.user.id }
        if (status) filter.status = status
        if (startDate) filter.createdAt = { ...filter.createdAt, $gte: new Date(startDate) }
        if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) }

        // FETCH ORDER HISTORY ACCORDING TO FILTER OPTIONS
        const orders = await Order.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('products.productId', '_id name price')
            .select('_id products totalAmount paymentMethod shippingAddress status createdAt')


        logger.info(`Fetched The Order history for user: ${req.user.username}`)
        res.status(200).json(orders)
    } catch (error) {
        next(error)
    }
}


const orderDetails = async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.orderId, userId: req.user.id })
        if (!order) return next(new AppError('Order Not Found!!!', 400))

        logger.info(`Fetched The Order details for user: ${req.user.username}`)
        res.status(200).json(order)
    } catch (error) {
        next(error)
    }
}

const updateOrderState = async (req, res, next) => {

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { status } = req.body

        // CHECK ORDER EXISTS
        const order = await Order.findById(req.params.orderId).populate({ path: 'userId', select: 'id username email' })
        if (!order) return next(new AppError('Order Not Found!!!', 400))

        // CHECK IF ORDER IS NOT ALREADY CANCELLED 
        if (order.status === 'cancelled') return next(new AppError('Order is already cancelled and cannot be modified further.', 400));

        // CHECK ORDER GET CANCELLED
        if (status === 'cancelled') {
            if (!canOrderCancelled(order.status)) return next(new AppError('Cannot cancel an order that is already shipped or delivered.', 400))
            await restoreProductStock(order.products, session)
        }

        // SAVE ORDER STATUS
        order.status = status
        await order.save({ session })

        // SEND NOTIFICATION EMAIL
        const email = order.userId.email
        const subject = status === 'cancelled' ? `Your Order #${order.id} Has Been Canceled` : `Your Order #${order.id} Status Has Been Updated to ${order.status}`
        const template = status === 'cancelled' ? 'CancelledOrderEmail' : 'UpdateOrderEmail'
        const username = order.userId.username
        await sendEmail(email, subject, { username, orderId: order.id, status: order.status }, template, next)


        logger.info(`Update The Order status for user: ${username}`)
        res.status(200).json({ orderId: order.id, status: order.status, updatedAt: order.updatedAt })

        await session.commitTransaction()
        session.endSession()
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

const cancelOrder = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        // CHECK ORDER EXISTS
        const order = await Order.findOne({ _id: req.params.orderId, userId: req.user.id })
        if (!order) return next(new AppError('Order Not Found!!!', 400))

        // CHECK IF THE ORDER IS NOT ALREADY CANCELLED
        if (order.status === 'cancelled') return next(new AppError('Order is already cancelled and cannot be modified further.', 400));

        // CHECK IF ORDER NOT SHIPPED OR DELIVERED, IF SO THEN REFUNDS PRODUCTS
        if (!canOrderCancelled(order.status)) return next(new AppError('Cannot cancel an order that is already shipped or delivered.', 400))
        await restoreProductStock(order.products, session)

        // CANCEL THE ORDER
        order.status = 'cancelled'
        await order.save({ session })

        // SEND NOTIFICATION EMAIL
        await sendEmail(req.user.email, `Your Order #${order.id} Has Been Canceled`, { username: req.user.username, orderId: order.id }, 'CancelledOrderEmail', next)


        // SEND RESPONSE
        logger.info(`Cancel The Order for user: ${req.user.username}`)
        res.status(200).json({ orderId: order.id, status: order.status, message: 'Your order has been successfully cancelled.' })

        await session.commitTransaction()
        session.endSession()
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

module.exports = { placeOrder, orderHistory, orderDetails, updateOrderState, cancelOrder }