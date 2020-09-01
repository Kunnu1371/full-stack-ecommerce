const Product = require('../models/product')
const { errorHandler } = require('../helpers/dbErrorHandler')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const subCategory = require('../models/subCategory')

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }
        let product = new Product(fields)
        console.log(fields.category)
        if(files.photo) { 
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