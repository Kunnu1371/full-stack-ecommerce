const express = require('express')
const router = express.Router()

const  { create, read, update, remove, rootcategoryById, list, fetch }  = require('../controllers/rootCategory');
const { requireSignin, isAdmin, isAuth } = require('../controllers/authAdmin');
const  { adminById }  = require('../controllers/admin')

router.get('/rootcategory/:rootcategoryId', read)
router.post('/rootcategory/create/:adminId', requireSignin, isAdmin, isAuth, create);
router.put('/rootcategory/:rootcategoryId/update/:adminId', requireSignin, isAuth, isAdmin, update)
router.delete('/rootcategory/:rootcategoryId/delete/:adminId', requireSignin, isAdmin, isAuth, remove);
router.get('/rootcategories', list)
// It will fetch all categories related to the particular root category
router.get('/categories/:rootcategoryId', fetch);

router.param('adminId', adminById)
router.param('rootcategoryId', rootcategoryById)


module.exports = router;