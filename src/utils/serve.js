const { VIDEO_PATH } = require('./constant')
const fs = require('fs')
const url = require('url')
const path = require('path')
const http = require('http')

export const httpServer = ()=> {
    const server = http.createServer((req, res) => {
        const realPath = path.join(VIDEO_PATH,req.url)
        fs.readFile(realPath, (err, data) => {
            if (err) {
                res.writeHead(404, {
                    "content-type":'type/plain;charset=utf-8'
                })
                res.write('404')
                res.end()
            }
            res.write(data)
            res.end('ok')
        })
    })

    server.listen(9000, () => {
        console.log('服务器启动了');
    })
}


