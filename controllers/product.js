const Product = require('../models/product')
const { errorHandler } = require('../helpers/dbErrorHandler')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const subCategory = require('../models/subCategory')
const { param } = require('../routes/product')

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


// exports.list = (req, res) => {
//     let order = req.query.order ? req.query.order : 'asc';
//     let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
//     let limit = req.query.limit ? parseInt(req.query.limit) : 6;
//     console.log(req.query)
//     Product.find()
//         .select("-photo")
//         .populate("category")
//         // .limit(1)
//         // .sort([['createdAt', -1]])
//         .limit(limit)
//         .sort([[sortBy, order]])
//         .exec((err, products) => {
//             if(err) {
//                 res.status(400).json({
//                     error: "Product not found"
//                 })
//             }
//            res.json(products)
//         })
// }


exports.paginatedResults = (Product) => {
    return async (req, res, next) => {
        let order = req.query.order ? req.query.order : 'asc';
        let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
        let limit = req.query.limit ? parseInt(req.query.limit) : 6;
        const page = parseInt(req.query.page)
    
        console.log(req.query)
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      if (endIndex < await Product.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        results.results = await Product.find()
                                        .select("-photo")
                                        .populate("category")
                                        .sort([[sortBy, order]])
                                        .limit(limit)
                                        .skip(startIndex)
                                        .exec()
        res.paginatedResults = results
        next()
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    }
  }
// sell / arrival
// by sell = /products?sortBy=sold&order=desc&limit=4
// by arrival = /products?sortBy=createdAt&order=desc&limit=4
// by price = /products?sortBy=price&order=desc&limit=4
// if no params are sent, then all products are returned


exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    Product.find({_id: {$ne: req.product}, category:req.product.category})
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
        if(err) {
            res.status(400).json({
                error: "Product not found"
            })
        }
       res.json(products)
    })
}


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
 
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};



exports.photo  = (req, res, next) => {
    if(req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}



exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map((item) => {
        return {
            updateOne: {
                filter: {_id: item._id},
                update: {$inc: {quantity: -item.count, sold: +item.count}}
            }
        }
    })

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if(error) {
            return res.status(400).json({
                error: "Could not update product"
            })
        }
       next()
    })
}