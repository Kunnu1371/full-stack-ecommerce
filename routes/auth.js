const express = require('express')
const router = express.Router()
const  {signup, signin, signout, requireSignin}  = require('../controllers/auth')
const {userSignupValidator} = require('../validator')
router.post('/user/signup', userSignupValidator, signup);
router.post('/user/signin', signin);
router.get('/user/signout', signout);

router.get('/hello', requireSignin,  (req, res) => {
    res.send("Hello there")
});
  
module.exports = router;