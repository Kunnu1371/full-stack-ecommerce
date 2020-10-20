const Voucher = require('../models/voucher')
const subCategory = require('../models/subCategory')
exports.voucherById = (req, res, next, id) => {
    Voucher.findById(id).exec((err, voucher) => {
        if(err || !voucher) {
            res.status(400).json({
                error: "Voucher not found"
            })
        }
        req.voucher = voucher;
        next()
    })
}

exports.create = async (req, res) => {

    const { name, amount, id} = req.body
    if(!name || !amount || !id) {
        return res.json("All fields are required.")
    }
    // Here id is the _id of Category or subCategory for which the voucher is created.
    await subCategory.findById(id).exec((err, result) => {
        if(err) {
            return res.status(400).json({error: err})
        }
        if(result) {
            const voucherObj  = {
                name: req.body.name,
                // voucherCode: voucherCode,
                amount: req.body.amount,
                voucherCategory: req.body.id,
                expiryDate: Date.now() + 1000
            } 

            const voucher = new Voucher(voucherObj)
            voucher.save((err, createdVoucher) => {
                if(err) {
                    return res.status(400).json({error: err})
                }
                // console.log(createdVoucher)
                return res.json(createdVoucher)
            }) 
        }
        else{
            return res.status(400).json({ message: "Cannot create voucher as it's Sub-Category/Category doesn't exist"})
        }
    })
}

exports.read = (req, res) => {
    Voucher.findById(req.voucher.id)
           .populate('voucherCategory', '_id name category CategoryName')        
           .exec((err, voucher) => {
                if(err) return res.status(400).json(err)
                return res.json(voucher)
            })
}

exports.update = (req, res) => {
    Voucher.findByIdAndUpdate(
        {_id: req.voucher.id}, 
        {$set: req.body}, 
        {new: true},
    ).exec((err, updated) => {
        if(err) return res.status(400).json(err)
        return res.json({message: "Voucher updated successfully", updated})
    })
}


exports.remove = (req, res) => {
    const voucher = req.voucher
    voucher.remove((err, removed) => {
        if(err) return res.json(err)
        return res.json("Voucher deleted")
    }) 
}