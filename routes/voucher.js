const express = require('express')
const router = express.Router()

const { read, voucherById, create, update, remove } = require('../controllers/voucher')
const { adminById }  = require('../controllers/admin')
const { isAdmin, isAuth, requireSignin} = require('../controllers/authAdmin')

router.get('/voucher/:voucherId/:adminId', requireSignin, isAuth, isAdmin, read)
router.post('/voucher/create/:adminId', requireSignin, isAuth, isAdmin, create)
router.put('/voucher/:voucherId/:adminId/update', requireSignin, isAuth, isAdmin, update)
router.delete('/voucher/:voucherId/:adminId/remove', requireSignin, isAuth, isAdmin, remove)

router.param('voucherId', voucherById)
router.param('adminId', adminById)
module.exports = router;  