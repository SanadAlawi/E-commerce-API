const mongoose = require('mongoose')


const productItemSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.ObjectId, ref: 'Product'},
    quantity: {type: Number, require: true, min: 1}
})

module.exports = productItemSchema