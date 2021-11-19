import Header from '../edit/Header/Header'
import React, { useState } from 'react'
import ArticleTable from './ArticleTable/ArticleTable'
import { Button, Divider } from 'antd'
import AddModal from '../edit/SideBar/AddModal'
import './Admin.scss'
import StatisticsModal from './StatisticsModal'

const Admin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isStaticVisible, setIsStaticVisible] = useState(false)
    const [updateArticle, setUpdateArticle] = useState(false)
    const [articleId, setArticleId] = useState('')
    const [count, setCount] = useState(0)

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

    return (
        <div className='yryr-admin'>
            <Header type='admin' />
            <div className='main'>
                <div className='action'>
                    <Button type='secondary' onClick={handleUpload}>
                        上传文章
                    </Button>
                    <Divider type='vertical' />
                    <Button
                        type='secondary'
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
