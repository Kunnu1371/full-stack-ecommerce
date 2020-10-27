const Product = require('../models/product')
const { errorHandler } = require('../helpers/dbErrorHandler')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const subCategory = require('../models/subCategory')
const path = require('path')

exports.productById = (req,res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err || !product) {
            return res.status(404).json({
                error: 'Product not found'
            })
        }
        req.product = product;
        next();
    })
}

exports.read = (req, res) => {
    const product = req.product
    return res.status(200).json({
        status: "success",
        product
    })
}


exports.create = (req, res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.multiples = true

    form.parse(req, async (err, fields, files) => {
        if(err) {return res.status(400).json({error: 'Image could not be uploaded'})}

        const { name, description, price, category, subCategoryName, quantity, shipping } = fields
        if(!name || !description || !price || !category || !quantity || !shipping || !subCategoryName) {
            return res.status(400).json({
                error: "All fields are required."
            })
        }

        if(await Product.findOne({ name: {$regex: name, $options:"$i"}})) {
            return res.status(400).json("Product already exist.")
        }

        let product = new Product(fields)

        if(files.photo) {
            if(files.photo.path == undefined) {
                var filePath = []
                let doUpload = 1
                files.photo.map((files) => {
                    if(files.size > 1*1024*1024) { 
                        doUpload = 0
                        return res.status(400).json({error: "Image should be less than 1mb in size."})}  
    
                        var oldPath = files.path; 
                        var newPath = path.join(__dirname, 'uploads') + '/'+files.name 
                        var rawData = fs.readFileSync(oldPath) 
                        const obj = {
                            data: newPath,
                            contentType: files.type
                        }
                        filePath.push(obj)
                        fs.writeFile(newPath, rawData, (err) => { 
                            if(err) console.log(err) 
                        })  
                    })
                    if(doUpload == 1) {
                        subCategory.findById(fields.category).exec((err, result) => {
                            if(err) {res.status(500).json(err)}
                            // category found
                        if(result) {  
                                product.save((err, result) => {
                                    if(err) {return res.status(500).json({error: err})}
                                    Product.findOneAndUpdate({_id: result.id}, {$set: { photo: filePath }}, {new: true}, (err, Product) => {
                                        if(err) return res.status(500).json(err)
                                        console.log(filePath)
                                        return res.status(201).json({
                                            status: "success",
                                            message: "Product created successfully", 
                                            Product
                                        })
                                    })
                                    // return res.status(201).json({message: "Product created successfully", result})
                                })
                            }
                            else{return res.status(404).json({ message: "Cannot create product as it's Sub-Category doesn't exist"})}
                        }) 
                    }
                }
                else {
                    var filePath = [],
                    doUpload = 1
                    if(files.photo.size > 1*1024*1024) {
                    doUpload = 0
                    return res.status(400).json({error: "Image should be less than 1mb in size."})}       
        
                    var oldPath = files.photo.path; 
                    var newPath = path.join(__dirname, 'uploads') + '/'+files.photo.name 
                    var rawData = fs.readFileSync(oldPath) 
                    const obj = {
                        data: newPath,
                        contentType: files.photo.type
                    }  
                    filePath.push(obj)         
                    fs.writeFile(newPath, rawData, (err) => { 
                        if(err) console.log(err) 
                    })   
                    if(doUpload == 1) {
                        subCategory.findById(fields.category).exec((err, result) => {
                            if(err) {res.status(500).json(err)}
                            // category found
                        if(result) {  
                                product.save((err, result) => {
                                    if(err) {return res.status(500).json({error: err})}
                                    Product.findOneAndUpdate({_id: result.id}, {$set: { photo: filePath }}, {new: true}, (err, Product) => {
                                        if(err) return res.status(500).json(err)
                                        console.log(filePath)
                                        return res.status(201).json({
                                            status: "success",
                                            message: "Product created successfully", 
                                            Product
                                        })
                                    })
                                    // return res.status(201).json({message: "Product created successfully", result})
                                })
                            }
                            else{return res.status(404).json({ message: "Cannot create product as it's Sub-Category doesn't exist"})}
                        }) 
                    }
                }
            }
            else {
                subCategory.findById(fields.category).exec((err, result) => {
                    if(err) {res.status(500).json(err)}
                    // category found
                if(result) {  
                        product.save((err, result) => {
                            if(err) {return res.status(500).json({error: err})}
                            return res.status(201).json({
                                status: "success",
                                message: "Product created successfully", 
                                result
                            })
                        })
                    }
                    else{return res.status(404).json({ message: "Cannot create product as it's Sub-Category doesn't exist"})}
                }) 
            }
        })
    }



    
    exports.update = (req, res) => {

        let form = new formidable.IncomingForm()
        form.keepExtensions = true
        form.multiples = true
    
        form.parse(req, async (err, fields, files) => {
            if(err) {return res.status(400).json({error: 'Image could not be uploaded'})}
    
            const { name, description, price, category, subCategoryName, quantity, shipping } = fields
            if(!name || !description || !price || !category || !quantity || !shipping || !subCategoryName) {
                return res.status(400).json({
                    error: "All fields are required."
                })
            }

            let product = req.product
            product = _.extend(product, fields)    

            if(files.photo) {
                if(files.photo.path == undefined) {
                    var filePath = []
                    let doUpload = 1
                    files.photo.map((files) => {
                        if(files.size > 1*1024*1024) { 
                            doUpload = 0
                            return res.status(400).json({error: "Image should be less than 1mb in size."})}  
        
                            var oldPath = files.path; 
                            var newPath = path.join(__dirname, 'uploads') + '/'+files.name 
                            var rawData = fs.readFileSync(oldPath) 
                            const obj = {
                                data: newPath,
                                contentType: files.type
                            }
                            filePath.push(obj)
                            fs.writeFile(newPath, rawData, (err) => { 
                                if(err) console.log(err) 
                            })  
                        })
                        if(doUpload == 1) {
                            subCategory.findById(fields.category).exec((err, result) => {
                                if(err) {res.status(500).json(err)}
                                // category found
                            if(result) {  
                                    product.save((err, result) => {
                                        if(err) {return res.status(500).json({error: err})}
                                        Product.findOneAndUpdate({_id: result.id}, {$set: { photo: filePath }}, {new: true}, (err, updated) => {
                                            if(err) return res.status(500).json(err)
                                            console.log(filePath)
                                            return res.status(200).json({
                                                status: "success",
                                                message: "Product updated successfully", 
                                                updated
                                            })
                                        })
                                        // return res.status(201).json({message: "Product updated successfully", result})
                                    })
                                }
                                else{return res.status(404).json({ message: "Cannot create product as it's Sub-Category doesn't exist"})}
                            }) 
                        }
                    }
                    else {
                        var filePath = [],
                        doUpload = 1
                        if(files.photo.size > 1*1024*1024) {
                        doUpload = 0
                        return res.status(400).json({error: "Image should be less than 1mb in size."})}       
            
                        var oldPath = files.photo.path; 
                        var newPath = path.join(__dirname, 'uploads') + '/'+files.photo.name 
                        var rawData = fs.readFileSync(oldPath)  
                        const obj = {
                            data: newPath,
                            contentType: files.photo.type
                        }  
                        filePath.push(obj) 
                        fs.writeFile(newPath, rawData, (err) => { 
                            if(err) console.log(err) 
                        })  
                        if(doUpload == 1) {
                            subCategory.findById(fields.category).exec((err, result) => {
                                if(err) {res.status(500).json(err)}
                                if(result) {  
                                    product.save((err, result) => {
                                        if(err) {
                                            console.log("error: ", err)
                                            return res.status(500).json({error: err})
                                        }
                                        Product.findOneAndUpdate({_id: result.id}, {$set: { photo: filePath }}, {new: true}, (err, updated) => {
                                            if(err) {return res.status(500).json(err)}
                                            return res.status(200).json({
                                                status: "success",
                                                message: "Product updated successfully", 
                                                updated
                                            })
                                        })
                                        // return res.status(201).json({message: "Product created successfully", result})
                                    })
                                }
                                else{return res.status(404).json({ message: "Cannot create product as it's Sub-Category doesn't exist"})}
                            }) 
                        }
                    }
                }
                else {
                    subCategory.findById(fields.category).exec((err, result) => {
                        if(err) {res.status(500).json(err)}
                        // category found
                    if(result) {  
                            product.save((err, updated) => {
                                if(err) {return res.status(500).json({error: err})}
                                return res.status(200).json({
                                    status: "success",
                                    message: "Product updated successfully", 
                                    updated
                                })
                            })
                        }
                        else{return res.status(404).json({ message: "Cannot create product as it's Sub-Category doesn't exist"})}
                    }) 
                }
            })
        }
          
            


exports.remove = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        res.status(200).json({
            status: "success",
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
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
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
            res.status(404).json({
                error: "Product not found"
            })
        }
        res.status(200).json({
            status: "success",    
            products
        })
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
                return res.status(500).json({error: err});
            }
            res.status(200).json({
                status: "success",
                size: data.length,
                data
            });
        });
};



exports.photo  = (req, res, next) => {
    if(req.product.photo)
    console.log(req.product.photo.data[0], req.product.photo.contentType[0])
    res.set("Content-Type", req.product.photo.contentType[0])
    res.status(200).send(req.product.photo.data[0])
    next();
}


const Cart = require('../models/cart')
exports.decreaseQuantity = async (req, res) => {
    await Cart.find().exec((err, cart) => {
        if(err) { return res.json(err)}
        cart.map(async (product) => {
            const productQuantityInCart = product.Quantity
            // console.log(productQuantityInCart)
            await Product.findOneAndUpdate({_id: product.product}, {$inc: { quantity: -productQuantityInCart, sold: +productQuantityInCart }}, {new: true}).exec((err, results) => {
                if(err) {return res.status(500).json({error: err})}
                // console.log("Successfully updated product quantity in database", results.quantity)
            })
        })
    })
}