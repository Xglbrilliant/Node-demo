const koaRouter = require('@koa/router')
const connection = require('../app/database')
const md5Password = require('../utils/md5-password')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../config/screct')
const { verifyAuth } = require('../middleware/verifyLoginAuth')

const loginRouter = new koaRouter({ prefix: '/login' })

loginRouter.post('/', async (ctx, next) => {
    const { name, password } = ctx.request.body
    console.log(name, password);

    // ! 验证用户信息的逻辑
    if(!name || !password) {//todo:判断用户名或密码是否为空
        ctx.body = {
            code: -1001,
            message: '用户名或密码不能为空!'
        }
        return
    }
    const statement1 = 'SELECT * FROM `user` WHERE name = ?;'//todo:判断用户名是否在数据库中存在
    let [users] = await connection.execute(statement1, [name])//返回查询到的用户结果
    console.log(users);
    if(!users.length) {//如果查询到的数组为空，说明用户数据不存在
        ctx.body = {
            code: -1003,
            message: '用户不存在,请注册!'
        }
        return
    }
    if(users[0].password !== md5Password(password)) {//todo:判断用户密码是否输入正确
        ctx.body = {
            code: -1004,
            message: '密码错误,请重新输入!'
        }
        return
    }

    // todo:用户登陆成功,使用私钥加密给用户颁发token
    const id = users[0].id
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
        expiresIn: 24 * 60 * 60,//过期时间
        algorithm: 'RS256'//加密算法
    })
    ctx.body = {
        code: 0,
        data: { id, name, token }
    }
})
loginRouter.post('/list', verifyAuth)

// module.exports = {
//     loginRouter
// }
module.exports = loginRouter

