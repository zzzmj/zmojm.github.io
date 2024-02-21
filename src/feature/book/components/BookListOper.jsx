/**
 * 操作列表
 * 功能：
 * 1. 选择习题题量
 * 2. 过滤题目
 * 3. 答案验证
 */
import { Radio, Input, Modal, Switch } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import './BookListOper.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter } from '../BookSlice'
import { provinceList } from '../config'

function BookListOper(props) {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const count = useSelector(state => state.book.filter.count)
    const sortType = useSelector(state => state.book.filter.sortType)
    const createdTime = useSelector(state => state.book.filter.createdTime)
    const province = useSelector(state => state.book.filter.province)
    const dispatch = useDispatch()

    const handleChangeRadioValue = (type, value) => {
        dispatch(
            setFilter({
                type,
                value,
            })
        )
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
            <Modal title='操作' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <div className='btn-list'>
                    <div className='item'>
                        <h3 className='label'>选择排序方式：</h3>
                        <Radio.Group onChange={e => handleChangeRadioValue('createdTime', e.target.value)} value={sortType}>
                            <Radio value={1}>按默认顺序</Radio>
                            <Radio value={2}>按做题次数</Radio>
                            <Radio value={3}>按正确率正序</Radio>
                            <Radio value={4}>按正确率倒序</Radio>
                            <Radio value={5}>按创建时间</Radio>
                        </Radio.Group>
                    </div>
                    <div className='item'>
                        <h3 className='label'>选择题量：</h3>
                        <Radio.Group onChange={e => handleChangeRadioValue('createdTime', e.target.value)} value={count}>
                            <Radio value={10}>10题</Radio>
                            <Radio value={20}>20题</Radio>
                            <Radio value={30}>30题</Radio>
                            <Radio value={40}>40题</Radio>
                            <Radio value={50}>50题</Radio>
                            <Radio value={100}>100题</Radio>
                            <Radio value={200}>200题</Radio>
                            <Radio value={500}>500题</Radio>
                        </Radio.Group>
                    </div>
                    <div className='item'>
                        <h3 className='label'>创建时间：</h3>
                        <Radio.Group onChange={e => handleChangeRadioValue('createdTime', e.target.value)} value={createdTime}>
                            <Radio value={3}>三年内</Radio>
                            <Radio value={5}>五年内</Radio>
                            <Radio value={10}>十年内</Radio>
                            <Radio value={0}>不筛选</Radio>
                        </Radio.Group>
                    </div>
                    <div className='item'>
                        <h3 className='label'>省份</h3>
                        <Radio.Group onChange={e => handleChangeRadioValue('province', e.target.value)} value={province}>
                            {provinceList.map(p => {
                                return (
                                    <Radio key={p} value={p}>
                                        {p}
                                    </Radio>
                                )
                            })}
                        </Radio.Group>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default BookListOper
