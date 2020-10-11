const formidable = require('formidable')
const Carousal = require('../models/carousal')
const fs = require('fs')
const _ = require('lodash')

exports.carousalById = (req,res, next, id) => {
    Carousal.findById(id).exec((err, carousal) => {
        if(err || !carousal) {
            return res.status(400).json({
                error: 'Image not found'
            })
        }
        req.carousal = carousal;
        next();
    })
}


exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        let carousal = new Carousal(fields)
        
        if(files.image) { 
            if(files.image.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size."
                })
            }
            carousal.image.data = fs.readFileSync(files.image.path)
            carousal.image.contentType = files.image.type
        }


        carousal.save((err, image) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json({message: "Image created successfully", image})
        })
    })
}



exports.read = (req, res, next) => {
    if(req.carousal.image.data) {
        res.set('Content-Type', req.carousal.image.contentType)
        return res.send(req.carousal.image.data)
    }
    next();
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        let carousal = req.carousal
        carousal = _.extend(carousal, fields)
        // console.log("carousal ", carousal)
        if(files.image) { 
            if(files.image.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size."
                })
            }
            carousal.image.data = fs.readFileSync(files.image.path)
            carousal.image.contentType = files.image.type
        }


        carousal.save((err, image) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json({message: "Image updated successfully", image})
        })
        
    })
}



exports.remove = (req, res) => {
    let image = req.image
    image.remove((err, deletedImage) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            "message": "Image deleted successfully."
        })
    })
}
