const express = require('express')
const router = express.Router()

const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const { create, read, update, remove} = require('../controllers/carousal')
const  { userById }  = require('../controllers/user')
const { carousalById } = require('../controllers/carousal')


router.post('/carousal/create/:userId', requireSignin, isAdmin, isAuth, create);
router.get('/carousal/read/:carousalId', read)
router.put('/carousal/:carousalId/:userId', requireSignin, isAuth, isAdmin, update)
router.delete('/carousal/:carousalId/:userId', requireSignin, isAdmin, isAuth, remove);

router.param('userId', userById)
router.param('carousalId', carousalById)
module.exports = router;   