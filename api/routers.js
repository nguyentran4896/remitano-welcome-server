const express = require('express')
const usersRoute = require('./routes/users')
const moviesRoute = require('./routes/movies')
const authRoute = require('./routes/auth')

const apiRouter = express.Router()

new usersRoute(apiRouter)
new moviesRoute(apiRouter)
new authRoute(apiRouter)


module.exports = apiRouter
