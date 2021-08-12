import React, { useState } from 'react'
import classNames from 'classnames'
import { Modal, Button, Input, List } from 'antd'
import './SideBar.scss'

const { Search } = Input

const articleList = [
    {
        id: 'xx',
        name: '文章的标题哦',
    },
    {
        id: 'xx',
        name: '文章的标题哦',
    },
    {
        id: 'xx',
        name: '文章的标题哦',
    },
    {
        id: 'xx',
        name: '文章的标题哦',
    },
]

// 侧边栏
const SideBar = props => {
    const { className } = props
    const [isModalVisible, setIsModalVisible] = useState(false)

    const prefix = 'zz-sidebar'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })

    const handleUpload = () => {
        setIsModalVisible(true)
    }
    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleSearch = () => {}

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
                dataSource={articleList}
                renderItem={item => (
                    <List.Item className={`${prefix}-list-item`}>
                        {item.name}
                    </List.Item>
                )}
            />

            <Modal
                title='Basic Modal'
                visible={isModalVisible}
                onOk={handleUpload}
                onCancel={handleCancel}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    )
}

export default SideBar
