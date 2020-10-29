const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const cartSchema = new mongoose.Schema({
 
    Quantity: {
        type: Number,
        default: 1
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

module.exports = mongoose.model('Cart', cartSchema);