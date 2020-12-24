class BaseController {
  constructor (Model) {
    this.Model = Model
  }

  async get (_id) {
    return this.Model.findById(_id.toString())
  }

  async getAll (offset, limit) {
    return this.Model.find({}).sort({ _id: -1 }).skip(offset).limit(limit)
  }

  async delete (_id) {
    return this.Model.findByIdAndRemove(_id.toString())
  }

  async create (obj) {
    return this.Model.create(obj)
  }

  async findOrCreate (obj) {
    const query = {}
    if (obj.username) query.username = obj.username
    if (obj.url) query.url = obj.url
    const data = await this.Model.findOne(query)
    if (data) return data
    return await this.Model.create(obj)
  }

  async findOne (obj) {
    const query = {}
    if (obj.username) query.username = obj.username
    if (obj.url) query.url = obj.url
    const data = await this.Model.findOne(query)
    return data
  }

  async findAndUpdate (_id, obj) {
    return await this.Model.findByIdAndUpdate(_id.toString(), {'$set': obj}, {new: true})
  }

  async countDocuments () {
    return await this.Model.countDocuments()
  }
}

module.exports = BaseController
