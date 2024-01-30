import React, { useEffect, useRef, useState } from 'react'
import CustomUpload from './components/CustomUpload'
import { message, Upload } from 'antd'
import './index.scss'
import { getImgScale, splitLength } from '../../utils'

const Cropper = props => {
    const { lineConfig } = props
    const imgRef = useRef(null)
    const wrapRef = useRef(null)
    const [xLine, setXLine] = useState([])
    const [yLine, setYLine] = useState([])
    const [imageInfo, setImageInfo] = useState('')
    const handleImageChange = info => {
        setImageInfo(info)
    }

    useEffect(() => {
        if (!lineConfig) return

        if (imageInfo) {
            containsSize()
        }
        if (lineConfig.row || lineConfig.col) {
            if (!imageInfo) {
                message.error('请上传图片！')
                return
            }
            const img = imgRef.current
            const width = img.offsetWidth
            const height = img.offsetHeight
            console.log('width', width, height)
            const x = splitLength(height, lineConfig.row)
            const y = splitLength(width, lineConfig.col)
            setXLine(x)
            setYLine(y)
        }
    }, [lineConfig, imageInfo])

    // 使图片自适应大小
    const containsSize = () => {
        const width = imageInfo.width
        const height = imageInfo.height
        console.log('w', height, width + 'px')
        imgRef.current.style.width = width + 'px'
        imgRef.current.style.height = height + 'px'
        console.log('wrapRef.current', wrapRef.current)
        const obj = {
            wrapWidth: wrapRef.current.offsetWidth,
            wrapHeight: wrapRef.current.offsetHeight,
            imgHeight: height,
            imgWidth: width,
        }
        const scale = getImgScale(obj)
        imgRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`
        console.log('scale', getImgScale(obj))
    }

    const updateLines = () => {
        // 更新线条位置
    }

    return (
        <div ref={wrapRef} className='cropper'>
            <CustomUpload onChange={handleImageChange} />
            <div ref={imgRef} className='preview'>
                <div className='img'>
                    {imageInfo && (
                        <img
                            draggable='false'
                            src={imageInfo.url}
                            alt='avatar'
                            style={{ width: '100%' }}
                        />
                    )}
                </div>
                {xLine.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className='line x-line'
                            style={{
                                top: item + 'px',
                                left: 0,
                            }}
                        ></div>
                    )
                })}

                {yLine.map((item, index) => {
                    console.log('item', item)
                    return (
                        <div
                            key={index}
                            className='line y-line'
                            style={{
                                top: 0,
                                left: item + 'px',
                            }}
                        ></div>
                    )
                })}
            </div>
        </div>
    )
}

export default Cropper
