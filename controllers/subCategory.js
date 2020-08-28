const subCateogry = require('../models/subCategory')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.create = (req, res) => {
    // console.log(req.body)
    const subCategory = new subCateogry(req.body)
    subCategory.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({data})
    })
}