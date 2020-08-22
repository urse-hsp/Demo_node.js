const express = require('express')
const app = express()
const cors = require('cors')
const { json, urlencoded } = require('body-parser') // 解析参数
const mysql = require('mysql')

const option = {
  host: 'localhost',
  user: 'root',
  password: '930985128',
  port: '3306',
  database: 'login', // 底层数据库
  connectTimeout: 5000, // 链接超时
  multipleStatements: false, // 是否允许一个query中包含多条sql语句
}

app.use(cors()) // 解决跨域
app.use(json()) // json请求
app.use(urlencoded({ extended: false })) // 表单请求

const conn = mysql.createConnection(option)

app.listen(80, () => console.log('启动服务'))

let login = true

// app.all方法，这个方法支持所有请求方式，不必每个请求都写好几遍了。
// 方法有三个返回值。第一个是传过来的。第二个是以什么形式返回 json等格式。第三个是继续执行下去

app.all('*', (req, res, next) => {
  if (!login) return res.json('未登录')
  next()
})

app.get('/login', (req, res, next) => {
  conn.query('SELECT * FROM students', (e, r) => res.json(new Result({ data: r })))
})

app.get('/api/getlist', (req, res, next) => {
  const sqlStr = 'SELECT * FROM students'
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({ code: 1, msg: '资料不存在', data: {} })
    res.json({ code: 200, msg: '获取成功', data: results })
  })
})

app.post('/test/:data', (req, res) => {
  // 后面的表单参数会放到req.query、 路径上的参数会放到req.params里、 json参数会放到req.body里，
  return res.json({ query: req.query, data: req.params, json: req.body })
})

function Result({ code = 200, msg = '', data = {} }) {
  this.code = code
  this.msg = msg
  this.data = data
}
