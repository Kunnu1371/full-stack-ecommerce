const express = require('express')
const router = express.Router()

const  { create, read, remove, update, productById }  = require('../controllers/product');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const  { userById }  = require('../controllers/user')

router.get('/product/:productId', read)
router.post('/product/create/:userId', requireSignin, isAdmin, isAuth, create);
router.put('/product/:productId/:userId', requireSignin, isAdmin, isAuth, update);
router.delete('/product/:productId/:userId', requireSignin, isAdmin, isAuth, remove)

router.param('userId', userById)
router.param('productId', productById)

module.exports = router;