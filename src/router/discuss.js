const koaRouter = require('@koa/router')
const { verifyAuth } = require('../middleware/verifyLoginAuth')
const connection = require('../app/database')

const discussRouter = new koaRouter({ prefix: '/discuss' })

//todo: 用户对动态发表评论接口
discussRouter.post('/', verifyAuth, async (ctx, next) => {
    const { content, commentId } = ctx.request.body
    const { id } = ctx.users
    const statement = 'INSERT INTO moment (content, comment_id, user_id) VALUES (?, ?, ?);'
    const [result] = await connection.execute(statement, [content, commentId, id])
    console.log(result);
    ctx.body = {
        code: 0,
        message: '发表评论成功~',
        data: result
    }
})

//todo: 用户回复评论接口
discussRouter.post('/reply', verifyAuth, async (ctx, next) => {
    const { content, commentId, momentId } = ctx.request.body
    const { id } = ctx.users
    // console.log(content, commentId, momentId, id);
    const statement = 'INSERT INTO moment (content, comment_id, moment_id, user_id) VALUES (?, ?, ?, ?);'
    const [result] = await connection.execute(statement, [content, commentId, momentId, id])
    console.log(result);
    ctx.body = {
        code: 0,
        message: '回复评论成功~',
        data: result
    }
})

module.exports = discussRouter