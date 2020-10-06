const express = require('express')
const router = express.Router()

const  { create, read, remove, update, productById, list, listRelated, listBySearch, photo, paginatedResults }  = require('../controllers/product');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const  { userById }  = require('../controllers/user')
const Product = require('../models/product')
router.get('/product/:productId', read)
router.post('/product/create/:userId', requireSignin, isAdmin, isAuth, create);
router.put('/product/:productId/:userId', requireSignin, isAdmin, isAuth, update);
router.delete('/product/:productId/:userId', requireSignin, isAdmin, isAuth, remove)
// router.get('/products',paginatedResults(Product), list)
router.get('/products/related/:productId', listRelated)
router.post("/products/by/search", listBySearch);
router.get('/product/photo/:productId', photo)

router.get('/products', paginatedResults(Product), (req, res) => {
    res.json(res.paginatedResults)
  })

  
router.param('userId', userById)
router.param('productId', productById)

module.exports = router;