const mongoose = require('mongoose')

const Movie = require('../models/Movie')
const ObjectID = mongoose.Types.ObjectId
const parse = require('../helpers/parse')
const BaseController = require('../helpers/base')
const getVideoDetail = require('./youtube-api').getVideoDetail

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

  countMovies() {
    return this.countDocuments().then(data => {
      return data
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
      const movie = await this.getValidDocumentForInsert(data)

      const movieCreated = await this.create(movie)
      const newMovieId = movieCreated._id.toString()
      const newMovie = await this.getSingleMovie(newMovieId)
      return newMovie
    } catch (error) {
      console.log('addMovie', error)
      throw error
    }
  }

  async updateMovie(id, data) {
    try {

      let movie = await this.get(id)
      if (!movie) throw ({ status: 404, message: 'Movie not found!' })

      movie = await this.getValidDocumentForUpdate(data)

      const movieUpdated = await this.findAndUpdate(id, movie)

      const newMovieId = movieUpdated._id.toString()
      const newMovie = await this.getSingleMovie(newMovieId)
      console.log(newMovie);
      return newMovie
    } catch (error) {
      console.log('addMovie', error)
      throw error
    }
  }

  async deleteMovie(movieId) {
    if (!ObjectID.isValid(movieId)) {
      return Promise.reject('Invalid identifier')
    }

    await this.delete(movieId)
  }

  async getValidDocumentForInsert(data) {
    try {
      const movie = {
        date: new Date()
      }

      const youtubeUrl = parse.getString(data.url)
      const videoDetail = await getVideoDetail(parse.getYoutubeIdFromUrl(youtubeUrl))
      if (!videoDetail) throw { status: 404, message: 'Youtube video URL not found!' }

      movie.userCreated = parse.getObjectIDIfValid(data._id)
      movie.title = videoDetail.snippet.title || ''
      movie.description = videoDetail.snippet.description || ''
      movie.likeCount = 0
      movie.disLikeCount = 0
      movie.url = youtubeUrl

      return movie
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  getValidDocumentForUpdate(data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing')
    }

    const movie = {
      updated: new Date()
    }

    if (data.likes) {
      movie.likes = data.likes
    }

    if (data.disLikes) {
      movie.disLikes= data.disLikes
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
