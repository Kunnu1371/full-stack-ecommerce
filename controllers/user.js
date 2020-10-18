const { errorHandler } = require('../helpers/dbErrorHandler');
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
    User.findById(req.profile._id)
        .exec((err, user) => {
        if(err) return res.status(400).json(err)
        user.hashed_Password = undefined
        user.salt = undefined
        return res.json(user)
    })
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


exports.purchaseHistory = (req, res) => {
    Order.find({user: req.profile._id})
    .populate('user', '_id name email') 
    .sort('-created') 
    .exec( async (err, orders) => {
        if(err) {  
            return res.status(400).json({
                error: errorHandler(err)
            })  
        }    
        res.json({Orders: orders.length, orders})
    })
}