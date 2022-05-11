import React, { useEffect, useState } from 'react'
import { Table, Space, message, Button, Popconfirm } from 'antd'
import {
    deleteArticleToLeanCloud,
    getArticleFromLeanCloud,
    updateArticleToLeanCloud,
} from '../../../service/article'
import { useHistory } from 'react-router'
import SearchForm from './SearchForm'

const mapKeyToText = {
    BLCU: 'hsk动态作文语料库',
    SYSU: '中山大学汉字偏误中介语语料库',
    mid: '中级',
    high: '高级',
    korea: '韩语',
    britain: '英语',
}

const ArticleTable = props => {
    const { loading, dataSource, onUpdate } = props
    const [searchList, setSearchList] = useState(dataSource || [])
    const history = useHistory()
    const columns = [
        {
            title: 'No.',
            dataIndex: 'No',
            key: 'No',
        },
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
            title: '母语',
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
                    <a
                        onClick={() => handleEdit(record.objectId)}
                        type='primary'
                    >
                        标注
                    </a>
                    <a onClick={() => handleUpdate(record.objectId)}>编辑</a>
                    <Popconfirm
                        title='删除后无法恢复，请谨慎操作'
                        onConfirm={() => handleDelete(record.objectId)}
                    >
                        <a type='primary' danger>
                            删除
                        </a>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    useEffect(() => {
        setSearchList(dataSource)
    }, [dataSource])
    // const getArticle = () => {
    //     let count = 0
    //     getArticleFromLeanCloud().then(
    //         res => {
    //             const data = res.map((item, index) => {
    //                 return {
    //                     objectId: item.id,
    //                     No: index + 1,
    //                     ...item.toJSON(),
    //                 }
    //             })
    //             data.forEach(item => {
    //                 count += item.article.length
    //             })
    //             onChange && onChange(count)
    //             console.log('dataList', data)
    //             setDataList(data)
    //             setSearchList(data)
    //         },
    //         () => {
    //             message.error('获取文章失败')
    //         }
    //     )
    // }
    // useEffect(() => {
    //     getArticle()
    // }, [update])

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
                onUpdate && onUpdate()
            })
            .catch(() => {
                message.success('删除失败')
            })
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

    const handleUpdate = id => {
        props.onUpdate && props.onUpdate(id)
    }

    const handleUpp = async () => {
        const dataList = dataSource
        for (let i = 1; i < dataList.length; i++) {
            const article = dataList[i]
            console.log('article', article)
            const dd = {
                article: processText(article.article),
            }
            console.log('dd', dd)

            await updateArticleToLeanCloud(article.objectId, dd)
                .then(() => {
                    console.log('处理i', i, '成功')
                })
                .catch(() => {
                    console.log('处理i', i, '失败')
                })
        }
    }

    const handleSearch = formValues => {
        console.log('调用', formValues)
        const dataList = dataSource
        const newData = dataList.filter(item => {
            let flag = true
            Object.keys(formValues).forEach(key => {
                if (formValues[key] && formValues[key] !== item[key]) {
                    flag = false
                }
            })
            return flag
        })
        console.log('调用', newData)
        setSearchList(newData)
    }

    return (
        <div>
            {/* <Button onClick={handleUpp}> 批量更新</Button> */}
            <SearchForm onChange={handleSearch} />
            <Table
                loading={loading}
                bordered={true}
                columns={columns}
                dataSource={searchList}
                pagination={{
                    showTotal: total => `当前共有${total}条数据`,
                }}
            />
        </div>
    )
}

export default ArticleTable
