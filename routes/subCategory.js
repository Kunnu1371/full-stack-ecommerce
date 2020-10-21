const express = require('express')
const router = express.Router()

const  { create, read, update, remove, subCategoryById, list, fetch }  = require('../controllers/subCategory');
const { requireSignin, isAdmin, isAuth } = require('../controllers/authAdmin');
const  { adminById }  = require('../controllers/admin')

router.get('/sub-category/:subCategoryId', read)
router.post('/sub-category/create/:adminId', requireSignin, isAdmin, isAuth, create);
router.put('/sub-category/:subCategoryId/:adminId', requireSignin, isAdmin, isAuth, update);
router.delete('/sub-category/:subCategoryId/:adminId', requireSignin, isAdmin, isAuth, remove);
router.get('/sub-categories', list)
// router.get('/fetch/sub-category/:subCategoryId', fetch);


router.param('adminId', adminById)
router.param('subCategoryId', subCategoryById)


module.exports = router; 