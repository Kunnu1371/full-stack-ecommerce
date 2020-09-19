const express = require('express')
const router = express.Router()

const  { create, read, update, remove, subCategoryById, list, fetch }  = require('../controllers/subCategory');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const  { userById }  = require('../controllers/user')

router.get('/sub-category/:subCategoryId', read)
router.post('/sub-category/create/:userId', requireSignin, isAdmin, isAuth, create);
router.put('/sub-category/:subCategoryId/:userId', requireSignin, isAdmin, isAuth, update);
router.delete('/sub-category/:subCategoryId/:userId', requireSignin, isAdmin, isAuth, remove);
router.get('/sub-categories', list)
// router.get('/fetch/sub-category/:subCategoryId', fetch);


router.param('userId', userById)
router.param('subCategoryId', subCategoryById)


module.exports = router;