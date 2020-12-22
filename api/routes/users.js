const UsersService = require('../services/users')

class UsersRoute {
  constructor (router) {
    this.router = router
    this.registerRoutes()
  }

  registerRoutes () {
    this.router.get(
      '/v1/users',
      this.getUsers.bind(this)
    )
    this.router.post(
      '/v1/users',
      this.addUser.bind(this)
    )
    this.router.get(
      '/v1/users/:id',
      this.getSingleUser.bind(this)
    )
    this.router.put(
      '/v1/users/:id',
      this.updateUser.bind(this)
    )
    this.router.delete(
      '/v1/users/:id',
      this.deleteUser.bind(this)
    )
  }

  getUsers (req, res, next) {
    UsersService.getUsers(req.query)
      .then(data => {
        res.send(data)
      })
      .catch(next)
  }

  getSingleUser (req, res, next) {
    UsersService.getSingleUser(req.params.id)
      .then(data => {
        if (data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(next)
  }

  addUser (req, res, next) {
    UsersService.addUser(req.body)
      .then(data => {
        res.send(data)
      })
      .catch(next)
  }

  updateUser (req, res, next) {
    UsersService.updateUser(req.params.id, req.body)
      .then(data => {
        if (data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(next)
  }

  deleteUser (req, res, next) {
    UsersService.deleteUser(req.params.id)
      .then(data => {
        res.status(data ? 200 : 404).end()
      })
      .catch(next)
  }
}

module.exports = UsersRoute
