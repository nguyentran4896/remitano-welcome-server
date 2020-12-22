const express = require('express')
const usersRoute = require('./routes/users')
const moviesRoute = require('./routes/movies')

const apiRouter = express.Router()

new usersRoute(apiRouter)
new moviesRoute(apiRouter)

module.exports = apiRouter
