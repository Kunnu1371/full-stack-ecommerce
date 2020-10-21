const express = require('express')
const router = express.Router()

const  { create, read, update, remove, categoryById, list, fetch }  = require('../controllers/category');
const { requireSignin, isAdmin, isAuth } = require('../controllers/authAdmin');
const  { adminById }  = require('../controllers/admin')

router.get('/category/:categoryId', read)
router.post('/category/create/:adminId', requireSignin, isAdmin, isAuth, create);
router.put('/category/:categoryId/:adminId', requireSignin, isAuth, isAdmin, update)
router.delete('/category/:categoryId/:adminId', requireSignin, isAdmin, isAuth, remove);
router.get('/categories', list)
router.get('/fetch/category/:categoryId', fetch);

router.param('adminId', adminById)
router.param('categoryId', categoryById)


module.exports = router;