const koaRouter = require('@koa/router')
const connection = require('../app/database')

const userRouter = new koaRouter({ prefix: '/users' })

// 用户注册接口
userRouter.post('/login', (ctx, next) => {
    const userInfo = ctx.request.body
    console.log(userInfo);

    ctx.body = '注册成功~'
})

module.exports = {
    userRouter
}