const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const cartSchema = new mongoose.Schema({
    product: {
        type: String
    },

    product: {
        type: ObjectId,
        ref: 'Product',
        required: true
    }
}, 
{
    timestamps: true
})

module.exports = mongoose.model('Wishlist', cartSchema);