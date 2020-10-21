const { errorHandler } = require('../helpers/dbErrorHandler');
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