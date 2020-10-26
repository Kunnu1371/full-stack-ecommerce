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