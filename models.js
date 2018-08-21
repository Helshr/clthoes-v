// 引入模块
const fs = require('fs')
const log = require('./utils')

// 一个辅助函数, 确保要操作的文件已经存在
// 如果不存在就直接创建这个文件, 这样在调用的时候不会报错
const ensureExists = (path) => {
    if (!fs.existsSync(path)) {
        // 因为保存的数据都是 json 格式的, 所以在初始化文件的时候
        // 会写入一个空数组
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}

// 将数据(object 或者 array)写入到文件中, 相当于持久化保存数据
// data 是 object 或者 array
// path 是 保存文件的路径
const save = (data, path) => {
    // 默认情况下使用 JSON.stringify 返回的是一行数据
    // 开发的时候不利于读, 所以格式化成缩进 2 个空格的形式
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

// 从文件中读取数据, 并且转成 JSON 形式(即 object 或者 array)
// path 是保存文件的路径
const load = (path) => {
    // 指定 encoding 参数
    const options = {
        encoding: 'utf8',
    }
    // 读取之前确保文件已经存在, 这样不会报错
    ensureExists(path)
    const s = fs.readFileSync(path, options)
    const data = JSON.parse(s)
    return data
}

// 定义一个 Model 类来处理数据相关的操作
// Model 是基类, 可以被其他类继承
class Model {
    // dbPath 方法返回 db 文件的路径
    static dbPath() {
        const classname = this.name.toLowerCase()
        // db 的文件名通过这样的方式与类名关联在一起
        const path = `${classname}.txt`
        return path
    }
    static all() {
        // 先获取文件路径
        const path = this.dbPath()
        const models = load(path)
        // map 是 es5 里新增的方法, 可以方便地遍历数组
        const ms = models.map((item) => {
            const cls = this
            const instance = cls.create(item)
            return instance
        })
        return ms
    }
    static create(form={}) {
        const cls = this
        const instance = new cls(form)
        return instance
    }
    save() {
        // 实例方法中的 this 指向的是实例本身, 也就是 new 出来的那个对象
        // this.constructor 是指类
        const cls = this.constructor
        // 先获取 Model 的所有实例, 是一个数组
        const models = cls.all()
        // 然后把当前实例添加到 models 中, 接着保存到文件中
        models.push(this)
        const path = cls.dbPath()
        // 这个 save 函数是 save 文件的函数, 而不是当前这个实例方法
        save(models, path)
    }
    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}

// 以下两个类用于实际的数据处理
// 因为继承了 Model 类
// 所以可以直接 save load
class User extends Model {
    constructor(form={}) {
        // 继承的时候, 要先调用 super 方法, 才可以使用 this
        super()
        // User 类定义两个属性
        this.username = form.username || ''
    }
    static create(form={}) {
        // 这里的 this 就是当前这个类，也就是 User
        const cls = this
        const instance = new cls(form)
        return instance
    }
    validateLogin() {
        const phoneNumber = this.username
        if(!(/^1[34578]\d{9}$/.test(phoneNumber))){
            return false;
        } else {
            return true
        }
    }
}

class Customers extends Model {
    constructor(form={}) {
        super()
        this.phoneNumbers = form.phoneNumbers || ''
        this.clothesNumbers = form.clothesNumbers || ''
    }

    static create(form={}) {
        const cls = this
        const instance = new cls(form)
        return instance
    }

    // 校验登录的逻辑
    validateLogin() {
        const phoneNumber = this.phoneNumbers
        if(!(/^1[34578]\d{9}$/.test(phoneNumber)) && this.clothesNumbers == 0){
            return false;
        } else {
            return true
        }
    }
}

const form = {
    'phoneNumbers': 15184456264,
    'clothesNumbers': 20
}

module.exports = {
    User: User,
    Customers: Customers
}

