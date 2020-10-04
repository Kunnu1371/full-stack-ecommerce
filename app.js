require('dotenv').config();
const express = require('express')
const app = express()
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const subCategoryRoutes = require('./routes/subCategory')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const carousalRoutes = require('./routes/carousal')

// Middlewares
require('./Middlewares/middleware')

// Routes
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', subCategoryRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)
app.use('/api', carousalRoutes)


app.listen(3000, () => {
    console.log(`Server started on port 3000`)
})
require('./config/dbConnection')  