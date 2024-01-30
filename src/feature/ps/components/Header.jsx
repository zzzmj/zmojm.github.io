import { Button } from 'antd'
import React from 'react'
import './Header.scss'

const Header = () => {
    const clsPrefix = 'web-ps'
    // 下载完成后的回调
    const handleDownload = () => {
        // message.success('文件下载中，请稍候...')
        // setDownload(false)
    }

    const handleUpload = e => {
        console.log('上传的文件', e.target.files[0])
        // setFile(e.target.files[0])
    }
    return (
        <header className={`${clsPrefix}-header`}>
            <div className={`${clsPrefix}-header-logo`}>
                <img
                    src='https://ts.market.mi-img.com/thumbnail/png/q80/Finance/0b7e734633609440a360187ae22b9fa2d1bb63fd3'
                    alt=''
                />
                <span>切图工具</span>
            </div>

            <div className={`${clsPrefix}-header-action`}>
                <Button className={`${clsPrefix}-header-upload default-button`}>
                    点击上传
                    {/* <input onChange={handleUpload} type='file' name='' id='' /> */}
                </Button>
                <Button
                    onClick={handleDownload}
                    className={`${clsPrefix}-header-download primary-button`}
                >
                    下载
                </Button>
            </div>
        </header>
    )
}

export default Header
