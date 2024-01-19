const koaRouter = require('@koa/router')

const userRouter = new koaRouter({ prefix: '/users' })

userRouter.get('/', (ctx, next) => {
    ctx.body = 'user list data~'
})

module.exports = {
    userRouter
}