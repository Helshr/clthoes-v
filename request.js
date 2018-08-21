class Request {
    constructor() {
        this.raw = ''
        // 默认是 GET 方法
        this.method = 'GET'
        this.path = ''
        this.query = {}
        this.body = ''
    }
    form() {
        // 浏览器在发送 form 表单的数据时, 会自动使用 encodeURIComponent 编码
        // 所以拿到 body 的数据之后先解码
        // 得到的是下面这种格式的数据: a=b&c=d&e=f
        const body = decodeURIComponent(this.body)
        const pairs = body.split('&')
        const d = {}
        for (let pair of pairs) {
            const [k, v] = pair.split('=')
            d[k] = v
        }
        return d
    }
}

module.exports = Request
