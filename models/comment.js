let mongoose = require('mongoose')
let Schema = mongoose.Schema
mongoose.Promise = global.Promise
// connect ESC databse
let env = process.env.NODE_ENV || 'development'
let dburl = 'mongodb://127.0.0.1:27017/blogtest'
if (env) {
  dburl = 'mongodb://localhost/blogtest'
}
mongoose.connect(dburl, {
  useNewUrlParser: true
})
let commentSchema = new Schema({
  nickname: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('Comment', commentSchema)