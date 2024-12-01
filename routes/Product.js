const router = require('express').Router()
const { productSchema, productUpdateSchema } = require('../config/validationSchema')
const { verifyTokenAndAdmin } = require('../middleware/authentication')
const { validateRequest, checkProductName, checkProductIdAndName, validateProductId } = require('../middleware/validation')
const { createProduct, viewOneProduct, viewProducts, updateProduct, deleteProduct } = require('../controllers/productController')
const Product = require('../models/Product')

// CREATE
router.post('/create', verifyTokenAndAdmin, validateRequest(productSchema), checkProductName, createProduct)

// VIEW ONE PRODUCT
router.get('/:productId', viewOneProduct)

// VIEW PRODUCTS
router.get('/', viewProducts)

// UPDATE PRODUCT
router.put('/:productId', verifyTokenAndAdmin, validateRequest(productUpdateSchema), checkProductIdAndName, updateProduct)

// DELETE PRODUCT
router.delete('/:productId',verifyTokenAndAdmin, validateProductId, deleteProduct)

module.exports = router