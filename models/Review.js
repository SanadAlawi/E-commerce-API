const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.ObjectId, ref: 'User'},
    productId: {type: mongoose.Schema.ObjectId, ref: 'Product'},
    rating: {type: Number, required: true, min: 1, max: 5},
    comment: {type: String}
}, {timestamps: true})

module.exports = mongoose.model('Review', reviewSchema)