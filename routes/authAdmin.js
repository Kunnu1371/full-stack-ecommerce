const express = require('express')
const router = express.Router()
const  {signup, signin, signout}  = require('../controllers/authAdmin')
const {userSignupValidator} = require('../validator')
router.post('/admin/signup', userSignupValidator, signup);
router.post('/admin/signin', signin);
router.get('/admin/signout', signout);

module.exports = router;