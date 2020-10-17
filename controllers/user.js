const { errorHandler } = require('../helpers/dbErrorHandler');
const order = require('../models/order');
const Order = require('../models/order');
const User = require('../models/user')

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.profile = user;
        next();
    })
}

exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    console.log(req.profile)
    return res.json(req.profile)
}

exports.update = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile.id}, 
        {$set: req.body}, 
        {new: true},
        (err, user) => {
            if(err){
                return res.status(400).json({
                    error: 'You are not authorized to perform this action'
                })
            }
            // user.hashed_password = undefined
            // user.profile.salt = undefined
            res.json(user)
        })

} 

exports.addOrderHistory = (req, res, next) => {
    console.log("moddleware u ning")

    let history = []

    req.order.products.map((item) => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.quantity,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        }) 
    })

    // User.findOneAndUpdate({_id: req.profile._id}, 
    //     {$push: {history:history}}, 
    //     {new: true}, 
    //     (err, data) => {
    //         if(err) {
    //             return res.status(400).json({
    //                 error: "Could not update user purchase history"
    //             })
    //         }
            next()
    // })
}


exports.purchaseHistory = (req, res) => {
    Order.find({user: req.profile._id})
    .populate('user', '_id name') 
    .sort('-created') 
    .exec( async (err, orders) => {
        if(err) {  
            return res.status(400).json({
                error: errorHandler(err)
            })  
        }    
        // req.profile.history = orders
        // await orders.map((order) => {
        //     req.profile.history.push(order.products)
        // })
        // console.log(req.profile.history)
        // console.log(req.profile.history)
        res.json({Orders: orders.length, orders})
    })
}