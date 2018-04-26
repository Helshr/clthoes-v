const e = (selector) => {
    return document.querySelector(selector)
}

const log = console.log.bind(console)

// 为 ul列表绑定事件
const colorListEvent = () => {
    const colorList = document.querySelector('.ul-color-list')

    colorList.addEventListener('click', (event) => {
        const target = event.target
        const colorId = target.dataset.colorid
        // 取到点击 T恤的颜色
        // 并替换对应的 img标签
        const imgContent = e('.img-show-clothes')
        imgContent.src = `../static/img?file=${colorId}.png`
        // 增加 切换底部视图的功能
        const f = e('.img-show-clothes')
        const b = e('.img-show-backClothes')
        f.src = `../static/img?file=${colorId}.png`
        b.src = `../static/img?file=${colorId}-back.png`
    })
}

const submitEvent = () => {
    const b = e('.submit-style')
    b.addEventListener('click', () => {
        alert('请手动截图保存，存于手机后联系客服')
    })
}

const __main = () => {
    colorListEvent()
}

__main()
