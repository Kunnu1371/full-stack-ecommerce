const expess = require('express')
const router = expess.Router()

const { cartById, addToCart, getCartItems, Increase, Decrease, deleteCartItems, getCartTotal, moveToWishlist, Update, deleteAllItems } = require('../controllers/cart')
const { productById } = require('../controllers/product')

router.get('/cart', getCartItems)
router.post('/cart/:productId/add-to-cart', addToCart)
router.post('/cart/:productId/update/increase', Increase)
router.post('/cart/:productId/update/decrease', Decrease)
router.put('/cart/:productId/update', Update)
router.delete('/cart/:productId/remove', deleteCartItems)
router.post('/cart/cartTotal', getCartTotal)
router.delete('/cart/remove', deleteAllItems)
router.post('/cart/:productId/move-to-wishlist', moveToWishlist)

router.param('productId', productById)
// router.param('cartId', cartById)
module.exports = router