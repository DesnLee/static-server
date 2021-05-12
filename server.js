let http = require('http')
let fs = require('fs')
let url = require('url')
let port = process.argv[2]

if (!port) {
    console.log('请指定端口号! 像这样 node server.js 8888')
    process.exit(1)
}

let server = http.createServer(function (request, response) {
    let parsedUrl = url.parse(request.url, true)
    let pathWithQuery = request.url
    let queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
    }
    let path = parsedUrl.pathname
    let query = parsedUrl.query
    let method = request.method
    /******** 从这里开始看，上面不要看 ************/

    console.log('有个人摸了一下 ' + pathWithQuery + ' 这个地方')

    const map = {
        '.js' : 'text/javascript',
        '.html' : 'text/html',
        '.css' : 'text/css',
        '.json' : 'application/json',
        '.jpg' : 'image/jpeg',
        '.png' : 'image/png',
    }

    path = path === `/` ? `/index.html` : path
    let index = path.lastIndexOf(`.`)
    let suffix = path.substring(index)
    let content

    response.statusCode = 200
    response.setHeader(`Content-Type`, `${map[suffix] || 'text/html'};charset=utf-8`)

    try {
        content = fs.readFileSync(`./public${path}`)
    }catch (error){
        content = fs.readFileSync(`./public/404.html`)
        response.setHeader(`Content-Type`, `text/html;charset=utf-8`)
        response.statusCode = 404
    }

    response.write(content)
    response.end()

    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('node已经在 ' + port + ' 端口启动成功！访问地址: http://localhost:' + port)
