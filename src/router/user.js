const koaRouter = require('@koa/router')
const connection = require('../app/database')

const userRouter = new koaRouter({ prefix: '/users' })

// 用户注册接口
userRouter.post('/register', async (ctx, next) => {
    // const userInfo = ctx.request.body
    // console.log(userInfo);
    const { name, password } = ctx.request.body//?1、获取用户的数据
    console.log(name, password);

    // ! 验证用户信息的逻辑
    if(!name || !password) {//todo:判断用户名或密码是否为空
        ctx.body = {
            code: -1001,
            message: '用户名或密码不能为空!'
        }
        return
    }
    const statement1 = 'SELECT * FROM `user` WHERE name = ?;'//todo:判断用户名是否已经存在
    let [users] = await connection.execute(statement1, [name])//返回查询到的用户结果
    if(users.length) {//如果查询到的数组不为空，说明查询到了用户数据(即用户名已经存在)
        ctx.body = {
            code: -1002,
            message: '用户名已经存在,请重新注册!'
        }
        return
    }
    
    //?2、拼接statement
    const statement = 'INSERT INTO `user` (name, password) VALUES (?, ?);'

    // ? 3、执行sql语句
    let [result] = await connection.execute(statement, [name, password])//异步操作

    ctx.body = {
        message: '注册成功~',
        data: result
    }

    return result
})

module.exports = {
    userRouter
}