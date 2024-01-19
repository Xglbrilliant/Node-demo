const mysql = require('mysql2')

//? 1、建立连接池
const connectionPool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'node',
    user: 'root',
    password: '@QAZmlp@0825#',
    connectionLimit: 6
})

//? 2、使用getConnection方法验证连接是否成功
connectionPool.getConnection((err, connection) => {
    if(err) {//判断是否有错误信息
        console.log('连接失败！', err);
        return
    }
    connection.connect(err => {//获取connection,尝试和数据库建立连接
        if(err) {
            console.log('和数据库连接失败！', err);
        } else {
            console.log('和数据库连接成功！');
        }
    })
})


//? 3、获取连接池中的连接对象(promise对象)
const connection = connectionPool.promise()

module.exports = connection