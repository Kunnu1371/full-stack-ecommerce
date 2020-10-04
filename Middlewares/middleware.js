const express = require('express')
const app = express()
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