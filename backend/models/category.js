const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const categorySchema = new mongoose.Schema({
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
    
    rootcategory: {
        type: ObjectId,
        ref: 'RootCategory',
        required: true
    }
},  {
    timestamps: true
})

module.exports = mongoose.model("Category", categorySchema);