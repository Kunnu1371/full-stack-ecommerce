const Order =  require('../models/order')
const Cart =  require('../models/cart')
const {errorHandler} = require('../helpers/dbErrorHandler')

exports.orderById = (req, res, next, id) => {
    Order.findById(id)
    // .populate('products.product', 'name price')
    .exec((err, order) => {
        if(err || !order) {
            return res.status(400).json({
                error: "Not found"
            })
        }
        // console.log(order)
        req.order = order
        next()
    })
}


exports.create = (req, res) => {

    const order = {
        user: req.profile,
        product: [],
        address: req.body.address,
    }
    order.user.salt = undefined
    order.user.hashed_Password = undefined

    Cart.find().exec(async (err, products) => { 
    if(err) {return res.json(err)}
    else {
        await products.map((product) => {
            order.product.push(product)
        })
        // console.log(order)
        const orderCreated = new Order(order) 
        orderCreated.save((err, data) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
           return res.json(data)
        })
    }
}); 
}
 

exports.listOrders = (req, res) => {
    Order.find()
    .populate('user')
    .sort('-created')
    .exec((err, order) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({Orders: order.length, order})
    })
}

exports.getOrderDetail = (req, res) => {
    res.json(req.order)
}


exports.updateOrderStatus = async (req, res) => {
    await Order.findOneAndUpdate({_id: req.order._id}, 
                { $set: {status: req.body.status}},
                (err, order) => {
                    if(err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json(order)
                })
}
