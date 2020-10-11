const subCategory = require('../models/subCategory')
const Category = require('../models/category')
const Product = require('../models/product')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.subCategoryById = (req, res, next, id) => {
    subCategory.findById(id).exec((err, subCategory) => {
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

exports.create = async (req, res) => {
    // console.log(req.body.category)
    if(!req.body.name||req.body.name.trim() == "") {
        return res.status(400).json("Sub Category name is required. Please enter category name")
    }
    if(await subCategory.findOne({ name: {$regex:`${req.body.name}`, $options:"$i"}})) {
        res.status(400).json("sub category already exist.")
    }
    else {
        Category.findById(req.body.category).exec((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            if(result) {
                const createdSubCategory = new subCategory(req.body)
                createdSubCategory.save((err, data) => {
                    if(err) {
                        return res.status(400).json({error: errorHandler(err)})
                    }
                    res.json({message: "Sub-Category created successfully", data})
                })
            }
            else{
                return res.status(400).json({ message: "Cannot create Sub-Category as it's Category doesn't exist"})
            }
        })
    }
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
    subCategory.find().exec((err, data) => {
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