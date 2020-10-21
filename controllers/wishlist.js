const Cart = require('../models/cart')
const Wishlist = require('../models/wishlist')

exports.addToWishlist = async (req, res) => {
    const productId = req.params.productId

    // check product exist or already added in wishlist or not
    const productInCart = await Wishlist.findOne({product: productId})
    if(productInCart) {
        // If product is already added in wishlist, gives the message
        return res.status(200).json("Product is already in wishlist.")
    } 

    else {
        // If product is not added in cart, then add it to cart
        const product = new Wishlist({product: productId})
        await product.save((err, addedProduct) => {
           if(err) return res.status(400).json(err)
           return res.status(201).json({msg: "Added to wishlist", addedProduct})
       })
    }
}


exports.getWishlistItems = async (req, res) => {
    await Wishlist.find()
        .populate("product")
        .exec((err, data) => {
        if(err) return res.status(400).json(err)
        return res.status(200).json({Items: data.length, data})
    })
}


exports.deleteWishlistItems = async (req, res) => {
    const productId = req.params.productId
    const productInWishlist = await Wishlist.findOne({product: productId})

    if(productInWishlist) {
        productInWishlist.remove((err, data) => {
            if(err) return res.json(err)
            return res.json("Product removed from wishlist")
        })
    }
    else {
        return res.json("Product not present in wishlist")
    }
}


exports.moveToCart = async (req, res) => {

    // how move the product from wishlist to cart is working => first delete the product from wishlist then add the same product in cart.

    const product = req.params.productId
    const productInWishlist = await Wishlist.findOne({product: product})
    await productInWishlist.remove((err, data) => {
        if(err) return res.json(err)
    }) 

    const newProduct = new Cart({product: product})
    await newProduct.save((err, savedProduct) => {
        if(err) res.status(500).json(err)
        return res.status(200).json("Product moved to cart")
    })
}
