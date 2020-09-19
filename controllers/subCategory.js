const subCateogry = require('../models/subCategory')
const Category = require('../models/category')
const Product = require('../models/product')
const { errorHandler } = require('../helpers/dbErrorHandler')
const { result } = require('lodash')

exports.subCategoryById = (req, res, next, id) => {
    subCateogry.findById(id).exec((err, subCategory) => {
        if(err || !subCategory) {
            res.status(400).json({
                error: "Sub-Category not found."
            })
        }
        req.subCategory = subCategory
        next();
    }) 
}

exports.read = (req, res) => {
    return res.json(req.subCategory)
}

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

exports.update = (req, res) => {
    const subCategory = req.subCategory
    subCategory.name = req.body.name
    subCategory.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.remove = (req, res) => {
    let subCategory = req.subCategory
    subCategory.remove((err, deletedSubCategory) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            "message": "Sub-Category deleted successfully."
        })
    })
}



exports.list = (req, res) => {
    subCateogry.find().exec((err, data) => {
        if(err) {
            res.status(400).json({
                error: err
            })
        }
       res.json(data) 
    })
}

// exports.fetch = (req, res) => {
//     Product.find({category : req.subCategory}) .select("-photo").exec((err, data) => {
//         if(err) {
//             res.status(400).json({
//                 error: err
//             })
//         }
//         res.json(data)
//     });
// }