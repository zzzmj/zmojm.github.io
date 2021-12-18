import Header from '../edit/Header/Header'
import React, { useCallback, useEffect, useState } from 'react'
import ArticleTable from './ArticleTable/ArticleTable'
import { CSVLink } from 'react-csv'
import { Button, Divider, message } from 'antd'
import AddModal from '../edit/SideBar/AddModal'
import './Admin.scss'
import StatisticsModal from './StatisticsModal'
import { getArticleFromLeanCloud } from '../../service/article'
import { getConfigFromLeanCloud } from '../../service/service'
// import { createArticle } from '../../service/article'

// 处理中山大学
const processText2 = str => {
    const el = document.createElement('div')
    el.innerHTML = str
    return (
        el.textContent
            .replace(/\n/g, '')
            .replace(/&/g, '')
            .replace(/@/g, '')
            // .replace(/([a-zA-Z])\w+/g, '')
            .replace(/<.>/g, '')
            .replace(/CZ|BZ|SBZ|BGFZ/g, '')
            .replace(/<>/g, '')
            .replace(/(【(.*?)】)/g, match => {
                return match[1]
            })
        // .replaceAll('。', '。</p><p>')
    )
}

const Admin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isStaticVisible, setIsStaticVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [articleList, setArticleList] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [CSVData, setCSVData] = useState([])
    const [CSVDataText, setCSVDataText] = useState([])
    const [articleId, setArticleId] = useState('')
    const [count, setCount] = useState(0)

    // const [text, setText] = useState('')
    const getArticle = useCallback(() => {
        let count = 0
        setLoading(true)
        getArticleFromLeanCloud().then(
            res => {
                const data = res.map((item, index) => {
                    return {
                        objectId: item.id,
                        No: index + 1,
                        ...item.toJSON(),
                    }
                })
                data.forEach(item => {
                    count += item.article.length
                })
                setCount(count)
                setArticleList(data)
                setLoading(false)
            },
            () => {
                setLoading(false)
                message.error('获取文章失败')
            }
        )
    }, [])

    const getCategory = useCallback(() => {
        getConfigFromLeanCloud('610291721de21d3e072c5432').then(res => {
            const list = res.get('categoryList')
            // 更新到redux中
            setCategoryList(list)
        })
    }, [])

    useEffect(() => {
        getArticle()
        getCategory()
    }, [getArticle, getCategory])

    useEffect(() => {
        const createCsvData = () => {
            const csv = articleList.map(article => {
                const anaphora = {}
                let count = 0
                if (article.annotation && article.annotation.length > 0) {
                    // 呵呵
                    article.annotation.forEach(anno => {
                        const category = categoryList.find(
                            item => item.id === anno.categoryId
                        )
                        if (anaphora[category.text]) {
                            anaphora[category.text] += 1
                        } else {
                            anaphora[category.text] = 1
                        }
                    })
                    count = article.annotation.length
                }
                const words = processText2(article.article)
                return {
                    No: article.No,
                    title: article.title,
                    nationality: article.nationality,
                    score: article.score,
                    source: article.source,
                    count: count,
                    words: words.length,
                    ...anaphora,
                }
            })
            return csv
        }
        const createCsvDataText = () => {
            const csv = articleList.map(article => {
                const anaphora = {}
                let count = 0
                if (article.annotation && article.annotation.length > 0) {
                    // 呵呵
                    article.annotation.forEach(anno => {
                        const category = categoryList.find(
                            item => item.id === anno.categoryId
                        )
                        if (anaphora[category.text]) {
                            const len = anaphora[category.text].length + 1
                            const text = `${len}.${anno.text}`
                            anaphora[category.text].push(text)
                        } else {
                            anaphora[category.text] = [`1.${anno.text}`]
                        }
                    })
                    count = article.annotation.length
                }
                Object.keys(anaphora).forEach(
                    key => (anaphora[key] = anaphora[key].join('\n'))
                )
                return {
                    No: article.No,
                    title: article.title,
                    nationality: article.nationality,
                    score: article.score,
                    source: article.source,
                    count: count,
                    ...anaphora,
                }
            })
            return csv
        }
        if (categoryList.length > 0 && articleList.length > 0) {
            const csv = createCsvData()
            const csvText = createCsvDataText()
            setCSVData(csv)
            setCSVDataText(csvText)
        }
    }, [categoryList, articleList])

    const handleUpload = () => {
        setIsModalVisible(true)
        setArticleId('')
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleOK = () => {
        setIsModalVisible(false)
        getArticle()
    }

    // const handleChange = cc => {
    //     setCount(cc)
    // }

    // 修改文章数据
    const handleUpdate = id => {
        //
        setIsModalVisible(true)
        setArticleId(id)
    }

    // const processText = str => {
    //     const el = document.createElement('div')
    //     el.innerHTML = str
    //     return el.textContent
    //         .replace(/\n/g, '')
    //         .replace(/&/g, '')
    //         .replace(/@/g, '')
    //         .replace(/([a-zA-Z])\w+/g, '')
    //         .replace(/<.>/g, '')
    //         .replace(/<>/g, '')
    //         .replace(/(\【(.*?)\】)/g, match => {
    //             return match[1]
    //         })
    // }

    // const handleUploadAll = async () => {
    //     const data = JSON.parse(text)
    //     const articles = data.articleLs
    //     const result = articles.map(article => {
    //         return {
    //             title: article.title,
    //             nationality: 'korea',
    //             article: article.content,
    //             source: 'SYSU',
    //             score: 'high',
    //         }
    //     })
    //     for (let i = 0; i < result.length; i++) {
    //         const el = result[i]
    //         await createArticle(el).then(
    //             res => {
    //                 message.success('添加成功')
    //             },
    //             err => {
    //                 message.error('添加失败')
    //             }
    //         )
    //         console.log('添加i', i, '成功')
    //     }
    // }

    // const handleChangeAll = e => {
    //     setText(e.target.value)
    // }

    return (
        <div className='yryr-admin'>
            <Header type='admin' />
            {/* <div style={{ margin: 50 }} className='test'>
                <TextArea value={text} onChange={handleChangeAll} />

                <Button type='secondary' onClick={handleUploadAll}>
                    批量上传
                </Button>
            </div> */}
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
                    <Divider type='vertical' />

                    <Button type='primary'>
                        <CSVLink filename={'anaphoric-data.csv'} data={CSVData}>
                            导出数据
                        </CSVLink>
                    </Button>
                    <Divider type='vertical' />

                    <Button type='primary'>
                        <CSVLink
                            filename={'anaphoric-data-text.csv'}
                            data={CSVDataText}
                        >
                            导出文本
                        </CSVLink>
                    </Button>
                </div>
                <ArticleTable
                    dataSource={articleList}
                    loading={loading}
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
