const RootCategory = require('../models/rootCategory')
const Category = require('../models/category')
const SubCategory = require('../models/subCategory')
const Product = require('../models/product')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const aws = require('aws-sdk')
const {v1} = require('uuid');
let uuidv1 = v1;

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

exports.read = async(req, res) => {
    try {
        const product = await Product.findById(req.product._id)
                                        .populate('subcategory', '_id name')
                                        .populate('category', '_id name')
                                        .populate('rootcategory', '_id name')
        return res.status(200).json({ 
            status: "success",
            product
        })
    }
    catch(e) {return res.json(400).json(e)}
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
            message: "Product has been deleted successfully."
        })
    })
}


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
        const products = await Product.find().countDocuments()
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
            results.products = await Product.find()
                                            .select("-photo")
                                            .populate("rootcategory", "_id name")
                                            .populate("category", "_id name")
                                            .populate("subcategory", "_id name")
                                            .sort([[sortBy, order]])
                                            .limit(limit)
                                            .skip(startIndex)
                                            .exec()
            res.json({status: "success", total: products, results})
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
            res.status(500).json({
                error: err
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
 
// exports.listBySearch = (req, res) => {
//     let order = req.body.order ? req.body.order : "desc";
//     let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
//     let limit = req.body.limit ? parseInt(req.body.limit) : 100;
//     let skip = parseInt(req.body.skip);
//     let findArgs = {};
 
//     // console.log(order, sortBy, limit, skip, req.body.filters);
//     // console.log("findArgs", findArgs);
 
//     for (let key in req.body.filters) {
//         if (req.body.filters[key].length > 0) {
//             if (key === "price") {
//                 // gte -  greater than price [0-10]
//                 // lte - less than
//                 findArgs[key] = {
//                     $gte: req.body.filters[key][0],
//                     $lte: req.body.filters[key][1]
//                 };
//             } else {
//                 findArgs[key] = req.body.filters[key];
//             }
//         }
//     }
 
//     Product.find(findArgs)
//         .select("-photo")
//         .populate("category")
//         .sort([[sortBy, order]])
//         .skip(skip)
//         .limit(limit)
//         .exec((err, data) => {
//             if (err) {
//                 return res.status(500).json({error: err});
//             }
//             res.status(200).json({
//                 status: "success",
//                 size: data.length,
//                 data
//             });
//         });
// };



exports.photo  = (req, res) => {
    if(req.product.photo)
    console.log(req.product.photo.data, req.product.photo.contentType)
    // res.set("Content-Type", req.product.photo.contentType[0])
    // res.status(200).sendFile(req.product.photo.data[0])
    res.status(200).send(req.product.photo.data)
}


const Cart = require('../models/cart')
exports.decreaseQuantity = async(req, res) => {
    try{
        const cart = await Cart.find().populate("product")
        cart.map( async(product) => {
            console.log(product)
            const productQuantityInCart = product.Quantity
            console.log("productQuantityInCart: ", productQuantityInCart)
            await Product.findOneAndUpdate({_id: product.product}, {$inc: { quantity: -productQuantityInCart, sold: +productQuantityInCart }}, {new: true}).exec((err, results) => {
                if(err) {return res.status(500).json({error: err})}
                console.log("Successfully updated product quantity in database", results.quantity)
            })
        })
    }
    catch(e) {
        return res.status(400).json(e)
    }     
}