import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Button, Input, List, message } from 'antd'
import './SideBar.scss'
import AddModal from './AddModal'
import { getArticleFromLeanCloud } from '../../../service/article'

const { Search } = Input

// 侧边栏
const SideBar = props => {
    const { className } = props
    const [dataList, setDataList] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)

    const prefix = 'zz-sidebar'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })

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

    const handleUpload = () => {
        setIsModalVisible(true)
    }
    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleSearch = () => {
        console.log('搜索')
    }

    return (
        <div className={cls}>
            <div className={`${prefix}-header`}>
                <div className='title'>全部文章</div>
                <div className='add'>
                    <Button type='secondary' onClick={handleUpload}>
                        上传文章
                    </Button>
                </div>
            </div>
            <div className={`${prefix}-input`}>
                <div className='input-group mb-3'>
                    <Search
                        placeholder='input search text'
                        onSearch={handleSearch}
                    />
                </div>
            </div>
            <List
                className={`${prefix}-list`}
                bordered
                dataSource={dataList}
                renderItem={item => (
                    <List.Item className={`${prefix}-list-item`}>
                        {item.title}
                    </List.Item>
                )}
            />
            <AddModal
                visible={isModalVisible}
                onOk={handleUpload}
                onCancel={handleCancel}
            />
        </div>
    )
}

export default SideBar
