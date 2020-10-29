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
router.get('/products/related/:productId', listRelated)
router.post("/products/by/search", listBySearch);
router.get('/product/photo/:productId', photo)
router.get('/products', paginatedResults(Product))
  
router.param('adminId', adminById)
router.param('productId', productById)
router.param('subcategoryId', subCategoryById)

module.exports = router;