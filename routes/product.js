const express = require('express')
const router = express.Router()

const  { read, remove, productById, fetch, list, listRelated, listBySearch, photo, paginatedResults }  = require('../controllers/product');
const { requireSignin, isAdmin, isAuth } = require('../controllers/authAdmin');
const  { adminById }  = require('../controllers/admin')
const { subCategoryById } = require('../controllers/subCategory')

const RootCategory = require('../models/rootCategory')
const Category = require('../models/category')
const SubCategory = require('../models/subCategory')
const Product = require('../models/product')
const multer = require('multer')
const path = require('path')
const aws = require('aws-sdk')
const fs = require('fs')

router.get('/product/:productId', read)
router.delete('/product/delete/:productId/:adminId', requireSignin, isAdmin, isAuth, remove)
router.get('/products/related/:productId', listRelated)
router.post("/products/by/search", listBySearch);
router.get('/product/photo/:productId', photo)
router.get('/products', paginatedResults(Product))
  
router.param('adminId', adminById)
router.param('productId', productById)
router.param('subcategoryId', subCategoryById)


// Set The Storage Engine
const storage = multer.diskStorage({
    // destination: './uploads/',
    filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1024 * 1024},
    fileFilter: function(req, file, cb){
    checkFileType(file, cb);
    }
})

// Check File Type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
    return cb(null,true);
    } else {cb("Only images with PNG, JPG, and JPEG extentions are allowed!");}
}

router.post('/product/create/:adminId', requireSignin, isAdmin, isAuth, upload.array('photo', 6),async function (req, res) {

    let { name, description, price, rootcategory, category, subcategory, quantity, shipping } = req.body
    if(!name || !description || !price || !rootcategory || !category || !subcategory || !quantity || !shipping) {
        return res.status(400).json({
            error: "All fields are required."
        })
    }

    if(!req.body.name || req.body.name.trim() == "") {
        return res.status(400).json({
            error: "Name is required. Please enter name"
        })
    }
    
    rootcategory = await RootCategory.findOne({_id: req.body.rootcategory})
    if(!rootcategory) {return res.status(400).json({error: "Root Category doesn't exist. Please make one."})}

    category = await Category.findOne({_id: req.body.category})
    if(!category) {return res.status(400).json({error: "Category doesn't exist. Please make one."})}

    subcategory = await SubCategory.findOne({_id: req.body.subcategory})
    if(!subcategory) {return res.status(400).json({error: "Sub Category doesn't exist. Please make one."})}
    
    
    let array = []
    console.log(req.files, req.files.length)
    for(x of req.files) {
        let obj = {
            path: path.join(__dirname, 'uploads') + "/" + x.filename,
            contentType: x.mimetype
        }
        array.push(obj)
    }
    
    if(await Product.findOne({ name: {$regex: name, $options:"$i"}})) {
        return res.status(400).json({error: "Product already exist in database."})
    }

    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    })
    
    for(file of req.files){
        console.log(file)
        var buffer = fs.readFileSync(file.path)
        var params = {
            Bucket: process.env.AWS_BUCKET_NAME + '/' + 'Smartaxom',
            Key: file.fieldname + '-' + Date.now() + path.extname(file.originalname),
            Body: buffer
        }    
        s3.upload(params, (error, data) => {
            if(error){
                res.status(500).send(error)
            }
            console.log('uploaded to s3', data)
            // res.status(200).send(data)
        })
    }
    const product = new Product(req.body)
    await product.save((err, product) => {
        if(err) return res.status(500).json(err)
        Product.findOneAndUpdate({_id: product.id}, {$set: { photo: array }}, {new: true}, (err, product) => {
            if(err) return res.status(500).json(err)
            return res.status(201).json({
                status: "success",
                message: "Product created successfully", 
                product
            })
        })
    })
})



router.put('/product/update/:productId/:adminId', requireSignin, isAdmin, isAuth, upload.array('photo', 6),async function (req, res) {

    let { name, description, price, rootcategory, category, subcategory, quantity, shipping } = req.body
    if(!name || !description || !price || !rootcategory || !category || !subcategory || !quantity || !shipping) {
        return res.status(400).json({
            error: "All fields are required."
        })
    }

    if(!req.body.name || req.body.name.trim() == "") {
        return res.status(400).json({
            error: "Name is required. Please enter name"
        })
    }
    
  
    rootcategory = await RootCategory.findOne({_id: req.body.rootcategory})
    if(!rootcategory) {return res.status(400).json({error: "Root Category doesn't exist. Please make one."})}

    category = await Category.findOne({_id: req.body.category})
    if(!category) {return res.status(400).json({error: "Category doesn't exist. Please make one."})}

    subcategory = await SubCategory.findOne({_id: req.body.subcategory})
    if(!subcategory) {return res.status(400).json({error: "Sub Category doesn't exist. Please make one."})}
    
    console.log(req.files, req.files.length)
    let array = []
    for(x of req.files) {
        let obj = {
            path: path.join(__dirname, 'uploads') + "/" + x.filename,
            contentType: x.mimetype
        }
        array.push(obj)
    }
    
    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    })
    
    for(file of req.files){
        console.log(file)
        var buffer = fs.readFileSync(file.path)
        var params = {
            Bucket: process.env.AWS_BUCKET_NAME + '/' + 'Smartaxom',
            Key: file.fieldname + '-' + Date.now() + path.extname(file.originalname),
            Body: buffer
        }    
        s3.upload(params, (error, data) => {
            if(error){
                res.status(500).send(error)
            }
            console.log('uploaded to s3', data)
            // res.status(200).send(data)
        })
    }
    
    const product = req.product
    Product.findOneAndUpdate({_id: product._id}, {$set: req.body}, {new: true}, (err, updatedProduct) => {
        if(err) return res.status(500).json(err)
        Product.findOneAndUpdate({_id: updatedProduct._id}, {$set: {photo: array}}, {new: true}, (err, updatedProduct) => {
            if(err) return res.status(500).json(err)
            return res.status(201).json({
                status: "success",
                message: "Product updated successfully", 
                updatedProduct
            })
        })
    })
})

module.exports = router;