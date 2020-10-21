const Order =  require('../models/order')
const Cart =  require('../models/cart')
const {errorHandler} = require('../helpers/dbErrorHandler')
const User = require('../models/user')

exports.orderById = (req, res, next, id) => {
    Order.findById(id)
    .exec((err, order) => {
        if(err || !order) {
            return res.status(400).json({
                error: "Order Not found"
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
    if(err) { return res.json(err) }
    else {
        await products.map((products) => {
            history.push(products)
            order.products.push(products)
        })
        const orderCreated = new Order(order) 
        await orderCreated.save(async (err, order) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
     
        User.findOneAndUpdate({_id: req.profile.id}, {$push: {history: order._id}}, {new: true},  (err, data) => {
            if(err) {res.status(400).json(err)}
            // return res.status(201).json(data)
        })
        order.user.history = undefined
        return res.status(201).json(order)
    })
    }
})
}


exports.listOrders = (req, res) => {
    Order.find({user: req.params.userId})
    .sort('-created')
    .exec((err, order) => {
        if(err) {
            return res.status(400).json({
                error: "Coudnot find order"
            })
        }
        return res.status(200).json({Orders: order.length, order})
    }) 
}

exports.getOrderDetail = (req, res) => {
    // console.log(req.order, req.order._id)
    Order.findById(req.order._id)
         .populate('user', 'name email role createdAt updatedAt')
         .exec((err, data) => {
             if(err) return res.status(400).json(err)
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
                    res.json({message: "Status changed successfully", order})
                })
}

exports.TotalOrders = async (req, res) => {
    const ordersTillNow = await Order.countDocuments()
    var start = new Date();
    start.setHours(0,0,0,0);
    var end = new Date();
    end.setHours(23,59,59,999);
    const ordersToday = await Order.find( {createdAt: { "$gte": start, "$lt": end }}).countDocuments()
    const Pending = await Order.find({status: "Pending"}).countDocuments()
    const Confirmed = await Order.find({status: "Confirmed"}).countDocuments()
    const Placed = await Order.find({status: "Placed"}).countDocuments()
    const NotProcessed = await Order.find({status: "Not Processed"}).countDocuments()
    const Processing = await Order.find({status: "Processing"}).countDocuments()
    const Shipped = await Order.find({status: "Shipped"}).countDocuments()
    const Delivered = await Order.find({status: "Delivered"}).countDocuments()
    const Cancelled = await Order.find({status: "Cancelled"}).countDocuments()

    const orders = {
        TotalOrders: ordersTillNow, 
        TotalOrderToday: ordersToday,
        Pending: Pending,
        Confirmed: Confirmed,
        Placed: Placed,
        NotProcessed: NotProcessed,
        Processing: Processing,
        Shipped: Shipped,
        Delivered: Delivered,
        Cancelled: Cancelled
    }
    res.status(200).json(orders)
}

exports.TotalUsers = async (req, res) => {
    const users = await User.countDocuments()
    res.json({TotalUsers: users})
}