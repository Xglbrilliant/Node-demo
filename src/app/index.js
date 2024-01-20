const koa = require('koa')
const bodyparser = require('koa-bodyparser')
// const { userRouter } = require('../router/user')
// const { loginRouter } = require('../router/userLogin')
const userRouter = require('../router/user')
const loginRouter = require('../router/userLogin')
const registerRouters = require('../utils/registerAllRouters')

const app = new koa()

app.use(bodyparser())
// app.use(userRouter.routes())
// app.use(userRouter.allowedMethods())
// app.use(loginRouter.routes())
// app.use(loginRouter.allowedMethods())
registerRouters(app)

module.exports = app

