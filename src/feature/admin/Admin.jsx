import Header from '../edit/Header/Header'
import React, { useState } from 'react'
import ArticleTable from './ArticleTable/ArticleTable'
import { Button, Divider, message } from 'antd'
import AddModal from '../edit/SideBar/AddModal'
import './Admin.scss'
import StatisticsModal from './StatisticsModal'
import TextArea from 'rc-textarea'
import { createArticle } from '../../service/article'

const Admin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isStaticVisible, setIsStaticVisible] = useState(false)
    const [updateArticle, setUpdateArticle] = useState(false)
    const [articleId, setArticleId] = useState('')
    const [count, setCount] = useState(0)

    const [text, setText] = useState('')

    const handleUpload = () => {
        setIsModalVisible(true)
        setArticleId('')
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleOK = () => {
        setIsModalVisible(false)
        setUpdateArticle(!updateArticle)
    }

    const handleChange = cc => {
        console.log('cc', cc)
        setCount(cc)
    }

    // 修改文章数据
    const handleUpdate = id => {
        //
        setIsModalVisible(true)
        setArticleId(id)
    }

    const processText = str => {
        const el = document.createElement('div')
        el.innerHTML = str
        return el.textContent
            .replace(/\n/g, '')
            .replace(/&/g, '')
            .replace(/@/g, '')
            .replace(/([a-zA-Z])\w+/g, '')
            .replace(/<.>/g, '')
            .replace(/<>/g, '')
            .replace(/(\【(.*?)\】)/g, match => {
                return match[1]
            })
    }

    const handleUploadAll = async () => {
        const data = JSON.parse(text)
        const articles = data.articleLs

        const result = articles.map(article => {
            return {
                title: article.title,
                nationality: 'britain',
                article: processText(article.content),
                source: 'SYSU',
                score: 'mid',
            }
        })
        for (let i = 0; i < result.length; i++) {
            const el = result[i]
            await createArticle(el).then(
                res => {
                    message.success('添加成功')
                },
                err => {
                    message.error('添加失败')
                }
            )
            console.log('添加i', i, '成功')
        }

        console.log('result', result)
    }

    const handleChangeAll = e => {
        setText(e.target.value)
    }

    return (
        <div className='yryr-admin'>
            <Header type='admin' />
            {/* <TextArea value={text} onChange={handleChangeAll} />

            <Button type='secondary' onClick={handleUploadAll}>
                批量上传
            </Button> */}
            <div className='main'>
                <div className='action'>
                    <Button type='secondary' onClick={handleUpload}>
                        上传文章
                    </Button>
                    <Divider type='vertical' />
                    <Button
                        type='primary'
                        onClick={() => setIsStaticVisible(true)}
                    >
                        整体统计
                    </Button>
                </div>
                <ArticleTable
                    update={updateArticle}
                    onChange={handleChange}
                    onUpdate={handleUpdate}
                />
            </div>

            <AddModal
                key={Date.now()}
                articleId={articleId}
                visible={isModalVisible}
                onOk={handleOK}
                onCancel={handleCancel}
            />
            <StatisticsModal
                visible={isStaticVisible}
                count={count}
                onCancel={() => setIsStaticVisible(false)}
            />
        </div>
    )
}

export default Admin
