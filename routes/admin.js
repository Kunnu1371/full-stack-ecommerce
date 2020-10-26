const express = require('express')
const router = express.Router()

const  { requireSignin, isAdmin, isAuth}  = require('../controllers/authAdmin')
const  { adminById, read, update, removeUser, removeAdmin }  = require('../controllers/admin')
const { userById, purchaseHistory } = require('../controllers/user')


router.get('/admin/:adminId', requireSignin, isAuth, isAdmin, read)
router.put('/admin/:adminId', requireSignin, isAuth, isAdmin, update)
router.delete('/user/remove/:adminId', requireSignin, isAuth, isAdmin, removeUser)
router.delete('/admin/remove/:adminId', requireSignin, isAuth, isAdmin, removeAdmin)
router.get('/order/by/user/:userId', requireSignin, isAdmin, purchaseHistory)

router.param('userId', userById)
router.param('adminId', adminById)

module.exports = router;