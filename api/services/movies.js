const mongoose = require('mongoose')

const Movie = require('../models/Movie')
const ObjectID = mongoose.Types.ObjectId
const parse = require('../helpers/parse')
const BaseController = require('../helpers/base')

class MoviesService extends BaseController {
  constructor() {
    super(Movie)
  }
  getMovies(params = {}) {
    const limit = parse.getNumberIfPositive(params.limit) || 1000
    const offset = parse.getNumberIfPositive(params.offset) || 0

    return this.getAll(offset, limit).then(async data => {
      return await Promise.all(data.map(async movie => await this.changeProperties(movie)))
    })
  }

  async getSingleMovie(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier')
    }
    const movie = await this.get(id)
    if (movie) return this.changeProperties(movie)
    return {}
  }

  async addMovie(data) {
    try {
      const movie = this.getValidDocumentForInsert(data)

      const movieCreated = await this.create(movie)
      const newMovieId = movieCreated._id.toString()
      const newMovie = await this.getSingleMovie(newMovieId)
      return newMovie
    } catch (error) {
      console.log('addMovie', error)
    }
  }

  async deleteMovie(movieId) {
    if (!ObjectID.isValid(movieId)) {
      return Promise.reject('Invalid identifier')
    }

    await this.delete(movieId)
  }

  getValidDocumentForInsert(data) {
    const movie = {
      created: new Date(),
      updated: null
    }

    movie.userCreated = parse.getObjectIDIfValid(data.userCreated)
    movie.title = parse.getString(data.title)
    movie.description = parse.getString(data.description)
    movie.likeCount = 0
    movie.disLikeCount = 0

    return movie
  }

  getValidDocumentForUpdate(id, data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing')
    }

    const movie = {
      updated: new Date()
    }

    if (data.likeCount !== undefined)  {
      movie.likeCount = parse.getNumberIfPositive(data.likeCount)
    }

    if (data.disLikeCount !== undefined) {
      movie.disLikeCount = parse.getNumberIfPositive(data.disLikeCount)
    }

    return movie
  }

  async changeProperties(movie) {
    if (movie) {
      movie = JSON.parse(JSON.stringify(movie))
      movie.userCreated = (await require('./users').getSingleUser(movie.userCreated)) || {}
      movie.id = movie._id.toString()
      delete movie._id
      delete movie.__v
    }

    return movie
  }
}

module.exports = new MoviesService()
