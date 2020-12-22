const { authenticateToken, generateJWTToken } = require('../../jwt-auth')
const usersService = require('../services/users')

class AuthRoute {
  constructor(router) {
    this.router = router
    this.registerRoutes()
  }

  registerRoutes() {
    this.router.post(
      '/v1/auth',
      this.login.bind(this)
    )
    this.router.post(
      '/v1/signup',
      this.addUser.bind(this)
    )
    this.router.get(
      '/v1/auth/logout',
      usersService.getSingleUser.bind(this)
    )
  }

  async login(req, res, next) {
    try {
      let user = await usersService.loginUser(req.body)
      req.cookies.token = generateJWTToken(user)
      user.password = undefined
      req.user = user
      res.send(user)
    } catch (error) {
      console.log(error);
      return next(error)
    }
  }

  async addUser(req, res, next) {
    try {
      let user = await usersService.addUser(req.body)
      req.cookies.token  = generateJWTToken(user)
      user.password = undefined
      req.user = user
      res.send(user)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = AuthRoute
