import React, { useState } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import Ruler from '@scena/ruler'
import { Upload } from 'antd'
import './CustomUpload.scss'

const { Dragger } = Upload
const CustomUpload = props => {
    const { onChange } = props
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    // 上传文件改变时的回调
    function handleChange(info) {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return
        }
        if (info.file.status === 'done' || info.file.status === 'error') {
            setLoading(false)
            const url = URL.createObjectURL(info.file.originFileObj)
            const image = new Image()
            image.src = url
            image.onload = () => {
                onChange &&
                    onChange({
                        url,
                        width: image.width,
                        height: image.height,
                    })
            }

            setImageUrl(url)
        }
    }
    // 预览图
    const uploadButton = (
        <div className='center'>
            {loading ? (
                <LoadingOutlined style={{ fontSize: 24 }} />
            ) : (
                <PlusOutlined style={{ fontSize: 24 }} />
            )}
            <div style={{ marginTop: 8 }}>支持点击或拖拽上传</div>
        </div>
    )

    return (
        <div className='upload'>
            {!imageUrl && (
                <Dragger
                    className='upload-dragger'
                    onChange={handleChange}
                    listType='picture-card'
                    showUploadList={false}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt='avatar'
                            style={{ width: '100%' }}
                        />
                    ) : (
                        uploadButton
                    )}
                </Dragger>
            )}
        </div>
    )
}

export default CustomUpload
