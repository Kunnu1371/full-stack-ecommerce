const expess = require('express')
const router = expess.Router()

const { addToWishlist, getWishlistItems, deleteWishlistItems, moveToCart } = require('../controllers/wishlist')
const { productById } = require('../controllers/product')

router.get('/wishlist', getWishlistItems)
router.post('/wishlist/:productId/add-to-wishlist', addToWishlist)
router.post('/wishlist/:productId/move-to-cart', moveToCart)
router.delete('/wishlist/:productId/remove', deleteWishlistItems)

router.param('productId', productById)
module.exports = router