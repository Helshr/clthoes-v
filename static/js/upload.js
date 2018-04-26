const upLoadImg = document.querySelector('#upload-image')
const bigShowImg = e('#div-show-clothes')

upLoadImg.addEventListener('change', (event) => {
    event.preventDefault()

    const divChooseImg = document.querySelector('#upload-choose-img')

    const file = upLoadImg.files[0]
    log('file: ', file)
    const reader = new FileReader()
    //读取file文件；
    reader.readAsDataURL(file)
    //当文件读取成功后，将结果保存到url变量里；
    reader.onload = function(e) {
        let url = e.target.result

        const c = divChooseImg.children[1]
        log('c: ', typeof c)

        if (c === undefined) {
            log('不存在节点, 要创造一个 img')
            let s = `<img class="show-upload" id="div2" draggable="true" src="${url}" alt="">`
            bigShowImg.insertAdjacentHTML('afterend', s)
        } else {
            log('存在一个 img, 修改 src')
            const showUpload = document.querySelector('.show-upload')
            showUpload.src = url
        }
        drag('#div2')
    }
})



