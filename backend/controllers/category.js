const RootCategory = require('../models/rootCategory')
const Category = require('../models/category')
const SubCategory  = require('../models/subCategory')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            res.status(404).json({
                error: "Category not found."
            })
        }
        req.category = category
        next();
    })
}

exports.read = async (req, res) => {
    try {
        const category = await Category.findById(req.category._id).populate('rootcategory')
        return res.status(200).json({
            status: "success",
            category
        })
    }
    catch(e) {
        return res.json(400).json(e)
    }
}


// exports.create = async (req, res) => {
//     if(!req.body.name || req.body.name.trim() == "") {
//         return res.status(400).json({
//             error: "Name is required. Please enter category name"
//         })
//     }

//     if(!req.body.rootcategory || req.body.rootcategory.trim() == "") {
//         return res.status(400).json({
//             error: "Root Category ID is required. Please enter root category ID"
//         })
//     }


//     // check root category exist in db or not
//     const rootcategory = await RootCategory.findOne({_id: req.body.rootcategory})
//     if(!rootcategory) {
//         return res.status(400).json({
//             error: "Root Category doesn't exist. Please make one."
//         })
//     }

//     // check category already exist in db or not
//     if(await Category.findOne({ name: { $regex: `^${req.body.name.trim()}$`, $options: "i" } })) {
//         return res.status(400).json({error: "Category already exists"})
//     }
//     else {
//         const category = new Category(req.body)
//         category.save((err, category) => {
//             if(err) {
//             return res.status(500).json({
//                 error: errorHandler(err)
//             })}
//             res.status(201).json({
//                 status: "success",
//                 message: "Category has been created successfully.", 
//                 category
//             })
//         })
//     }
// }


// exports.update = async(req, res) => {
   
//     if(!req.body.name || req.body.name.trim() == "" || !req.body.rootcategory || req.body.rootcategory.trim() == "") return res.status(400).json({error: "All fields are required."})

//     const category = req.category
//     const rootcategory = await RootCategory.findOne({_id: req.body.rootcategory}) 

//     if(!rootcategory) {
//         return res.status(400).json({
//             error: "Invalid Root Category or it doesn't exist."
//         })
//     }
   
//     await Category.findOneAndUpdate({_id: category._id}, {$set: req.body}, {new: true}).exec((err, updatedcategory) => {
//         if(err) {
//             return res.status(500).json({
//                 error: errorHandler(err)
//             })
//         }
//         res.status(201).json({
//             status: "success",
//             message: "Category has been updated successfully",
//             updatedcategory
//         })
//     })

// }


exports.remove = (req, res) => {
    let category = req.category
    category.remove((err, deletedCategory) => {
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            "message": "Category has been deleted successfully."
        })
    })
}

exports.list = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err) {
            res.status(500).json({
                error: err
            })
        }
       res.status(200).json({
           status: "success",  
           total: categories.length, 
           categories
        })
    })
}

// fetch all the sub categories related to root category
exports.fetch = (req, res) => {
    SubCategory.find({category : req.category}).exec((err, subcategories) => {
        if(err) {
            res.status(500).json({
                error: err
            })
        } 
        res.status(200).json({
            status: "success",   
            subcategories
         })
    });
}