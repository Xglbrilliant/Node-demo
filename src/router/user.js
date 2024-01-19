const koaRouter = require('@koa/router')
const connection = require('../app/database')

const userRouter = new koaRouter({ prefix: '/users' })

// 用户注册接口
userRouter.post('/register', async (ctx, next) => {
    // const userInfo = ctx.request.body
    // console.log(userInfo);
    const { name, password } = ctx.request.body//?1、获取用户的数据
    console.log(name, password);

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