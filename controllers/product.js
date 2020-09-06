const Product = require('../models/product')
const { errorHandler } = require('../helpers/dbErrorHandler')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const subCategory = require('../models/subCategory')

exports.productById = (req,res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error: 'Product not found'
            })
        }
        req.product = product;
        next();
    })
}

exports.read = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        const { name, description, price, category, subCategoryName, quantity, shipping } = fields
        if(!name || !description || !price || !category || !quantity || !shipping || !subCategoryName) {
            return res.status(400).json({
                error: "All fields are required."
            })
        }

        let product = new Product(fields)

        console.log(fields.category)
        
        if(files.photo) { 
            if(files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size."
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }


        // Check if req.category exist or not
        subCategory.findById(fields.category).exec((err, result) => {
            if(err) {
                res.status(400).json()
                console.log(id)
            }
            // category found
          if(result) {
                product.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: err
                        })
                    }
                    res.json({message: "Product created successfully", result})
                })
            }
            else{
                return res.status(400).json({ message: "Cannot create product as it's Sub-Category doesn't exist"})
            }
        })
        
    })
}


exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        const { name, description, price, category, subCategoryName, quantity, shipping } = fields
        if(!name || !description || !price || !category || !quantity || !shipping || !subCategoryName) {
            return res.status(400).json({
                error: "All fields are required."
            })
        }

        let product = req.product
        product = _.extend(product, fields)
        
        if(files.photo) { 
            if(files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size."
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }


        // Check if req.category exist or not
        subCategory.findById(fields.category).exec((err, result) => {
            if(err) {
                res.status(400).json()
                console.log(id)
            }
            // category found
          if(result) {
                product.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: err
                        })
                    }
                    res.json({message: "Product updated successfully", result})
                })
            }
            else{
                return res.status(400).json({ message: "Cannot create product as it's Sub-Category doesn't exist"})
            }
        })
        
    })
}

exports.remove = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            "message": "Product deleted successfully."
        })
    })
}

exports.list = (req, res) => {
    Product.find().exec((err, data) => {
        if(err) {
            res.status(400).json({
                error: err
            })
        }
       res.json(data)
    })
}