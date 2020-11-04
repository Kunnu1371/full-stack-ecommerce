const mongoose = require('mongoose')

const rootCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    },
    photo: {
        type: Array,
        default: []
    },
},  {
    timestamps: true 
})

module.exports = mongoose.model("RootCategory", rootCategorySchema);