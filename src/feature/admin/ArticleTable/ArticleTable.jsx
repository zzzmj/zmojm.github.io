import React, { useEffect, useState } from 'react'
import { Table, Space, message } from 'antd'
import { getArticleFromLeanCloud } from '../../../service/article'
const columns = [
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: text => <a>{text}</a>,
    },
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '国籍',
        dataIndex: 'nationality',
        key: 'nationality',
    },
    {
        title: '汉语水平',
        dataIndex: 'score',
        key: 'score',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size='middle'>
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
]

const ArticleTable = props => {
    const [dataList, setDataList] = useState([])

    const getArticle = () => {
        getArticleFromLeanCloud().then(
            res => {
                const data = res.map(item => {
                    return {
                        objectId: item.id,
                        article: item.get('article'),
                        nationality: item.get('nationality'),
                        score: item.get('score'),
                        title: item.get('title'),
                    }
                })
                console.log('dataList', data)
                setDataList(data)
            },
            () => {
                message.error('获取文章失败')
            }
        )
    }
    useEffect(() => {
        getArticle()
    }, [])
    return <Table columns={columns} dataSource={dataList} />
}

export default ArticleTable
