const fs = require('fs')

function registerRouters(app) {
    const files = fs.readdirSync('./src/router/')
    console.log(files);
    for (const file of files) {
        if(!file.endsWith('.js')) continue
        const router  = require(`../router/${file}`)
        app.use(router.routes())
        app.use(router.allowedMethods())
    }
}

module.exports = registerRouters