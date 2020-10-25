const { errorHandler } = require('../helpers/dbErrorHandler');
const Admin = require('../models/admin')

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
            res.status(200).json({status: "success", admin})
        })
}