const subCateogry = require('../models/product')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.create = (req, res) => {
    // console.log(req.body)
    const product = new subCateogry(req.body)
    product.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({data})
    })
}