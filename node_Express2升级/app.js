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

app.listen(8888, () => console.log('启动服务'))

let login = true

// app.all方法，这个方法支持所有请求方式，不必每个  请求都写好几遍了。
// 方法有三个返回值。第一个是传过来的。第二个是以什么形式返回 json等格式。第三个是继续执行下去

// app.all('*', (req, res, next) => {
//   if (!login) return res.json('未登录')
//   next()
// })

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
  /*让options请求快速返回*/ else next()
})

app.post('/login', (req, res, next) => {
  conn.query('SELECT * FROM students', (e, r) => res.json(new Result({ data: r, msg: '获取成功' })))
})

app.get('/api/getlist', (req, res, next) => {
  const sqlStr = 'SELECT * FROM students'
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({ code: 1, msg: '资料不存在', data: {} })
    res.json({ code: 200, msg: '获取成功', data: results })
  })
})

app.post('/api/setList', (req, res, next) => {
  // const sqlStr = "INSERT into students (id,name,sex,age,address,hou) values(4,'小王','男',12,'吉林',2)"
  const json = req.body
  const sqlStr1 = `INSERT into students (name,sex,age,address,hou) values('${json.name}','${json.sex}',${json.age},'${json.address}',${json.hou})`
  const sqlStr2 = `select name from students WHERE name='${json.name}' `
  conn.query(sqlStr2, (err, results) => {
    if (results.length === 0) {
      conn.query(sqlStr1, (err, results) => {
        res.json({ code: 200, msg: '添加成功', data: results })
      })
    } else {
      res.json({ code: 202, msg: '名子重复', data: results })
    }
  })
})

app.put('/api/alterList/:id', (req, res) => {
  const sqlStr = `UPDATE students set name='${req.body.name}' where id=${req.params.id}`
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({ code: 1, msg: '修改失败', data: req.params })
    res.json({ code: 200, msg: '修改成功', data: {} })
  })
})

app.delete('/api/deleteList/:id', (req, res) => {
  const sqlStr = `delete from students WHERE id = ${req.params.id}`
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({ code: 1, msg: '删除失败', data: req.params })
    res.json({ code: 200, msg: '删除成功' })
  })
})

app.post('/test/:data', (req, res) => {
  // 后面的表单参数会放到req.query、 路径上的参数会放到req.params里、 json参数会放到req.body里，
  // http://localhost:8888/test/123?a=b    /text是params
  return res.json({ query: req.query, data: req.params, json: req.body })
})

app.post('/api/login', (req, res) => {
  const sqlStr = `select username from user where username='${req.body.username}'`
  const sqlStr2 = `select * from user where password ='${req.body.password}'`
  conn.query(sqlStr, (err, results) => {
    if (results.length === 0) {
      return res.json({ code: 401, msg: '用户不存在', data: results })
    } else {
      conn.query(sqlStr2, (err, results2) => {
        if (results2.length === 0) res.json({ code: 401, msg: '密码错误', data: results2 })
        else res.json({ code: 200, msg: '登录成功', data: results2 })
      })
    }
  })
})

function Result({ code = 200, msg = '', data = {} }) {
  this.code = code
  this.msg = msg
  this.data = data
}
