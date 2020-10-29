const express = require('express')
const router = express.Router()

const  { create, read, remove, update, productById, fetch, list, listRelated, listBySearch, photo, paginatedResults }  = require('../controllers/product');
const { requireSignin, isAdmin, isAuth } = require('../controllers/authAdmin');
const  { adminById }  = require('../controllers/admin')
const { subCategoryById } = require('../controllers/subCategory')
const Product = require('../models/product')

router.get('/product/:productId', read)
router.post('/product/create/:adminId', requireSignin, isAdmin, isAuth, create);
router.put('/product/update/:productId/:adminId', requireSignin, isAdmin, isAuth, update);
router.delete('/product/delete/:productId/:adminId', requireSignin, isAdmin, isAuth, remove)
// router.get('/products',paginatedResults(Product), list)
router.get('/products/related/:productId', listRelated)
router.post("/products/by/search", listBySearch);
router.get('/products/:subcategoryId', fetch)
router.get('/product/photo/:productId', photo)
router.get('/products', list)
router.get('/products', paginatedResults(Product), (req, res) => {
    res.json(res.paginatedResults)
  })
  
  
router.param('adminId', adminById)
router.param('productId', productById)
router.param('subcategoryId', subCategoryById)

module.exports = router;