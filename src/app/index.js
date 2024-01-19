const koa = require('koa')
const { userRouter } = require('../router/user')

const app = new koa()

app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

module.exports = app

