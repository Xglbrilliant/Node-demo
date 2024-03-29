const jwt = require('jsonwebtoken')
const { PUBLIC_KEY } = require('../config/screct')

const verifyAuth = async (ctx, next) => {
    // 获取token
    const authorization = ctx.headers.authorization
    // console.log(authorization);
    if(!authorization) {
        return ctx.body = {
            code: -1005,
            message: 'token无效或已过期!'
        }
    }
    const token = authorization.replace('Bearer ', '')
    try {//! 使用公钥解密验证token是否有效
        const result = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ['RS256']
        })
        // console.log(result)
        ctx.users = result//传递用户数据便于其他中间件使用
        ctx.body = {
            code: 0,
            message: 'token有效,可以进入!'
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            code: -1005,
            message: 'token无效或已过期!'
        }
    }
    await next()
}

module.exports = {
    verifyAuth
}