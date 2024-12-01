const mongoose = require('mongoose')
const productItemSchema = require('./ProductItem')


const cartSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.ObjectId, ref: 'User'},
    products: [
        {
            productId: {type: mongoose.Schema.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, default: 1},
            price: {type: Number, required: true},
            totalPrice: {type: Number, required: true}
        }
    ],
}, {timestamps: true})

module.exports = mongoose.model('Cart', cartSchema)