const Cart = require('../models/cart')

// exports.cartById = (req, res, next, id) => {
//     Cart.findById(id).exec((err, cart) => {
//         if(err || !cart) {
//             return res.status(400).json({
//                 error: 'Product not found in cart'
//             })
//         }
//         req.cart = cart;
//         console.log(cart, cart.product)
//         next();
//     })
// }

exports.addToCart = async (req, res) => {
    const productId = req.params.productId

    // check product exist or already added in cart or not
    const productInCart = await Cart.findOne({product: productId})
    if(productInCart) {
        // If product is already added in cart, update the quantity
        Cart.findOneAndUpdate({_id: productInCart._id}, {$inc: {Quantity: 1}}, {new: true }, function(err, data) {
            if(err) return res.status(400).json(err)
            return res.status(200).json({msg: "Product is already in Cart. Successfully updated quantity", data})
        })
    } 

    else {
        // If product is not added in cart, then add it to cart
        const product = new Cart({product: productId})
        await product.save((err, addedProduct) => {
           if(err) return res.status(400).json(err)
           return res.status(201).json({msg: "Product successfully added to cart", addedProduct})
       })
    }
}

exports.getCartItems = async (req, res) => {
    await Cart.find()
        .populate("product")
        .exec((err, data) => {
        if(err) return res.status(400).json(err)
        return res.status(200).json({Items: data.length, data})
    })
}

// Increase quantity of an Item in cart
exports.Increase = async (req, res) => {
    const productId = req.params.productId
    // check product exist or already added in cart or not
    const productInCart = await Cart.findOne({product: productId})
    // console.log(productId, productInCart)

    if(productInCart) {
        // If product is already added in cart, update the quantity
        Cart.findOneAndUpdate({_id: productInCart._id}, {$inc: {Quantity: 1}}, {new: true }, function(err, data) {
            if(err) return res.status(400).json(err)
            return res.status(200).json({msg: "Successfully updated quantity", data})
        })
    } 

    else {
        console.log(productId, productInCart)
        return res.json("product not present in cart")
    }
} 


exports.Decrease = async (req, res) => {
    const productId = req.params.productId
    // check product exist or already added in cart or not
    const productInCart = await Cart.findOne({product: productId})
    // console.log(productId, productInCart)

    if(productInCart) {
        // If product is already added in cart, update the quantity
        if(productInCart.Quantity <= 1) {
            productInCart.remove((err, data) => {
                if(err) return res.json(err)
                return res.json("Product removed successfully from cart")
            })
        }

        else {
            Cart.findOneAndUpdate({_id: productInCart._id}, {$inc: {Quantity: -1}}, {new: true }, function(err, data) {
                if(err) return res.status(400).json(err)
                return res.status(200).json({msg: "Successfully updated quantity", data})
            })
        }
    } 

    else {
        return res.json("product not present in cart")
    }
}


// exports.deleteCartItems = (req, res) => {
//     const cart =  req.cart
//     cart.remove((err, data) => {
//         if(err) return res.json(err)
//         return res.json("Product removed successfully from cart")
//     }) 
// }


exports.deleteCartItems = async (req, res) => {
    const productId = req.params.productId
    const productInCart = await Cart.findOne({product: productId})

    if(productInCart) {
        productInCart.remove((err, data) => {
            if(err) return res.json(err)
            return res.json("Product removed successfully from cart")
        })
    }
    else {
        return res.json("Product not present in cart")
    }
}