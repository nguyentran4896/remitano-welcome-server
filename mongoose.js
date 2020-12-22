const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.i2mcj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
async function run() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('MongoDB connected correctly!');
    } catch (err) {
        console.log(err.stack);
    }
}
run().catch(console.dir);

module.exports = mongoose