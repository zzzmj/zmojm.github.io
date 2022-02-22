import React, { useState } from 'react'
import { Upload, message, Button } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import {
    addCategoryQuestion,
    addQuestion,
    getQuestionList,
} from '../../service/question'
const { Dragger } = Upload

const WrongQuestion = () => {
    const [fileList, setFileList] = useState([])
    const [uploading, setUploading] = useState(false)
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
                console.log('是个啥呀？', JSON.parse(e.target.result))
                setDataSource(JSON.parse(e.target.result))
            }
            reader.readAsText(file)
            return false
        },
    }

    const handleUpload = async () => {
        const { category, question } = dataSource
        console.log(
            'category',
            dataSource.category,
            dataSource.question,
            Object.keys(dataSource)
        )
        // const test = [question[0], question[1]]
        const result = await getQuestionList()
        const set = new Set()
        result.forEach(item => {
            set.add(item.toJSON().id)
        })
        // 去重，上传不重复的
        const questionData = question
            .filter(item => !set.has(item.id))
            .map(item => {
                return {
                    ...item,
                    shortSource: null,
                }
            })
        addCategoryQuestion({
            content: category,
        }).then(
            res => {
                message.success('上传分类成功')
            },
            err => {
                message.error(err.error || '上传分类失败')
            }
        )
        if (questionData.length > 0) {
            addQuestion(questionData).then(
                res => {
                    message.success('上传题目成功')
                },
                err => {
                    message.error('上传题目失败')
                }
            )
        } else {
            message.error('没有新的数据')
        }
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
                <div className='upload-btn'>
                    <Button
                        type='primary'
                        onClick={handleUpload}
                        // disabled={fileList.length === 0}
                        loading={uploading}
                        style={{ marginTop: 16 }}
                    >
                        {uploading ? '上传成功' : '开始上传'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default WrongQuestion
