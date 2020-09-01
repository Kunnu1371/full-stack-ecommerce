const subCateogry = require('../models/subCategory')
const Category = require('../models/category')
const { errorHandler } = require('../helpers/dbErrorHandler')
const { result } = require('lodash')

exports.create = (req, res) => {
    const subCategory = new subCateogry(req.body)
    console.log(req.body.category)
    Category.findById(req.body.category).exec((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        if(result) {
            subCategory.save((err, data) => {
                if(err) {
                    return res.status(400).json({result})
                }
                res.json({message: "Sub-Category created successfully", data})
            })
        }
        else{
            return res.status(400).json({ message: "Cannot create Sub-Category as it's Category doesn't exist"})
        }
    })
}