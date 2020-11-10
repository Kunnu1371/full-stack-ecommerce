const express = require('express')
const router = express.Router()

const  { create, read, update, remove, categoryById, list, fetch }  = require('../controllers/category');
const { requireSignin, isAdmin, isAuth } = require('../controllers/authAdmin');
const  { adminById }  = require('../controllers/admin')

router.get('/category/:categoryId', read)
router.delete('/category/delete/:categoryId/:adminId', requireSignin, isAdmin, isAuth, remove);
router.get('/categories', list)
// It will fetch all sub categories related to the particular category
router.get('/subcategories/:categoryId', fetch);

const multer = require('multer')
const Category = require('../models/category')
const RootCategory = require('../models/rootCategory')
const aws = require('aws-sdk')
const path = require('path')
const fs = require('fs')

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
router.post('/category/create/:adminId', requireSignin, isAdmin, isAuth,  upload.single('photo'), 
async function(req, res) {
    if(!req.body.name || req.body.name.trim() == "") {
        return res.status(400).json({
            error: "Name is required. Please enter category name"
        })
    }

    if(!req.body.rootcategory || req.body.rootcategory.trim() == "") {
        return res.status(400).json({
            error: "Root Category ID is required. Please enter root category ID"
        })
    }

    // check root category exist in db or not
    const rootcategory = await RootCategory.findOne({_id: req.body.rootcategory})
    if(!rootcategory) {
        return res.status(404).json({
            error: "Root Category doesn't exist. Please make one."
        })
    }

    // check category already exist in db or not
    if(await Category.findOne({ name: { $regex: `^${req.body.name.trim()}$`, $options: "i" } })) {
        return res.status(400).json({error: "Category already exists"})
    }

    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    })
    // console.log(req.file)
    const file = req.file
    if(file != undefined) { 
        var buffer = fs.readFileSync(file.path)
            let key = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME + '/' + 'Smartaxom' + '/' + 'Category',
                Key: key,
                Body: buffer,
                ACL: "public-read"
            }    
            s3.upload(params, async(error, data) => {
                if(error){ 
                    console.log("error: ", error)
                    return res.status(500).json(error)
                }
                console.log('uploaded to s3', data)
                // res.status(200).send(data)
            })
            const object = {
                filePath: "https://kunnu1371.s3.ap-south-1.amazonaws.com/Smartaxom/Category/" + key,
                key: key
            }
        const category = new Category(req.body)
        category.photo = object
        await category.save((err, category) => {
            if(err) return res.status(500).json(err)
            return res.status(201).json({
                status: "success",
                message: "Category created successfully",
                category
            })        
        })
    } 
    else { 
        const category = new Category(req.body)
        await category.save((err, category) => {
            if(err) return res.status(500).json(err)
            return res.status(201).json({
                status: "success",
                message: "Category created successfully",
                category
            })
        })    
    }
});



router.put('/category/update/:categoryId/:adminId', requireSignin, isAuth, isAdmin, upload.single('photo'), 
async function(req, res) {
    if(!req.body.name || req.body.name.trim() == "") {
        return res.status(400).json({
            error: "Name is required. Please enter root category name"
        })
    }

    if(!req.body.rootcategory || req.body.rootcategory.trim() == "") {
        return res.status(400).json({
            error: "Root Category ID is required. Please enter root category ID"
        })
    }

    const rootcategory = await RootCategory.findOne({_id: req.body.rootcategory})
    if(!rootcategory) {
        return res.status(400).json({
            error: "Root Category doesn't exist. Please make one."
        })
    }

    
    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    })
    // console.log(req.file)
    const file = req.file
    if(file != undefined) { 
        var buffer = fs.readFileSync(file.path)
            let key = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME + '/' + 'Smartaxom' + '/' + 'Category',
                Key: key,
                Body: buffer,
                ACL: "public-read"
            }    
            s3.upload(params, async(error, data) => {
                if(error){ 
                    console.log("error: ", error)
                    return res.status(500).json(error)
                }
                console.log('uploaded to s3', data)
                // res.status(200).send(data)
            })
            const object = {
                filePath: "https://kunnu1371.s3.ap-south-1.amazonaws.com/Smartaxom/Category/" + key,
                key: key
            }
            await Category.findByIdAndUpdate(req.params.categoryId, {$set: req.body, photo: object }, {new: true}).exec((err, updatedCategory) => { 
                if(err) return res.status(500).json(err)
                return res.status(200).json({
                    status: "success", 
                    message: "Category updated successfully",
                    updatedCategory
                })
            })
        } 
        else { 
           await Category.findByIdAndUpdate(req.params.categoryId, {$set: req.body}, {new: true}).exec((err, updatedCategory) => {
           if(err) return res.status(500).json(err)
            return res.status(200).json({
                status: "success", 
                message: "Category updated successfully",
                updatedCategory
                })
            })
        }   
})




router.param('adminId', adminById)
router.param('categoryId', categoryById)


module.exports = router;