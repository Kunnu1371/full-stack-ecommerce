const express = require('express')
const router = express.Router()

const  { create, read, update, remove, rootcategoryById, list, fetch }  = require('../controllers/rootCategory');
const { requireSignin, isAdmin, isAuth } = require('../controllers/authAdmin');
const  { adminById }  = require('../controllers/admin')

router.get('/rootcategory/:rootcategoryId', read)
router.delete('/rootcategory/:rootcategoryId/delete/:adminId', requireSignin, isAdmin, isAuth, remove);
router.get('/rootcategories', list)
// It will fetch all categories related to the particular root category
router.get('/categories/:rootcategoryId', fetch);


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
router.post('/rootcategory/create/:adminId', requireSignin, isAdmin, isAuth,  upload.single('photo'), 
async function(req, res) {
    if(!req.body.name || req.body.name.trim() == "") {
        return res.status(400).json({
            error: "Name is required. Please enter root category name"
        })
    }
    // check category already exist in db or not
    if(await RootCategory.findOne({ name: { $regex: `^${req.body.name.trim()}$`, $options: "i" } })) {
        return res.status(400).json({error: "Root Category already exists"})
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
                Bucket: process.env.AWS_BUCKET_NAME + '/' + 'Smartaxom' + '/' + 'RootCategory',
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
                filePath: "https://kunnu1371.s3.ap-south-1.amazonaws.com/Smartaxom/RootCategory/" + key,
                key: key
            }
        const rootcategory = new RootCategory(req.body)
        rootcategory.photo = object
        await rootcategory.save((err, rootcategory) => {
            if(err) return res.status(500).json(err)
            return res.status(201).json({
                status: "success",
                message: "Root Category created successfully",
                rootcategory
            })        
        })
    } 
    else { 
        const rootcategory = new RootCategory(req.body)
        await rootcategory.save((err, rootcategory) => {
            if(err) return res.status(500).json(err)
            return res.status(201).json({
                status: "success",
                message: "Root Category created successfully",
                rootcategory
            })
        })    
    }
});



router.put('/rootcategory/update/:rootcategoryId/:adminId', requireSignin, isAuth, isAdmin, upload.single('photo'), 
async function(req, res) {
    if(!req.body.name || req.body.name.trim() == "") {
        return res.status(400).json({
            error: "Name is required. Please enter root category name"
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
                Bucket: process.env.AWS_BUCKET_NAME + '/' + 'Smartaxom' + '/' + 'RootCategory',
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
                filePath: "https://kunnu1371.s3.ap-south-1.amazonaws.com/Smartaxom/RootCategory/" + key,
                key: key
            }
            await RootCategory.findByIdAndUpdate(req.params.rootcategoryId, {$set: req.body, photo: object }, {new: true}).exec((err, updatedRootCategory) => { 
                if(err) return res.status(500).json(err)
                return res.status(200).json({
                    status: "success", 
                    message: "Root Category updated successfully",
                    updatedRootCategory
                })
            })
        } 
        else { 
           await RootCategory.findByIdAndUpdate(req.params.rootcategoryId, {$set: req.body}, {new: true}).exec((err, updatedRootCategory) => {
           if(err) return res.status(500).json(err)
            return res.status(200).json({
                status: "success", 
                message: "Root Category updated successfully",
                updatedRootCategory
                })
            })
        }   
})



router.param('adminId', adminById)
router.param('rootcategoryId', rootcategoryById)


module.exports = router;