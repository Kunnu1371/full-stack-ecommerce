const express = require('express')
const router = express.Router()

const  { create, read, update, remove, categoryById, list, fetch }  = require('../controllers/category');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const  { userById }  = require('../controllers/user')

router.get('/category/:categoryId', read)
router.post('/category/create/:userId', requireSignin, isAdmin, isAuth, create);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update)
router.delete('/category/:categoryId/:userId', requireSignin, isAdmin, isAuth, remove);
router.get('/categories', list)
router.get('/fetch/category/:categoryId', fetch);

router.param('userId', userById)
router.param('categoryId', categoryById)


module.exports = router;