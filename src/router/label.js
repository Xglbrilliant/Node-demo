const koaRouter = require('@koa/router');
const connection = require('../app/database');

const labelRouter = new koaRouter({ prefix: '/labels' })

labelRouter.get('/', async (ctx, next) => {
    const { name } = ctx.request.body
    // console.log(name);
    const statement = 'INSERT INTO label (name) VALUES (?);'
    const [result] = await connection.execute(statement, [name])
    // console.log(result);

    ctx.body = {
        code: 0,
        message: '创建标签成功~',
        data: result
    }
})
//? 获取标签列表
labelRouter.get('/list', async (ctx, next) => {
    const statement = 'SELECT * FROM label;'
    const [result] = await connection.execute(statement)
    // console.log(result);
    ctx.body = {
        code: 0,
        message: '查看标签列表成功~',
        data: result
    }
})

module.exports = labelRouter