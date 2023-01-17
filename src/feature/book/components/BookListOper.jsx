/**
 * 操作列表
 * 功能：
 * 1. 选择习题题量
 * 2. 过滤题目
 * 3. 答案验证
 */
import { Radio, Input, Modal } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import './BookListOper.scss'

function BookListOper(props) {
    const { filterIdList, onChange } = props
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [correctRate, setCorrectRate] = useState({
        left: '',
        right: '',
    })
    const [count, setCount] = useState(40)
    const [sortType, setSortType] = useState(1)
    const [filterIds, setFilterIds] = useState('')
    const [answer, setAnswer] = useState({
        key: '',
        value: '',
    })

    const handleChangeCount = e => {
        const value = e.target.value
        setCount(value)
    }
    const handleChangeSortType = e => {
        const value = e.target.value
        setSortType(value)
    }
    const handleChangeId = e => {
        const value = e.target.value
        setFilterIds(value)
    }

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        onChange &&
            onChange({
                count,
                filterIds,
                sortType,
                answer,
                correctRate,
            })
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleChangeAnswer = (e, key) => {
        const value = e.target.value
        setAnswer({
            ...answer,
            [key]: value,
        })
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
            >
                <div className='btn-list'>
                    <div className='item'>
                        <h3 className='label'>选择排序方式：</h3>
                        <Radio.Group
                            onChange={handleChangeSortType}
                            value={sortType}
                        >
                            <Radio value={1}>按默认顺序</Radio>
                            <Radio value={2}>按做题次数</Radio>
                            <Radio value={3}>按正确率正序</Radio>
                            <Radio value={4}>按正确率倒序</Radio>
                        </Radio.Group>
                    </div>
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
                        <Input
                            value={filterIdList}
                            placeholder='请筛选题目的id'
                            onChange={handleChangeId}
                        />
                    </div>
                    <div className='item'>
                        <h3 className='label'>根据正确率筛选题目：</h3>
                        <Input
                            value={correctRate.left}
                            placeholder='左区间'
                            onChange={e =>
                                setCorrectRate(v => ({
                                    ...v,
                                    left: e.target.value,
                                }))
                            }
                        />
                        <Input
                            value={correctRate.right}
                            placeholder='右区间'
                            onChange={e =>
                                setCorrectRate(v => ({
                                    ...v,
                                    right: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className='item'>
                        <h3 className='label'>验证答案：</h3>
                        <Input.Group compact>
                            <Input
                                type='number'
                                style={{ width: '20%' }}
                                onChange={e => handleChangeAnswer(e, 'key')}
                                placeholder='练习几？'
                            />
                            <Input
                                style={{ width: '80%' }}
                                onChange={e => handleChangeAnswer(e, 'value')}
                                defaultValue=''
                                placeholder='请输入答案，逗号分隔'
                            />
                        </Input.Group>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default BookListOper
