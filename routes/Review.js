const { objectIdSchema, reviewSchema } = require('../config/validationSchema')
const { addReview, updateReview, deleteReview, viewReviews } = require('../controllers/reviewController')
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/authentication')
const { validateProductId, validateRequest, validateQueryRequest } = require('../middleware/validation')

const router = require('express').Router()

// ADD PRODUCT REVIEW
router.post('/:productId', verifyToken, validateProductId, validateRequest(reviewSchema), addReview)

// UPDATE PRODUCT REVIEW
router.put('/:productId', verifyToken, validateProductId, validateRequest(reviewSchema), updateReview)

// DELETE PRODUCT REVIEW
router.delete('/:productId', verifyToken, validateProductId, deleteReview)

// View Reviews
router.get('/:productId', validateProductId, viewReviews)

// Admin Control
// router.delete('/:reviewId', verifyTokenAndAdmin,adminControl)

module.exports = router