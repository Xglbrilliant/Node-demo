const dotenv = require('dotenv')

dotenv.config()//?通过第三方库dotenv中的config方法来加载.env文件中定义的变量

// console.log(process.env);
// const SERVER_PORT = process.env.SERVER_PORT
// module.exports = {
//     SERVER_PORT
// }

module.exports = {
    SERVER_PORT,
    SERVER_HOST
} = process.env