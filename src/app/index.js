const koa = require('koa')
const bodyparser = require('koa-bodyparser')
const { userRouter } = require('../router/user')

const app = new koa()

app.use(bodyparser())
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

module.exports = app

