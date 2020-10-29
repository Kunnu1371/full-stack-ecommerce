const mongoose = require('mongoose')

const rootCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    }
},  {
    timestamps: true 
})

module.exports = mongoose.model("RootCategory", rootCategorySchema);