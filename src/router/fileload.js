const koaRouter = require('@koa/router')
const multer = require('@koa/multer')
const { verifyAuth } = require('../middleware/verifyLoginAuth')

const uploadAvatar = multer({
    dest: './uploads'
})

const fileRouter = new koaRouter({ prefix: '/files' })

fileRouter.post('/avatar', verifyAuth, uploadAvatar.single('avatar'), (ctx, next) => {
    console.log(ctx.request.file);

    ctx.body = '文件上传成功~'
})

module.exports = fileRouter