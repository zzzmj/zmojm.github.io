import React, { useEffect, useState } from 'react'
import { Table, Space, message, Button, Popconfirm } from 'antd'
import {
    deleteArticleToLeanCloud,
    getArticleFromLeanCloud,
} from '../../../service/article'
import { useHistory } from 'react-router'

const mapKeyToText = {
    BLCU: 'hsk动态作文语料库',
    SYSU: '中山大学汉字偏误中介语语料库',
    mid: '中级',
    high: '高级',
    korea: '韩国',
    britain: '英国',
}

const ArticleTable = props => {
    const { update, onChange } = props
    const [dataList, setDataList] = useState([])
    const history = useHistory()
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '语料来源',
            dataIndex: 'source',
            key: 'source',
            render: key => mapKeyToText[key] || key,
        },
        {
            title: '国籍',
            dataIndex: 'nationality',
            key: 'nationality',
            render: key => mapKeyToText[key] || key,
        },
        {
            title: '汉语水平',
            dataIndex: 'score',
            key: 'score',
            render: key => mapKeyToText[key] || key,
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
        let count = 0
        getArticleFromLeanCloud().then(
            res => {
                const data = res.map(item => {
                    return {
                        objectId: item.id,
                        ...item.toJSON(),
                    }
                })
                data.forEach(item => {
                    count += item.article.length
                })
                onChange && onChange(count)
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
    }, [update])

    const handleEdit = id => {
        history.push({
            pathname: `/edit/${id}`,
        })
    }
    const handleDelete = id => {
        console.log('删除功能', id)
        deleteArticleToLeanCloud(id)
            .then(() => {
                message.success('删除成功')
                getArticle()
            })
            .catch(() => {
                message.success('删除失败')
            })
    }

    return <Table bordered={true} columns={columns} dataSource={dataList} />
}

export default ArticleTable
