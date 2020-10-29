const express = require('express')
const router = express.Router()

const  { create, read, update, remove, subCategoryById, list, fetch }  = require('../controllers/subCategory');
const { requireSignin, isAdmin, isAuth } = require('../controllers/authAdmin');
const  { adminById }  = require('../controllers/admin')

router.get('/subcategory/:subCategoryId', read)
router.post('/subcategory/create/:adminId', requireSignin, isAdmin, isAuth, create);
router.put('/subcategory/update/:subCategoryId/:adminId', requireSignin, isAdmin, isAuth, update);
router.delete('/subcategory/delete/:subCategoryId/:adminId', requireSignin, isAdmin, isAuth, remove);
router.get('/subcategories', list)
// router.get('/fetch/subcategory/:subCategoryId', fetch);


router.param('adminId', adminById)
router.param('subCategoryId', subCategoryById)


module.exports = router; 