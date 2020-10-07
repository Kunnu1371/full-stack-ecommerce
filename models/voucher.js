const mongoose = require('mongoose')

const voucherSchema = new mongoose.Schema({
    
    voucherCode: {
        type: String,
    },

    amount: {
        type: Number,
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

module.export = mongoose.model('Voucher', voucherSchema)