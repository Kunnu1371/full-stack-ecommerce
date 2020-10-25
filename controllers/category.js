const Category = require('../models/category')
const { errorHandler } = require('../helpers/dbErrorHandler')
const subCategory = require('../models/subCategory')


exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            res.status(404).json({
                error: "Category not found."
            })
        }
        req.category = category
        next();
    })
}

exports.read = (req, res) => {
    const category = req.category
    return res.status(200).json({
        status: "success",
        category
    })
}


exports.create = async (req, res) => {
    if(!req.body.name || req.body.name.trim() == "") {
        return res.status(400).json({
            message: "Name is required. Please enter category name"
        })
    }
    // check category already exist in db or not
    if(await Category.findOne({ name: { $regex: `^${req.body.name}$`, $options: "i" } })) {
        return res.status(400).json({message: "Category already exists"})
    }
    else {
        const category = new Category(req.body)
        category.save((err, data) => {
            if(err) {
            return res.status(500).json({
                error: errorHandler(err)
            })}
            res.status(201).json({
                status: "success",
                message: "Category created successfully ", 
                data
            })
        })
    }
}


exports.update = (req, res) => {
    const category = req.category
    category.name = req.body.name
    category.save((err, updatedCategory) => {
        if(err) {
            return res.status(500).json({
                error: errorHandler(err)
            })
        }
        res.status(200).json({
            status: "success",
            "message": "Category updated successfully.",
            updatedCategory
        })
    })
}


exports.remove = (req, res) => {
    let category = req.category
    category.remove((err, deletedCategory) => {
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            "message": "Category deleted successfully."
        })
    })
}

exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if(err) {
            res.status(500).json({
                error: err
            })
        }
       res.status(200).json({
           status: "success",   
           data
        })
    })
}

exports.fetch = (req, res) => {
    subCategory.find({category : req.category}).exec((err, data) => {
        if(err) {
            res.status(500).json({
                error: err
            })
        } 
        res.status(200).json({
            status: "success",   
            data
         })
    });
}