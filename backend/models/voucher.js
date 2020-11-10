const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const voucherSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    rootcategory: {
        type: ObjectId,
        ref: 'RootCategory',
        required: true
    },

    isActive: {
        type: Boolean,
        required: true,
        default: 1
    },

    isExpired: {
        type: Boolean,
        required: true,
        default: 0
    },

    expiryDate: {
        type: Date,
        required: true
    },
})

module.exports = mongoose.model('Voucher', voucherSchema)