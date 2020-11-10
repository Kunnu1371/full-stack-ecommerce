const express = require('express')
const router = express.Router()

const { requireSignin, isAdmin, isAuth } = require('../controllers/authAdmin');
const { create, read, update, remove} = require('../controllers/carousal')
const  { adminById }  = require('../controllers/admin')
const { carousalById } = require('../controllers/carousal')


router.get('/carousal/read/:carousalId', read)
router.post('/carousal/create/:adminId', requireSignin, isAdmin, isAuth, create);
router.put('/carousal/:carousalId/:adminId', requireSignin, isAdmin, isAuth, update)
router.delete('/carousal/:carousalId/:adminId', requireSignin, isAdmin, isAuth, remove);

router.param('adminId', adminById)
router.param('carousalId', carousalById)
module.exports = router;   