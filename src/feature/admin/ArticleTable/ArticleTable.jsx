import React, { useEffect, useState } from 'react'
import { Table, Space, message, Button, Popconfirm } from 'antd'
import { getArticleFromLeanCloud } from '../../../service/article'
import { useHistory } from 'react-router'

const ArticleTable = props => {
    const [dataList, setDataList] = useState([])
    const history = useHistory()
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
            title: '标注数量',
            dataIndex: 'annotationCount',
            key: 'annotationCount',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size='middle'>
                    <Button
                        onClick={() => handleEdit(record.objectId)}
                        type='primary'
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title='删除后无法恢复，请谨慎操作'
                        onConfirm={() => handleDelete(record.objectId)}
                    >
                        <Button type='primary' danger>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]
    const getArticle = () => {
        getArticleFromLeanCloud().then(
            res => {
                const data = res.map(item => {
                    return {
                        objectId: item.id,
                        ...item.toJSON(),
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

    const handleEdit = id => {
        history.push({
            pathname: `/edit/${id}`,
        })
    }
    const handleDelete = id => {
        console.log('删除功能', id)
    }

    return <Table bordered={true} columns={columns} dataSource={dataList} />
}

export default ArticleTable
