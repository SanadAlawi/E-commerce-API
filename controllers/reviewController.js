const logger = require('../config/Logger')
const AppError = require('../error/AppError')
const Order = require('../models/Order')
const Review = require('../models/Review')

const addReview = async (req, res, next) => {
    try {
        // Ensure the user has purchased the product before leaving a review.
        const orders = await Order.find({ userId: req.user.id, status: 'delivered', 'products.productId': req.params.productId })
        if (orders.length === 0) return next(new AppError('You must purchase this product before leaving a review.', 400))

        // A user can leave only one review per product. 
        // If the user has already reviewed the product, they can only update the existing review.
        let existingReview = await Review.findOne({ userId: req.user.id, productId: req.params.productId })
        if (existingReview) return next(new AppError('You have already reviewed this product. Please update your review instead.', 400))

        const review = new Review({
            userId: req.user.id,
            productId: req.params.productId,
            rating: req.body.rating,
            comment: req.body.comment
        })
        await review.save()

        // SEND RESPONSE
        logger.info(`Review added: ${req.params.productId}`)
        res.status(201).json(review)
        // res.status(201).json(existingReview)
    } catch (error) {
        next(error)
    }
}

const updateReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body

        // Ensure the user owns the review before they can modify or delete it.
        const review = await Review.findOne({ userId: req.user.id, productId: req.params.productId })
        if (!review) return next(new AppError('Review Not Found!!!', 400))

        // UPDATE REVIEW
        if (rating) review.rating = rating
        if (comment) review.comment = comment

        if (rating || comment) await review.save()

        // SEND RESPONSE
        logger.info(`Review updated: ${req.params.productId}`)
        res.status(200).json(review)

    } catch (error) {
        next(error)
    }
}

const deleteReview = async (req, res, next) => {
    try {

        // Ensure the user owns the review before they can modify or delete it.
        const review = await Review.findOneAndDelete({ userId: req.user.id, productId: req.params.productId })

        // SEND RESPONSE
        logger.info(`Review deleted: ${req.params.productId}`)
        res.status(200).json(review)

    } catch (error) {
        next(error)
    }
}

const viewReviews = async (req, res, next) => {
    try {
        let { page = 1, limit = 10 } = req.query
        page = Math.max(1, parseInt(page))

        const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'username')
            .skip((page - 1) * limit)
            .limit(limit)
        const sumRating = reviews.reduce((acc, review) => acc + review.rating, 0)

        const averageRating = sumRating / reviews.length

        const finalReviews = reviews.map(review => ({
            user: review.userId.username,
            rating: review.rating,
            comment: review.comment
        }))

        // SEND RESPONSE
        logger.info(`Reviews for product: ${req.params.productId}`)
        res.status(200).json({ averageRating, reviews: finalReviews })
    } catch (error) {
        next(error)
    }
}


const adminControl = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}

module.exports = { addReview, updateReview, deleteReview, viewReviews, adminControl }