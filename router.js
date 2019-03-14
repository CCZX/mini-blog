let express = require('express')
let User = require('./models/user')
let Topic = require('./models/topic')
let Com = require('./models/comment')
let router = express.Router()
let md5 = require('blueimp-md5')
let url = require('url')
// 渲染首页
router.get('/', function (req, res) {
  // res.send('123')
  console.log(req.session.user)
  Topic.find(function (err, topics) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务器错误'
      })
    }
    // console.log(topics)
    // topics.date = topics.date.replace(/"/g, '')
    res.render('index.html', {
      user: req.session.user,
      topics: topics
    })
  })
})

// 渲染登陆页面
router.get('/login', function (req, res) {
  res.render('login.html')
})

// 处理登陆请求
router.post('/login', function (req, res) {
  let body = req.body
  User.findOne({
    email: body.email,
    password: md5(md5(body.password))
  }, function (err, user) {
    if (err) {
      return res.status(5000).json({
        err_code: 500,
        message: err.message
      })
    }
    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'email or password is invalid'
      })
    }
    // 用户存在登陆成功，通过Session记录登陆状态
    req.session.user = user
    res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  })
})

// 处理退出请求
router.get('/logout', function (req, res) {
  // 清除登陆状态 重定向到登陆页面
  req.session.user = null
  res.redirect('/login')
})

// 渲染注册页面
router.get('/register', function (req, res) {
  res.render('register.html')
})

// 处理注册请求
router.post('/register', function (req, res) {
  // 1.获取表单提交的数据  2.操作数据库  3.发送响应
  let body = req.body
  User.findOne({
    $or: [
      {
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  }, function (err, data) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: '服务器错误'
      })
    }
    if (data) {
      // 注册用户已经存在
      return res.status(200).json({ // json express 内置方法 将接受的对象参数转换为字符串再发送给浏览器
        err_code: 1,
        message: '邮箱或密码已经存在'
      })
    }
    body.password = md5(md5(body.password)) // 对密码进行重复加密
    new User(body).save(function (err, user) {
      if (err) {
        // throw err
        return res.status(500).json({
          err_code: 500,
          message: '服务器错误'
        })
      }

      req.session.user = user // 注册成功使用Session来记录用户登陆状态
      res.status(200).json({ // 
        err_code: 0,
        message: 'ok'
      })
    })
  })
})

// 用户设置页面
router.get('/settings/profile', function (req, res) {
  res.render('settings/profile.html', {
    user: req.session.user
  })
})

// 用户基本信息更改设置
router.post('/settings/profile', function (req, res) {
  // console.log(req.body)
  let body = req.body
  User.findOne({
    nickname: body.nickname
  }, function (err, data) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务器错误'
      })
    }
    if (data) {
      return res.status(200).json({
        err_code: 1,
        message: '用户名已存在'
      })
    }
    User.update({
      email: body.email
    },{
      $set: {
        'nickname': body.nickname,
        'bio': body.bio,
        'gender': body.gender,
        'birthday': body.birthday
      }
    }, function (err, user) {
      if (err) {
        return res.status(200).json({
          err_code: 2,
          message: '修改失败'
        })
      }
      User.findOne({
        email: body.email
      }, function (err, user) {
        if (err) {
          return res.status(500).json({
            err_code: 500,
            message: '服务器错误'
          })
        }
        // console.log(user)
        req.session.user = user
      })
      return res.status(200).json({
        err_code: 0,
        message: 'ko'
      })
    })
  })
})

// 用户账户修改设置
router.get('/settings/admin', function (err, res) {
  res.render('settings/admin.html')
})

// 发表文章
router.get('/topics/new', function (req, res) {
  res.render('topic/new.html',{
    user: req.session.user
  })
})
router.post('/topics/new', function (req, res) {
  // console.log(req.body)
  let body = req.body
  new Topic(body).save(function (err, data) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务器错误'
      })
    }
    return res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  })
})

// 文章详情
router.get('/topics/main', function (req, res) {
  // Topic.findById()
  // console.log(url.parse(req.url).query)
  let id = url.parse(req.url).query
  Topic.findById(id, function (err, topic) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务器错误'
      })
    }
    // console.log(data)
    // console.log(req.session.user)
    Com.find(function (err, comments) {
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: '服务器错误'
        })
      }
      res.render('topic/main.html', {
        topic: topic,
        user: req.session.user,
        comments: comments
      })
    })
    // res.render('topic/main.html', {
    //   topic: topic,
    //   user: req.session.user
    // })
  })
  
})

// 评论
router.post('/topics/main', function (req, res) {
  // console.log(req.body)
  let body = req.body
  if (!body.nickname) {
    return res.status(200).json({
      err_code: 1,
      message: '请登陆'
    })
  }
  if (!body.comment) {
    return res.status(200).json({
      err_code: 2,
      message: '未输入内容'
    })
  }
  new Com(body).save(function (err, data) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务器错误'
      })
    }
    res.render('topic/main.html')
    return res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  })
})
module.exports = router
