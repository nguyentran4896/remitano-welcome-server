const { MongoMemoryServer } = require('mongodb-memory-server')
const mongod = new MongoMemoryServer()
const mongoose = require('mongoose')

module.exports.connect = async () => {
    try {
        const uri = await mongod.getUri()

        console.log('URI: ' + uri);

        const mongooseOpts = {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }

        await mongoose.connect(uri, mongooseOpts)
        console.log('MockDB connect successfully')
    } catch (error) {
        console.error(error)
    }
}

module.exports.disconnect = async () => {
    try {
        await mongoose.disconnect()
        await mongod.stop()
        console.log('MockDB stopped successfully')
    } catch (error) {
        console.error(error)
    }
}