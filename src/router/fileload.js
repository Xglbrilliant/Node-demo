const koaRouter = require('@koa/router')
const multer = require('@koa/multer')
const { verifyAuth } = require('../middleware/verifyLoginAuth')
const connection = require('../app/database')
const UPLOAD_PATH = require('../config/filePath')
const fs = require('fs')
const { SERVER_PORT, SERVER_HOST } = require('../config/server')

const uploadAvatar = multer({
    dest: UPLOAD_PATH
})

const fileRouter = new koaRouter({ prefix: '/users/files' })

fileRouter.post('/avatar', verifyAuth, uploadAvatar.single('avatar'), async (ctx, next) => {
    // console.log(ctx.request.file);
    // console.log(ctx.users);
    const { filename, mimetype, size } = ctx.request.file
    const { id } = ctx.users
    const statement = 'INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?);'
    const [result] = await connection.execute(statement, [filename, mimetype, size, id])
    console.log(result);
    // 将头像信息保存到用户表中
    const statement1 = 'UPDATE user SET avatar_url = ? WHERE id = ?;'
    const avatarUrl = `${SERVER_HOST}:${SERVER_PORT}/users/avatar/${id}`
    const [result1] = await connection.execute(statement1, [avatarUrl, id])
    console.log(result1);

    ctx.body = {
        code: 0,
        message: '文件上传成功',
        data: avatarUrl
    }
})
// 查看头像信息
fileRouter.get('/avatar/:userId', verifyAuth, async (ctx, next) => {
    const { id } = ctx.users
    // 1、获取用户id对应的文件信息
    const statement = 'SELECT * FROM avatar WHERE user_id = ?;'
    const [result] = await connection.execute(statement, [id])
    // console.log(result);
    // 2、读取文件
    const { filename, mimetype } = result[1]
    ctx.type = mimetype//设置类型，解析文件
    ctx.body = fs.createReadStream(`${UPLOAD_PATH}/${filename}`)
})

module.exports = fileRouter