const connection = require("../app/database");

const verifyCommentPermission = async(ctx, next) => {
    const { commentId } = ctx.params
    const { id } = ctx.users//verifyLoginAuth中间件传递的数据
    console.log(commentId, id);
    const statement = 'SELECT * FROM comment WHERE id = ? AND user_id = ?;'
    const [result] = await connection.execute(statement, [id, commentId])
    if(!result.length) {//如果查询到数据则说明用户id与发表动态的用户id相同，即有权限修改
        return ctx.body = {
            code: -1006,
            message: '没有权限，无法修改这条动态~'
        }
    } else {
        next()
    }
}

module.exports = verifyCommentPermission