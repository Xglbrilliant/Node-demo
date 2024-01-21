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

module.exports = labelRouter