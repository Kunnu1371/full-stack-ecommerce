const express = require('express')
const router = express.Router()

const { read, voucherById, VoucherGenerator } = require('../controllers/voucher')
const { adminById }  = require('../controllers/admin')
const { isAdmin, isAuth, requireSignin} = require('../controllers/authAdmin')
router.post('/voucher/create/:adminId', requireSignin, isAdmin, isAuth, VoucherGenerator)
router.get('/voucher/:voucherId', read)

router.param('voucherId', voucherById)
router.param('adminId', adminById)
module.exports = router;  