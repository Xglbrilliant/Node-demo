const connection = require("../app/database")

const verifyLabelExists = async (ctx, next) => {
    //?获取客户端传递的labels
    const { labels } = ctx.request.body
    // console.log(labels);
    // !!验证添加的标签是否已经存在
    const newLabels = []
    for (const name of labels) {
        const statement = 'SELECT * FROM label WHERE name = ?;'
        const [result] = await connection.execute(statement, [name])
        // console.log('result', result[0]);
        const labelObj = { name }
        if(result[0]) {//?存在则获取name对应的label的id
            labelObj.id = result[0].id
        } else {//?不存在则插入标签name并获取插入之后的id
            const statement = 'INSERT INTO label (name) VALUES (?);'
            const insertResult = await connection.execute(statement, [name])
            // console.log('insertResult', insertResult);
            labelObj.id = insertResult[0].insertId
        }
        newLabels.push(labelObj)
    }
    // console.log('newLabels', newLabels);
    ctx.labels = newLabels
    await next()
}

module.exports = verifyLabelExists