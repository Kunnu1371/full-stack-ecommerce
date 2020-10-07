const express = require('express')
const router = express.Router()
const  { requireSignin, isAdmin, isAuth}  = require('../controllers/auth')
const  { adminById, read, update, purchaseHistory }  = require('../controllers/admin')

router.get('/secret/:adminId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
})
router.get('/admin/:adminId', requireSignin, isAuth, isAdmin, read)
router.put('/admin/:adminId', requireSignin, isAuth, isAdmin, update)
router.get('/order/by/admin/:adminId', requireSignin, isAuth, isAdmin, purchaseHistory)


router.param('adminId', adminById)

module.exports = router;