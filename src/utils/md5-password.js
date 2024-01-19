const crypto = require('crypto')

function md5Password(password) {
    const md5 = crypto.createHash('md5')
    //? 使用md5加密算法加密，再转化为十六进制
    const md5pwd = md5.update(password).digest('hex')
    return md5pwd
}

module.exports = md5Password