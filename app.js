require('dotenv').config();
const express = require('express')
const app = express()
const authRoutes = require('./routes/auth')
const authAdminRoutes = require('./routes/authAdmin')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const categoryRoutes = require('./routes/category')
const subCategoryRoutes = require('./routes/subCategory')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const carousalRoutes = require('./routes/carousal')

// importing Middlewares
const morgran = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')

// Middlewares
app.use(morgran('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(expressValidator());

// Routes
app.use('/api', authRoutes)
app.use('/api', authAdminRoutes)
app.use('/api', userRoutes)
app.use('/api', adminRoutes)
app.use('/api', categoryRoutes)
app.use('/api', subCategoryRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)
app.use('/api', carousalRoutes)


app.listen(3000, () => {
    console.log(`Server started on port 3000`)
})
require('./config/dbConnection')  