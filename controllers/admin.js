const { errorHandler } = require('../helpers/dbErrorHandler');
const { Order } = require('../models/order');
const Admin = require('../models/admin')

exports.adminById = (req, res, next, id) => {
    Admin.findById(id).exec((err, admin) => {
        if(err || !admin) {
            return res.status(400).json({
                error: "Admin not found"
            })
        }
        req.profile = admin;
        next();
    })
}

exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

exports.update = (req, res) => {
    Admin.findOneAndUpdate(
        {_id: req.profile.id}, 
        {$set: req.body}, 
        {new: true},
        (err, admin) => {
            if(err){
                return res.status(400).json({
                    error: 'You are not authorized to perform this action'
                })
            }
            // user.hashed_password = undefined
            // user.profile.salt = undefined
            res.json(admin)
        })

} 

exports.addOrderHistory = (req, res, next) => {
    let histroy = []
    req.body.order.products.forEach((item) => {
        histroy.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.quantity,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        })
    })

    User.findOneAndUpdate({_id: req.profile._id}, 
        {$push: {history:histroy}}, 
        {new: true}, 
        (err, data) => {
            if(err) {
                return res.status(400).json({
                    error: "Could not update user purchase histpry"
                })
            }
            next()
    })
}


exports.purchaseHistory = (req, res) => {
    Order.find({user: req.profile._id})
    .populate('user', '_id name') 
    .sort('-created')
    .exec((err, orders) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(orders)
    })
}
