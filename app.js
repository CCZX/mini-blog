let express = require('express')
let path = require('path')
let bodyParser = require('body-parser')
let session = require('express-session')
let router = require('./router')
let url = require('url')

let app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认就是 ./views 目录

// 配置解析表单 POST 请求体插件（注意：一定要在 app.use(router) 之前 ）
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 配置session  之后可以通 req.session 来访问(req.session.foo)和设置(req.sesssion.foo = 'bar')Session成员
app.use(session({
  secret: 'keyboard cat', // 配置加密字符串，在原有加密基础上和字符串拼接起来，增加安全性
  resave: false, // 
  saveUninitialized: true // 无论是否使用Session都默认分配钥匙 
}))

// 把路由挂载到 app 中
app.use(router)

app.listen(5000, function () {
  console.log('running...')
})
