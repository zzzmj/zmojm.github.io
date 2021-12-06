import React, { useEffect } from 'react'
import './test.scss'

const Test = () => {
    useEffect(() => {
        function remLayoutFn() {
            var oHtml = document.getElementsByTagName('html')[0]
            var iWidth = document.documentElement.clientWidth
            var defaultPercent = 100
            iWidth = iWidth > 1080 ? 1080 : iWidth
            var rootFontSize = iWidth / defaultPercent
            oHtml.style.fontSize = rootFontSize + 'px'
        }
        remLayoutFn()
        window.addEventListener('resize', remLayoutFn, false)

        const box = document.querySelector('.box')
        const wEl = document.querySelector('.width')
        const hEl = document.querySelector('.height')
        const { width, height } = box.getBoundingClientRect()
        wEl.innerHTML = `宽：${width}`
        hEl.innerHTML = `高：${height}`
    }, [])
    return (
        <div className='wrap'>
            <div className='box'></div>
            <div className='width'>宽：</div>
            <div className='height'>高：</div>
        </div>
    )
}

export default Test
