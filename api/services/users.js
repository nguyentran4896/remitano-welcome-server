const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('User')
const ObjectID = mongoose.Types.ObjectId
const parse = require('../helpers/parse')
const BaseController = require('../helpers/base')

class UsersService extends BaseController {
  constructor() {
    super(User)
  }
  getUsers(params = {}) {
    const limit = parse.getNumberIfPositive(params.limit) || 1000
    const offset = parse.getNumberIfPositive(params.offset) || 0

    return this.getAll(offset, limit).then(data => {
      return data.map(user => this.changeProperties(user))
    })
  }

  async getSingleUser(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier')
    }
    const user = await this.get(id)
    if (user) return this.changeProperties(user)
    return {}
  }

  async loginUser(data) {
    try {
      let user = await this.findOne(data)
      if (!user) throw ({ status: 404, message: 'Email Not Found!' })
      return await user.comparePassword(data.password)
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async addUser(data) {
    try {
      const user = this.getValidDocumentForInsert(data)

      const userCreated = await this.create(user)
      const newUserId = userCreated._id.toString()
      const newUser = await this.getSingleUser(newUserId)
      return newUser
    } catch (error) {
      console.log('addUser', error)
      throw error
    }
  }

  async deleteUser(userId) {
    if (!ObjectID.isValid(userId)) {
      return Promise.reject('Invalid identifier')
    }

    await this.delete(userId)
  }

  getValidDocumentForInsert(data) {
    const user = {
      created: new Date(),
      updated: null
    }

    user.username = parse.getString(data.username)
    user.password = parse.getString(data.password)

    return user
  }

  getValidDocumentForUpdate(id, data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing')
    }

    const user = {
      updated: new Date()
    }

    if (data.name !== undefined) {
      user.name = parse.getString(data.name)
    }

    return user
  }

  changeProperties(user) {
    if (user) {
      user = JSON.parse(JSON.stringify(user))
      user.id = user._id.toString()
      delete user._id
      delete user.__v
    }

    return user
  }
}

module.exports = new UsersService()
