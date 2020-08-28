const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const subCategorySchema = new mongoose.Schema({
    CategoryName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    }, 
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },

},  {
    timestamps: true
})

module.exports = mongoose.model("subCategory", subCategorySchema);