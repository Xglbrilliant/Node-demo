const koaRouter = require('@koa/router')
const multer = require('@koa/multer')
const { verifyAuth } = require('../middleware/verifyLoginAuth')
const connection = require('../app/database')

const uploadAvatar = multer({
    dest: './uploads'
})

const fileRouter = new koaRouter({ prefix: '/files' })

fileRouter.post('/avatar', verifyAuth, uploadAvatar.single('avatar'), async (ctx, next) => {
    // console.log(ctx.request.file);
    // console.log(ctx.users);
    const { filename, mimetype, size } = ctx.request.file
    const { id } = ctx.users
    const statement = 'INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?);'
    const [result] = await connection.execute(statement, [filename, mimetype, size, id])
    console.log(result);

    ctx.body = {
        code: 0,
        message: '文件上传成功',
        data: result
    }
})

module.exports = fileRouter