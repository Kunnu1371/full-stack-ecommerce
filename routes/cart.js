const expess = require('express')
const router = expess.Router()

const { cartById, addToCart, getCartItems, Increase, Decrease, deleteCartItems, getCartTotal } = require('../controllers/cart')
const { productById } = require('../controllers/product')
router.get('/cart', getCartItems)
router.post('/cart/:productId/add-to-cart', addToCart)
router.post('/cart/cartTotal', getCartTotal)
router.post('/cart/:productId/update/increase', Increase)
router.post('/cart/:productId/update/decrease', Decrease)
// router.delete('/cart/:cartId/remove', deleteCartItems)
router.delete('/cart/:productId/remove', deleteCartItems)

router.param('productId', productById)
// router.param('cartId', cartById)
module.exports = router