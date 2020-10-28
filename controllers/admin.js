const { errorHandler } = require('../helpers/dbErrorHandler');
const Admin = require('../models/admin')
const User = require('../models/user')

exports.adminById = (req, res, next, id) => {
    Admin.findById(id).exec((err, admin) => {
        if(err || !admin) {
            return res.status(404).json({
                error: "Admin not found"
            })
        }
        req.profile = admin;
        next();
    })
}

exports.read = (req, res) => {
    const profile = req.profile 
    profile.hashed_password = undefined
    profile.salt = undefined
    return res.status(200).json({ status: "success", profile})
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
            admin.salt = undefined
            admin.hashed_Password = undefined
            res.status(200).json({status: "success", admin})
        })
}


exports.removeUser = async(req, res) => {
    const userId = req.body.user
    try {
        const user = await User.findById(userId)
        user.remove((err, removedUser) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                status: "success", 
                message: "User profile has been deleted"
            })
        })
    } 
    catch(err) {
        return res.status(404).json({message: "User not found"})
    }
}



exports.removeAdmin = async(req, res) => {
    const admin = req.profile
    try {
        admin.remove((err, removedAdmin) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                status: "success", 
                message: "Admin profile has been deleted"
            })
        })
    } 
    catch(err) {
        return res.status(404).json({message: "Admin not found"})
    }
}


exports.TotalUsers = (User) => {
    return async (req, res, next) => {
        let order = req.query.order ? req.query.order : 'asc';
        let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = parseInt(req.query.page)
    
        console.log(req.query)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
    
        const users = await User.countDocuments()
        const results = {}
        if (endIndex < await User.countDocuments().exec()) {
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
            results.users = await User.find()
                                            .select('-salt -hashed_Password')
                                            .sort([[sortBy, order]])
                                            .limit(limit)
                                            .skip(startIndex)
                                            .exec()
            // res.TotalUsers = results
            res.json({status: "success", TotalUsers: users, results})
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

// exports.TotalUsers = async (req, res) => {
//     const users = await User.countDocuments()
//     res.status(200).json({
//         status: "success",
//         TotalUsers: users
//     })
// }


exports.OrderList = (Order) => {
    return async (req, res, next) => {
        let order = req.query.order ? req.query.order : 'asc';
        let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = parseInt(req.query.page)
    
        console.log(req.query)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
    
        const orders = await Order.countDocuments()
        const results = {}
        if (endIndex < await Order.countDocuments().exec()) {
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
            results.orders = await Order.find()
                                            .select('-products')
                                            .sort([[sortBy, order]])
                                            .limit(limit)
                                            .skip(startIndex)
                                            .exec()
            // res.TotalUsers = results
            res.json({status: "success", TotalOrders: orders, results})
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}


exports.userInfo = async(req, res) => {
    const userId = req.params.userId
    // console.log(userId)
    try {
        const user = await User.findById(userId)
        return res.status(200).json(user)
    } catch(e) {
        return res.status(404).json(e)
    }
}