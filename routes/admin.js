const express = require('express')
const router = express.Router()
const  { requireSignin, isAdmin, isAuth}  = require('../controllers/authAdmin')
const  { adminById, read, update }  = require('../controllers/admin')
const { userById, purchaseHistory } = require('../controllers/user')

router.get('/secret/:adminId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
})
router.get('/admin/:adminId', requireSignin, isAuth, isAdmin, read)
router.put('/admin/:adminId', requireSignin, isAuth, isAdmin, update)
router.get('/order/by/user/:userId', requireSignin, isAdmin, purchaseHistory)

router.param('userId', userById)
router.param('adminId', adminById)

module.exports = router;