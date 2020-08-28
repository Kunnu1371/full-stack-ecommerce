const Cateogry = require('../models/category')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.create = (req, res) => {
    const categoryName = req.body.name
    const category = new Cateogry(req.body)
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({data})
    })
}