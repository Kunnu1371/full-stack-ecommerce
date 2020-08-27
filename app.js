const express = require('express')
const app = express()
const morgran = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
require('dotenv').config();
const authRoutes = require('./routes/auth')

app.use(morgran('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(expressValidator());

app.use('/api', authRoutes)

app.listen(3000, () => {
    console.log(`Server started on port 3000`)
})
require('./config/dbConnection')  