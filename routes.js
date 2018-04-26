const fs = require('fs')
const log = require('./utils')
const multiparty = require('multiparty')
const util = require('util')

// 引入 Model 模块
// 因为暴露出来的模块就是包含了 Model 的对象
// 所以分别将这个对象的属性提取出来赋值给相应的 model
const models = require('./models')
const User = models.User
const Customers = models.Customers

// 读取 html 文件的函数
const template = (name) => {
    const path = 'templates/' + name
    const options = {
        encoding: 'utf8'
    }
    const content = fs.readFileSync(path, options)
    return content
}

const index = (request) => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('index.html')
    const r = header + '\r\n' + body
    return r
}


// 登录的处理函数, 根据请求方法来处理业务
const login = (request) => {
    let result
    if (request.method === 'POST') {
        // 获取表单中的数据
        const form = request.form()
        // 根据 form 生成 User 实例
        const u = User.create(form)
        if (u.validateLogin()) {
            const usa = User.all()
            let valid = true
            for (let i = 0; i < usa.length; i++) {
                const us = usa[i]
                if (us.username === u.username) {
                    valid = false
                    break
                }
            }
            if (valid) {
                u.save()
            }
            const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
            let body = template('Login-success.html')
            const r = header + '\r\n' + body
            return r
        } else {
            let body = template('login-false.html')
        }
    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('login.html')
    const r = header + '\r\n' + body
    return r
}

const submitMes = (request) => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('submit-message.html')
    const r = header + '\r\n' + body
    return r
}

const admin = (request) => {
    ca = Customers.all()
    let s = ''
    for (let i = 0; i < ca.length; i++) {
        s += `<h2>电话号：${ca[i].phoneNumbers} 订单数量：${ca[i].clothesNumbers}</h2>`
    }

    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('admin.html')
    body = body.replace('{{replace}}', s)
    const r = header + '\r\n' + body
    return r
}

const getCustomMessage = (request) => {
    if (request.method === 'POST') {
        // 获取表单中的数据
        const form = request.form()
        // 根据 form 生成 User 实例
        const c = Customers.create(form)
        if (c.validateLogin()) {
            c.save()
        }
    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('ok.html')
    const r = header + '\r\n' + body
    return r
}

// 接收发送过来的图片, 并保存到文件夹中
const uploadImg = (request) => {
    // const form = new multiparty.Form()
    // form.parse(request, (err, fields, files) => {
    //     if (err) {
    //         console.error(err)
    //     }
    //     log('fields: ', fields)
    //     log('files: ', files)
    // })
    // log('req: ', request)
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    const body = template('uploadImg.html')
    const r = header + '\r\n' + body
    return r
}

// 图片的响应函数, 读取图片并生成响应返回
const staticImg = (request) => {
    // 静态资源的处理, 读取图片并生成相应返回
    const filename = request.query.file || 'doge.gif'
    const path = `static/img/${filename}`
    const body = fs.readFileSync(path)
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: image/gif\r\n\r\n'
    const h = Buffer.from(header)
    const r = Buffer.concat([h, body])
    return r
}

const staticJs = (request) => {
    // 静态资源的处理, 读取文件并生成相应返回
    const filename = request.query.file || ''
    const path = `static/js/${filename}`
    const body = fs.readFileSync(path)
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n'
    const h = Buffer.from(header)
    const r = Buffer.concat([h, body])
    return r
}

const staticCss = (request) => {
    // 静态资源的处理, 读取文件并生成相应返回
    const filename = request.query.file || ''
    const path = `static/css/${filename}`
    const body = fs.readFileSync(path)
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/css\r\n\r\n'
    const h = Buffer.from(header)
    const r = Buffer.concat([h, body])
    return r
}

// 把 route 放在一起, 然后暴露出去
const routeMapper = {
    '/': index,
    '/login': login,
    '/static/img': staticImg,
    '/static/js': staticJs,
    '/static/css': staticCss,
    '/submit-message': submitMes,
    '/ok': getCustomMessage,
    '/admin': admin
}

module.exports = routeMapper