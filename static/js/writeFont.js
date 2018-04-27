const addFontBut = e('.add-font-btn')

// 找到添加文字按钮，并添加事件
addFontBut.addEventListener('click', () => {
    // 获取输入的文字， 并生产相应的 div， 显示到页面上
    const addFontInp = e('.font-value')
    const fontValue = addFontInp.value

    const t = template('div', 'upload-font', fontValue)
    const writeContent = e('#show-upload-font')
    writeContent.insertAdjacentHTML('beforeEnd', t)
    drag('.upload-font')
})

const template = (element, className, content) => {
    return `<${element} class="${className}" draggable="true">
                ${content}
            </${element}>`
}
