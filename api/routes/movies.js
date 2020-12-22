const MoviesService = require('../services/movies')
const authenticateToken = require('../../jwt-auth').authenticateToken

class MoviesRoute {
  constructor (router) {
    this.router = router
    this.registerRoutes()
  }

  registerRoutes () {
    this.router.get(
      '/v1/movies',
      this.getMovies.bind(this)
    )
    this.router.post(
      '/v1/movies',
      authenticateToken,
      this.addMovie.bind(this)
    )
    this.router.get(
      '/v1/movies/:id',
      this.getSingleMovie.bind(this)
    )
    this.router.put(
      '/v1/movies/:id',
      authenticateToken,
      this.updateMovie.bind(this)
    )
    this.router.delete(
      '/v1/movies/:id',
      authenticateToken,
      this.deleteMovie.bind(this)
    )
  }

  getMovies (req, res, next) {
    MoviesService.getMovies(req.query)
      .then(data => {
        res.send(data)
      })
      .catch(next)
  }

  getSingleMovie (req, res, next) {
    MoviesService.getSingleMovie(req.params.id)
      .then(data => {
        if (data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(next)
  }

  addMovie (req, res, next) {
    let data = { ...req.body, ...req.user}
    MoviesService.addMovie(data)
      .then(data => {
        res.send(data)
      })
      .catch(next)
  }

  updateMovie (req, res, next) {
    MoviesService.updateMovie(req.params.id, req.body)
      .then(data => {
        if (data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(next)
  }

  deleteMovie (req, res, next) {
    MoviesService.deleteMovie(req.params.id)
      .then(data => {
        res.status(data ? 200 : 404).end()
      })
      .catch(next)
  }
}

module.exports = MoviesRoute
