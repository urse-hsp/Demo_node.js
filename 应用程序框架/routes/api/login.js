// 引入jwt token工具
const JwtUtil = require('../../utils/jwt')
// 我这里的是aes加密密码的可以去掉
// const AesUtil = require('../public/utils/aes');
// 登录
router.post('/login', (req, res) => {
  var userName = req.body.user
  var pass = req.body.pass
  new Promise((resolve, reject) => {
    // 根据用户名查询用户
    users.findOne({ username: userName }).exec((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
    .then((result) => {
      console.log(result)
      if (result) {
        // 密码解密 利用aes
        var aes = new AesUtil(result.password)
        var password = aes.deCryto()
        if (pass == password) {
          // 登陆成功，添加token验证
          let _id = result._id.toString()
          // 将用户id传入并生成token
          let jwt = new JwtUtil(_id)
          let token = jwt.generateToken()
          // 将 token 返回给客户端
          res.send({ status: 200, msg: '登陆成功', token: token })
        } else {
          res.send({ status: 400, msg: '账号密码错误' })
        }
      } else {
        res.send({ status: 404, msg: '账号不存在' })
      }
    })
    .catch((err) => {
      console.log(err)
      res.send({ status: 500, msg: '账号密码错误' })
    })
})
