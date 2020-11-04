const express = require('express')
const router = express.Router()
const Product = require('../models/product')

const  { create, read, update, remove, subCategoryById, list, paginatedResults }  = require('../controllers/subCategory');
const { requireSignin, isAdmin, isAuth } = require('../controllers/authAdmin');
const  { adminById }  = require('../controllers/admin')

router.get('/subcategory/:subCategoryId', read)
router.delete('/subcategory/delete/:subCategoryId/:adminId', requireSignin, isAdmin, isAuth, remove);
router.get('/subcategories', list)
router.get('/products/:subCategoryId', paginatedResults(Product));


const multer = require('multer')
const SubCategory = require('../models/subCategory')
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
router.post('/subcategory/create/:adminId', requireSignin, isAdmin, isAuth, upload.single('photo'), 
async function(req, res) {
    if(!req.body.name || req.body.name.trim() == "") {
        return res.status(400).json({
            error: "Name is required. Please enter name"
        })
    }

    if(!req.body.category || req.body.category.trim() == "") {
        return res.status(400).json({
            error: "Category ID is required. Please enter category ID"
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

    const category = await Category.findOne({_id: req.body.category})
    if(!category) {
        return res.status(400).json({
            error: "Category doesn't exist. Please make one."
        })
    }
    
    if(await SubCategory.findOne({ name: {$regex:`${req.body.name}`, $options:"$i"}})) {
        return res.status(400).json({error: "Sub Category already exist."})
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
                Bucket: process.env.AWS_BUCKET_NAME + '/' + 'Smartaxom' + '/' + 'SubCategory',
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
                filePath: "https://kunnu1371.s3.ap-south-1.amazonaws.com/Smartaxom/SubCategory/" + key,
                key: key
            }
        const subcategory = new SubCategory(req.body)
        subcategory.photo = object
        await subcategory.save((err, subcategory) => {
            if(err) return res.status(500).json(err)
            return res.status(201).json({
                status: "success",
                message: "Sub Category created successfully",
                subcategory
            })        
        })
    } 
    else { 
        const subcategory = new SubCategory(req.body)
        await subcategory.save((err, subcategory) => {
            if(err) return res.status(500).json(err)
            return res.status(201).json({
                status: "success",
                message: "Sub Category created successfully",
                subcategory
            })
        })    
    }
});


router.put('/subcategory/update/:subCategoryId/:adminId', requireSignin, isAdmin, isAuth, upload.single('photo'), 
async function(req, res) {
    if(!req.body.name || req.body.name.trim() == "") {
        return res.status(400).json({
            error: "Name is required. Please enter name"
        })
    }

    if(!req.body.category || req.body.category.trim() == "") {
        return res.status(400).json({
            error: "Category ID is required. Please enter category ID"
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

    const category = await Category.findOne({_id: req.body.category})
    if(!category) {
        return res.status(400).json({
            error: "Category doesn't exist. Please make one."
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
            Bucket: process.env.AWS_BUCKET_NAME + '/' + 'Smartaxom' + '/' + 'SubCategory',
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
            filePath: "https://kunnu1371.s3.ap-south-1.amazonaws.com/Smartaxom/SubCategory/" + key,
            key: key
        }
        await SubCategory.findByIdAndUpdate(req.params.subCategoryId, {$set: req.body, photo: object }, {new: true}).exec((err, updatedSubCategory) => { 
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                status: "success", 
                message: "Sub Category updated successfully",
                updatedSubCategory
            })
        })
    } 
    else { 
        await SubCategory.findByIdAndUpdate(req.params.subCategoryId, {$set: req.body}, {new: true}).exec((err, updatedSubCategory) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                status: "success", 
                message: "Sub Category updated successfully",
                updatedSubCategory
            })
        }) 
    }
});

router.param('adminId', adminById)
router.param('subCategoryId', subCategoryById)


module.exports = router; 