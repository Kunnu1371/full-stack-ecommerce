const RootCategory = require('../models/rootCategory')
const Category  = require('../models/category')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.rootcategoryById = (req, res, next, id) => {
    RootCategory.findById(id).exec((err, rootcategory) => {
        if(err || !rootcategory) {
            res.status(404).json({
                error: "Root Category not found."
            })
        }
        req.rootcategory = rootcategory
        next();
    })
}

exports.read = (req, res) => {
    const rootcategory = req.rootcategory
    return res.status(200).json({
        status: "success",
        rootcategory
    })
}


// exports.create = async (req, res) => {
//     if(!req.body.name || req.body.name.trim() == "") {
//         return res.status(400).json({
//             error: "Name is required. Please enter root category name"
//         })
//     }
//     // check category already exist in db or not
//     if(await RootCategory.findOne({ name: { $regex: `^${req.body.name.trim()}$`, $options: "i" } })) {
//         return res.status(400).json({error: "Root Category already exists"})
//     }
//     else {
//         const rootcategory = new RootCategory(req.body)
//         rootcategory.save((err, rootcategory) => {
//             if(err) {
//             return res.status(500).json({
//                 error: errorHandler(err)
//             })}
//             res.status(201).json({
//                 status: "success",
//                 message: "Root Category has been created successfully ", 
//                 rootcategory
//             })
//         })
//     }
// }


// exports.update = (req, res) => {
//     const rootcategory = req.rootcategory
//     if(!req.body.name || req.body.name.trim() == "") return res.status(400).json({error: "Please enter name to update Root Category."})
//     rootcategory.name = req.body.name
//     rootcategory.save((err, updatedRootCategory) => {
//         if(err) {
//             return res.status(500).json({
//                 error: errorHandler(err)
//             })
//         }
//         res.status(200).json({
//             status: "success",
//             message: "Root Category has been updated successfully.",
//             updatedRootCategory
//         })
//     })
// }


exports.remove = (req, res) => {
    let rootcategory = req.rootcategory
    rootcategory.remove((err, deletedRootCategory) => {
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            message: "Root Category has been deleted successfully."
        })
    })
}

exports.list = (req, res) => {
    RootCategory.find().exec((err, rootcategories) => {
        if(err) {
            res.status(500).json({
                error: err
            })
        }
       res.status(200).json({
           status: "success", 
           total: rootcategories.length,  
           rootcategories
        })
    })
}

// fetch all the categories related to root category
exports.fetch = (req, res) => {
    Category.find({rootcategory : req.rootcategory}).exec((err, categories) => {
        if(err) {
            res.status(500).json({
                error: err
            })
        } 
        res.status(200).json({
            status: "success",   
            categories
         })
    });
}