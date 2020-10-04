const express = require('express')
const router = express.Router()

const  { requireSignin, isAuth, isAdmin}  = require('../controllers/auth')
const  { userById, addOrderHistory }  = require('../controllers/user')
const  { create, listOrders, getOrderStatus, updateOrderStatus, orderById }  = require('../controllers/order')
const { decreaseQuantity } = require('../controllers/product')

router.post('/order/create/:userId', requireSignin, isAuth, addOrderHistory, decreaseQuantity, create)
router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders)
router.put('/order/:orderId/:userId', requireSignin, isAuth, isAdmin, getOrderStatus)
router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus)

router.param('userId', userById)
router.param('orderId', orderById)

module.exports = router;