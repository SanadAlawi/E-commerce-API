const { cartSchema } = require('../config/validationSchema')
const { addToCart, viewCart, updateProductFromCart, deleteProductFromCart, clearCart } = require('../controllers/cartController')
const { verifyToken } = require('../middleware/authentication')
const { validateProductId, validateRequest, checkStock, checkCart } = require('../middleware/validation')

const router = require('express').Router()

// ADD TO CART
router.post('/', verifyToken, validateRequest(cartSchema), validateProductId, checkStock, addToCart)

// VIEW CART
router.get('/', verifyToken, checkCart, viewCart)

// UPDATE PRODUCT FROM CART
router.put('/:productId', verifyToken, validateProductId, checkStock, checkCart, updateProductFromCart)

// Delete PRODUCT FROM THE CART
router.delete('/:productId', verifyToken, validateProductId, checkCart, deleteProductFromCart)

// CLEAR CART
router.delete('/', verifyToken, checkCart, clearCart)

module.exports = router