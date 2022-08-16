/**
 * 操作列表
 * 功能：
 * 1. 选择习题题量
 * 2. 过滤题目
 * 3. 提交测试成绩
 */
import { Radio, Input, Modal } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import './BookListOper.scss'

const TextArea = Input.TextArea
function BookListOper(props) {
    const { count, filterIdList } = props
    const [isModalVisible, setIsModalVisible] = useState(false)

    const handleChangeCount = e => {
        const value = e.target.value
        props.onChangeCount && props.onChangeCount(value)
    }
    const handleChangeId = e => {
        const value = e.target.value
        props.onChangeIdList && props.onChangeIdList(value)
    }

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }
    return (
        <div className='book-oper'>
            <SettingOutlined
                onClick={showModal}
                style={{
                    fontSize: 24,
                }}
            />
            <Modal
                title='操作'
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <div className='btn-list'>
                    <div className='item'>
                        <h3 className='label'>选择题量：</h3>
                        <Radio.Group onChange={handleChangeCount} value={count}>
                            <Radio value={10}>10题</Radio>
                            <Radio value={20}>20题</Radio>
                            <Radio value={30}>30题</Radio>
                            <Radio value={40}>40题</Radio>
                        </Radio.Group>
                    </div>
                    <div className='item'>
                        <h3 className='label'>筛选题目：</h3>
                        <TextArea
                            value={filterIdList}
                            rows={4}
                            placeholder='请筛选题目的id'
                            maxLength={6}
                            onChange={handleChangeId}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default BookListOper
