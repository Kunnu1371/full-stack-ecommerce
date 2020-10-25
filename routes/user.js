const express = require('express')
const router = express.Router()
const  { requireSignin, isAuth }  = require('../controllers/authUser')
const  { userById, read, update }  = require('../controllers/user')
const { OrderHistory } = require('../controllers/order')

router.get('/secret/:userId', requireSignin, isAuth, (req, res) => {
    res.json({
        user: req.profile
    })
})
router.get('/user/:userId', requireSignin, isAuth, read)
router.put('/user/:userId', requireSignin, isAuth, update)
router.get('/order/list/:userId', requireSignin, isAuth, OrderHistory)

router.param('userId', userById)

module.exports = router;