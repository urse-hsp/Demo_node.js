const express = require('express')
const router = express.Router()
// 引入jwt token工具
const JwtUtil = require('../../utils/jwt')

const { conn } = require('../../utils/connectMysql')

router.get('/getlist', (req, res, next) => {
  const sqlStr = 'SELECT * FROM students'
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({ code: 1, msg: '资料不存在', data: {} })
    // res.json({ code: 200, msg: '获取成功', data: results })
    res.sendResult(results, 200, '获取成功')
  })
})

router.post('/setList', (req, res, next) => {
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

router.put('/alterList/:id', (req, res) => {
  const sqlStr = `UPDATE students set name='${req.body.name}' where id=${req.params.id}`
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({ code: 1, msg: '修改失败', data: req.params })
    res.json({ code: 200, msg: '修改成功', data: {} })
  })
})

router.delete('/deleteList/:id', (req, res) => {
  const sqlStr = `delete from students WHERE id = ${req.params.id}`
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({ code: 1, msg: '删除失败', data: req.params })
    res.json({ code: 200, msg: '删除成功' })
  })
})

router.post('/test/:data', (req, res) => {
  // 后面的表单参数会放到req.query、 路径上的参数会放到req.params里、 json参数会放到req.body里，
  // http://localhost:8888/test/123?a=b    /text是params
  return res.json({ query: req.query, data: req.params, json: req.body })
})

router.post('/login', (req, res) => {
  const sqlStr = `select username from user where username='${req.body.username}'`
  const sqlStr2 = `select * from user where password ='${req.body.password}'`
  conn.query(sqlStr, (err, results) => {
    if (results.length === 0) {
      return res.json({ code: 401, msg: '用户不存在', data: results })
    } else {
      conn.query(sqlStr2, (err, results2) => {
        if (results2.length === 0) return res.json({ code: 401, msg: '密码错误', data: results2 })
        else {
          let jwt = new JwtUtil(results2.id)
          let token = jwt.generateToken()
          res.json({ code: 200, msg: '登录成功', data: { ...results2[0], token } })
        }
      })
    }
  })
})
module.exports = router
