const Voucher = require('../models/voucher')
const RootCategory = require('../models/rootCategory')
exports.voucherById = (req, res, next, id) => {
    Voucher.findById(id).exec((err, voucher) => {
        if(err || !voucher) {
            res.status(404).json({
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
        return res.status(400).json("All fields are required.")
    }
    // Here id is the _id of Category or subCategory for which the voucher is created.
    await RootCategory.findById(id).exec((err, result) => {
        if(err) {return res.status(500).json({error: err})}
        if(result) {
            const voucherObj  = {
                name: req.body.name,
                amount: req.body.amount,
                rootcategory: req.body.id,
                expiryDate: Date.now() + 1000
            } 

            const voucher = new Voucher(voucherObj)
            voucher.save((err, createdVoucher) => {
                if(err) {
                    return res.status(500).json({error: err})
                }
                // console.log(createdVoucher)
                return res.status(201).json({
                    status: "success",
                    message: "voucher created successfully",
                    createdVoucher
                })
            }) 
        }
        else{
            return res.status(404).json({message: "Cannot create voucher because Root Category doesn't exist"})
        }
    })
}

exports.read = (req, res) => {
    Voucher.findById(req.voucher.id)
           .populate('rootcategory', '_id name')        
           .exec((err, voucher) => {
                if(err) return res.status(400).json(err)
                return res.status(200).json({
                    status: "success",
                    voucher
                })
            })
}

exports.update = (req, res) => {
    Voucher.findByIdAndUpdate(
        {_id: req.voucher.id}, 
        {$set: req.body}, 
        {new: true},
    ).exec((err, updated) => {
        if(err) return res.status(500).json(err)
        return res.status(200).json({
            status: "success",
            message: "Voucher updated successfully", 
            updated
        })
    })
}


exports.remove = (req, res) => {
    const voucher = req.voucher
    voucher.remove((err, removed) => {
        if(err) return res.status(500).json(err)
        return res.status(200).json({
            status: "success",
            message: "Voucher deleted successfully"
        })
    }) 
}