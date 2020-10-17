const Order =  require('../models/order')
const Cart =  require('../models/cart')
const {errorHandler} = require('../helpers/dbErrorHandler')
const User = require('../models/user')

exports.orderById = (req, res, next, id) => {
    Order.findById(id)
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
        products: [],
        address: req.body.address,
    }
    order.user.salt = undefined
    order.user.hashed_Password = undefined

    let history = []
    Cart.find().exec(async (err, products) => { 
    if(err) {return res.json(err)}
    else {
        await products.map((products) => {
            // console.log(products)
            history.push(products)
            order.products.push(products)
        })
        // const test = "test"
        // console.log("history: ", history, "req.profile.history: ", req.profile.history)
        await User.findOneAndUpdate({_id: req.profile.id}, {$push:{ history: history}}, {new: true},(err, data) => {
            if(err){
                return res.status(400).json({
                    error: err
                })
            }
            console.log("Successfully pushed orders to user history", data, data.history.length, history)
        })
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
    .populate('user', 'name email role createdAt updatedAt')
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
    // console.log(req.order, req.order._id)
    Order.findById(req.order._id)
         .populate('user', 'name email role createdAt updatedAt')
         .populate(JSON.stringify(req.order.products[0].product))
         .exec((err, data) => {
             if(err) return res.status(400).json(err)
            // console.log(req.order.products.map((products) => {
            //     return products
            // }))
            // console.log(JSON.stringify(req.order.products))
             return res.json(data)
         })
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
