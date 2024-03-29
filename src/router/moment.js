const koa = require('koa')
const koaRouter = require('@koa/router')
const { verifyAuth } = require('../middleware/verifyLoginAuth')
const connection = require('../app/database')
const verifyCommentPermission = require('../middleware/verifyComment')
const verifyLabelExists = require('../middleware/verifyLabel')

const app = new koa()

const commentRouter = new koaRouter({ prefix: '/comments' })

// todo: 登录用户发表动态接口——增
commentRouter.post('/', verifyAuth, async (ctx, next) => {
    // 获取动态内容
    const { content } = ctx.request.body
    // 获取动态作者信息，即上一个中间件verifyAuth传递的数据
    const { id } = ctx.users
    console.log('content---', content, 'id---', id);

    const statement = 'INSERT INTO comment (content, user_id) VALUES (?, ?);'
    const [result] = await connection.execute(statement, [content, id])
    console.log(result);

    ctx.body = {
        code: 0,
        message: '发表动态成功!',
        data: result
    }
})
// todo: 查看动态接口——查
commentRouter.get('/list', async (ctx, next) => {
    const { offset = 0, size = 10 } = ctx.query//参数默认值
    // const statement = 'SELECT * FROM comment;'//? 查询全部数据
    // const [result] = await connection.execute(statement)
    // const statement = 'SELECT * FROM comment LIMIT ? OFFSET ?;'//? 按条数和分页查询数据
    //?再次使用子查询，在展示动态列表时展示每条动态的标签个数
    const statement = `SELECT m.id, m.content content, m.craeteAt craeteTime, m.updateAt updateTime,
    JSON_OBJECT('id', u.id, 'name', u.name, 'createTime', u.craeteAt, 'updateTime', u.updateAt) user,
    (SELECT COUNT(*) FROM moment WHERE moment.comment_id = m.id) momentCount,
    (SELECT COUNT(*) FROM comment_label cl WHERE cl.comment_id = m.id) labelCount FROM
    comment m LEFT JOIN user u ON u.id = m.user_id LIMIT ? OFFSET ?;`//多表查询和子查询，查看动态时显示用户信息和评论个数
    const [result] = await connection.execute(statement, [String(size), String(offset)])//这里的参数不支持数字类型
    console.log(result.length);
    ctx.body = { 
        code: 0,
        data: result
    }
})
// todo: 查看某条动态详情接口——查
commentRouter.get('/list/:commentId', async (ctx, next) => {
    const { commentId } = ctx.params
    //?再次使用子查询，在展示某条动态详情时展示具体的所有标签
    const statement = `SELECT m.id, m.content content, m.craeteAt craeteTime, m.updateAt updateTime,
    JSON_OBJECT('id', u.id, 'name', u.name, 'createTime', u.craeteAt, 'updateTime', u.updateAt) user,
    (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'content', c.content, 'momentId', c.moment_id, 
    'user', JSON_OBJECT('id', cu.id, 'name', cu.name))) FROM moment c LEFT JOIN user cu ON c.user_id = cu.id
    WHERE c.comment_id = m.id) moments, (JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'name', l.name))) labels FROM
    comment m LEFT JOIN user u ON u.id = m.user_id LEFT JOIN comment_label cl ON cl.comment_id = m.id
    LEFT JOIN label l ON cl.label_id = l.id WHERE m.id = ? GROUP BY m.id;`
    const [result] = await connection.execute(statement, [commentId])
    console.log(result[0]);
    ctx.body = { 
        code: 0,
        data: result[0]
    }
})
// todo: 给动态添加标签
commentRouter.post('/:commentId/labels', verifyAuth, verifyCommentPermission, verifyLabelExists, async(ctx, next) => {
    const { commentId } = ctx.params
    const labels = ctx.labels
    // console.log(labels);
    try {
        for (const label of labels)  {
            // !!查询数据库中是否存在commentId和label.id的关系数据
            const statement = 'SELECT * FROM comment_label WHERE comment_id = ? AND label_id = ?;'
            const [result] = await connection.execute(statement, [commentId, label.id])
            // console.log('result', result.length);
            if(!result.length) {
                const statement = 'INSERT INTO comment_label (comment_id, label_id) VALUES (?, ?);'
                const [result] = await connection.execute(statement, [commentId, label.id])
            }
        }
        ctx.body = { 
            code: 0,
            message: '动态添加标签成功~'
        }
    } catch (err) {
        ctx.body = { 
            code: -2001,
            message: '动态添加标签失败~',
        }
    }
})
// todo: 修改某条动态详情接口——改
//!需要验证登陆用户的id是否与发表动态的用户id相同，相同才可以修改，否则不能修改
commentRouter.patch('/list/:commentId', verifyAuth, verifyCommentPermission, async(ctx, next) => {
    const { commentId } = ctx.params
    const { content } = ctx.request.body
    const statement = 'UPDATE comment SET content = ? WHERE id = ?'
    const [result] = await connection.execute(statement, [content, commentId])
    console.log(result);
    ctx.body = { 
        code: 0,
        message: '修改动态成功~',
        data: result
    }
})
// todo: 删除某条动态接口——删
commentRouter.delete('/list/:commentId', verifyAuth, verifyCommentPermission, async(ctx, next) => {
    const { commentId } = ctx.params
    const statement = 'DELETE FROM comment WHERE id = ?'
    const [result] = await connection.execute(statement, [commentId])
    console.log(result);
    ctx.body = { 
        code: 0,
        message: '删除动态成功~',
        data: result
    }
})

module.exports = commentRouter