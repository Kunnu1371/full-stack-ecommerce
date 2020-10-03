const mongoose = require('mongoose')

const CarousalSchema = mongoose.Schema({
    name: {
        type: String
    },
    image: {
        data: Buffer,
        contentType: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Carousal', CarousalSchema);