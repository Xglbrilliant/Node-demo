const koa = require('koa')
const bodyparser = require('koa-bodyparser')
const { userRouter } = require('../router/user')
const { loginRouter } = require('../router/userLogin')

const app = new koa()

app.use(bodyparser())
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())
app.use(loginRouter.routes())
app.use(loginRouter.allowedMethods())

module.exports = app

