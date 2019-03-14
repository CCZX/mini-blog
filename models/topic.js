let mongoose = require('mongoose')
let Schema = mongoose.Schema
mongoose.Promise = global.Promise
// mongoose.connect('mongodb://localhost/blogtest', {useMongoClient: true})

// connect ESC databse
let env = process.env.NODE_ENV || 'development'
let dburl = 'mongodb://127.0.0.1:27017/blogtest'
if (env) {
  dburl = 'mongodb://localhost/blogtest'
}
mongoose.connect(dburl, {
  useNewUrlParser: true
})

let topicSchema = new Schema({
  // id: {},
  mo: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('Topc', topicSchema)