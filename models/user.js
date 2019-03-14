let mongoose = require('mongoose')
let Schema = mongoose.Schema
// 连接数据库
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
let userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_time: {
    type: Date,
    default: Date.now // 不要写Date.now()  
  },
  last_modified_time: {
    type: Date,
    default: Date.now
  },
  avatar: { // 头像
    type: String,
    default: '/public/img/avatar-default.png'
  },
  bio: { // 简介
    type: String,
    default: ''
  },
  gender: {
    type: Number,
    enum: [-1, 0, 1], // 保密 男 女
    default: -1
  },
  birthday: {
    type: Date
  },
  status: {
    type: Number,
    enum: [0, 1, 2], // 无权限限制 不可以评论 不可以登陆
    default: 0
  }
})

module.exports = mongoose.model('User', userSchema)
