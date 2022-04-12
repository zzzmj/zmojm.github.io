import React, { useState } from 'react'
import { Upload, message, Button, Divider } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import {
    addCategoryQuestion,
    addQuestion,
    existQuestion,
    getQuestionList,
} from '../../service/question'
import { addExam, getExamList } from '../../service/exam'
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

    const filterRepeatQuestion = async question => {
        let result = [1]
        let qs = question
        while (result.length > 0) {
            const ids = qs.map(item => item.id)
            result = await existQuestion(ids)
            const set = new Set()
            result.forEach(item => {
                set.add(item.toJSON().id)
            })
            // 去重，上传不重复的
            qs = qs
                .filter(item => !set.has(item.id))
                .map(item => {
                    return {
                        ...item,
                        shortSource: null,
                    }
                })
        }
        return qs
    }

    const handleUpload = async () => {
        const { category, question } = dataSource
        const result = await filterRepeatQuestion(question)
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
        if (result.length > 0) {
            addQuestion(result).then(
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

    // 上传训练题
    const handleUploadTrain = async () => {
        console.log('dataSource', dataSource)
        const question = dataSource
        const result = await getExamList()
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
        message.success(`重复题目：${question.length - questionData.length}`)
        if (questionData.length > 0) {
            addExam(questionData).then(
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
                        loading={uploading}
                        style={{ marginTop: 16 }}
                    >
                        上传错题
                    </Button>
                    <Divider />
                    <Button
                        type='primary'
                        onClick={handleUploadTrain}
                        loading={uploading}
                        style={{ marginTop: 16 }}
                    >
                        上传训练题
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default WrongQuestion
