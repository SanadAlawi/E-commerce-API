const router = require('express').Router()
const { orderSchema, orderQuerySchema, orderStatusSchema } = require('../config/validationSchema')
const { placeOrder, orderHistory, orderDetails, updateOrderState, cancelOrder } = require('../controllers/orderController')
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/authentication')
const { checkCart, validateRequest, validateQueryRequest, validateSingleProperty } = require('../middleware/validation')

// PLACE AN ORDER
router.post('/', verifyToken, checkCart, validateRequest(orderSchema), placeOrder)

// ORDER HISTORY
router.get('/', verifyToken, validateQueryRequest(orderQuerySchema), orderHistory)

// ORDER DETAILS
router.get('/:orderId', verifyToken, orderDetails)

// UPDATE ORDER STATE
router.patch('/:orderId', verifyTokenAndAdmin, validateSingleProperty(orderStatusSchema, 'status'), updateOrderState)

// CANCEL THE ORDER
router.patch('/cancel/:orderId', verifyToken, cancelOrder)

module.exports = router