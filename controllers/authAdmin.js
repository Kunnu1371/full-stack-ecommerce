const Admin = require('../models/admin')
const { errorHandler } = require('../helpers/dbErrorHandler')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

exports.signup = async (req, res) => {
    console.log(req.body)
    const adminFound = await Admin.findOne({email: { $regex: `^${req.body.email}$`, $options: "i" }}, (err, admin) => {
        if(err) return res.json(err)
    })
    if(adminFound) {
        // console.log("userFound", adminFound)
        return res.json("User with that email exist in database. Please login")
    } else {
            const admin = new Admin(req.body)
            admin.save((err, admin) => {
            if(err) {
                return res.status(400).json({
                    err: errorHandler(err)
                })
            }
            admin.salt = undefined
            admin.hashed_Password = undefined
            res.json({
                admin 
            })
            console.log(admin)
        })
    }
} 

exports.signin = (req, res) => { 
    // Check user based on email
    const { email, password} = req.body
    Admin.findOne({email}, (err, admin) => {
        if(err || !admin) {
            return res.status(400).json({
                err: "Admin with that email doesn't exist. Please signup"
            })
        }
        // If admin found
        if(!admin.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password don't match"
            })
        }
        const token = jwt.sign({_id: admin._id}, process.env.JWT_SECRET)
        res.cookie('t', token, { expire: new Date() + 9999})
        const {_id, name, email, role} = admin
        return res.json({  token,
                            admin: {_id, email, name, role}
                        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({
        message: "signout success"
    })
}

// Cookie parser is required for this function to protect routes
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth"
})

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    // console.log("req.auth: ", req.auth, "req.auth._id: ", req.auth._id)
    // console.log(user)
    if(!user) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin resource. Access Denied"
        })
    }
    next();
}