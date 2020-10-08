const Voucher = require('../models/voucher')
const subCategory = require('../models/subCategory')
exports.voucherById = (req, res, next, id) => {
    Voucher.findById(id).exec((err, voucher) => {
        if(err || !voucher) {
            res.status(400).json({
                error: "Invalid voucher Or Voucher not found in databse"
            })
        }
        req.voucher = voucher;
        next()
    })
}

exports.VoucherGenerator = async (req, res) => {
    const id = req.body.id;
    console.log(id)
    // Here id is the _id of Category or subCategory for which the voucher is created.
    await subCategory.findById(id).exec((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        if(result) {
            const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
            const length = req.body.length;
            let voucherCode = '';
        
            for(let i = 0; i < length; i++) {
                voucherCode += possible.charAt(Math.floor((Math.random() * possible.length)))
            }    
        
            const voucherObj  = {
                voucherCode: voucherCode,
                amount: req.body.amount,
                voucherCategory: req.body.id,
                expiryDate: Date.now() + 1000
            } 

            const voucher = new Voucher(voucherObj)

            voucher.save((err, createdVoucher) => {
                if(err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                console.log(createdVoucher)
                return res.json(createdVoucher)
            }) 
        }
        else{
            return res.status(400).json({ message: "Cannot create voucher as it's Sub-Category/Category doesn't exist"})
        }
    })
}

exports.read = (req, res) => {
    return res.json(req.voucher)
}

exports.voucherVerification = (req, res) => {
    let voucher = req.body.voucher
    

}  