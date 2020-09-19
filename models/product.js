const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema({
    subCategoryName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    }, 
     description: {
        type: String,
        required: true,
        maxlength: 2000
    }, 
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    }, 
    category: {
        type: ObjectId,
        ref: 'subCategory',
        required: true
    },
    brand: {
        type: String,
    },
    offers: {
        type: String
    },
    quantity: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    Delivery: {
        type: String
    },
    services: {
        type: String
    },
    shipping: {
        required: false,
        type: Boolean
    },
    features: {
        type: String
    },
    color: {
        type: String
    },
    size: {
        type: Number
    },
    specification: {
        type: String
    },
    sellerDetails: {
        type: String
    },
    ratings: {
        type: Number
    }, 
    QA: {
        type: String
    }
},  {
    timestamps: true
})

module.exports = mongoose.model('Product', productSchema);