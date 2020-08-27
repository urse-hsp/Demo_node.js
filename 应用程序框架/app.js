const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser') // 方便操作客户端中的cookie值。
const logger = require('morgan')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const apiRouter = require('./routes/api/index')

const app = express()

// // view engine setup 视图引擎设置
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json()) // 解析参数
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 设置跨域和相应数据格式
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // 跨域
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken') // 请求头中设置允许的请求方法。
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
  res.setHeader('Content-Type', 'application/json; charset=utf-8') // 使用Content-Type来表示具体请求中的媒体类型信息
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS') // 允许访问的方法
  res.header('X-Powered-By', ' 3.2.1')
  if (req.method == 'OPTIONS') res.send(200)
  else next() /*让options请求快速返回*/
})

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler  捕获404并转发到错误处理程序
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
