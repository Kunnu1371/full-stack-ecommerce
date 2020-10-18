const express = require('express')
const router = express.Router()

const  { requireSignin, isAuth, isAdmin}  = require('../controllers/auth')
const  { userById }  = require('../controllers/user')
const  { create, listOrders, updateOrderStatus, orderById, getOrderDetail }  = require('../controllers/order')
const { decreaseQuantity } = require('../controllers/product')

router.post('/order/create/:userId', requireSignin, isAuth, create)
router.get('/order/list/:userId', requireSignin, isAuth, listOrders)
router.get('/order/:orderId/:userId', requireSignin, isAuth, getOrderDetail)
router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus)

router.param('userId', userById)
router.param('orderId', orderById)

module.exports = router;