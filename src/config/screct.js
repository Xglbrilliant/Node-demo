const fs = require('fs')

//! 这里的./读取的其实是src同级目录(默认情况下根据package.json文件下的启动目录查找),因此这样读取有误
// const PRIVATE_KEY = fs.readFileSync('./keys/private.key')
// const PUBLIC_KEY = fs.readFileSync('./keys/public.key')
// ? 方法一
// const PRIVATE_KEY = fs.readFileSync('./src/config/keys/private.key')
// const PUBLIC_KEY = fs.readFileSync('./src/config/keys/public.key')

// ? 方法二
const path = require('path')
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key'))
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'))

module.exports = {
    PRIVATE_KEY,
    PUBLIC_KEY
}