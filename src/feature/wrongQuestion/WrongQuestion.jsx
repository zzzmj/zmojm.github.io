import React, { useState } from 'react'
import { Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
const { Dragger } = Upload

const WrongQuestion = () => {
    const [fileList, setFileList] = useState([])
    const [dataSource, setDataSource] = useState([])
    const props = {
        name: 'file',
        multiple: true,
        action: '',
        onChange(info) {
            const { status } = info.file
            window.file = info.file
            if (status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`)
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`)
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files)
        },
        beforeUpload: file => {
            setFileList([...fileList, file])
            const reader = new FileReader()

            reader.onload = e => {
                console.log(e.target.result)
                setDataSource(setDataSource)
            }
            reader.readAsText(file)
            return false
        },
    }

    return (
        <div className='wrong'>
            <div className='upload'>
                <Dragger {...props}>
                    <p className='ant-upload-drag-icon'>
                        <InboxOutlined />
                    </p>
                    <p className='ant-upload-text'>
                        Click or drag file to this area to upload
                    </p>
                    <p className='ant-upload-hint'>
                        Support for a single or bulk upload. Strictly prohibit
                        from uploading company data or other band files
                    </p>
                </Dragger>
                ,
            </div>
        </div>
    )
}

export default WrongQuestion
