const mongoose = require('mongoose')

const mongoConnectionStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@generalassembly.ljkj0.mongodb.net/?retryWrites=true&w=majority`
const DB = mongoose.connect(mongoConnectionStr, { dbName: 'ikemen'})

module.exports = DB