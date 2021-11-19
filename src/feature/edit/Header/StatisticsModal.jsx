import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, Table, Select, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import './Header.scss'

const { Option } = Select
const objectId = '610291721de21d3e072c5432'
const StatisticsModal = props => {
    const { visible, onOk, onCancel } = props
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [dataSource, setDataSource] = useState([])
    //
    const config = useSelector(state => state.annotation.config)
    const annotationList = useSelector(state => state.annotation.annotationList)
    const categoryList = useSelector(state => state.header.categoryList)

    const handleEdit = () => {
        onCancel && onCancel()
    }

    const handleCancel = () => {
        console.log('？？？调用一下啊')
        onCancel && onCancel()
    }

    const columns = [
        {
            title: 'No.',
            dataIndex: 'No',
            key: 'No',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Count',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: 'Text',
            dataIndex: 'text',
            key: 'text',
            render: text => (
                <div>
                    {text.map((item, index) => {
                        return (
                            <div key={index}>
                                {index + 1}. {item}
                            </div>
                        )
                    })}
                </div>
            ),
        },
    ]

    useEffect(() => {
        if (visible && annotationList && annotationList.length > 0) {
            const obj = {}
            let No = 0
            annotationList.forEach((item, index) => {
                const { categoryId, text } = item
                if (obj[categoryId]) {
                    obj[categoryId].count = obj[categoryId].count + 1
                    obj[categoryId].text.push(text)
                } else {
                    const config = categoryList.find(i => i.id === categoryId)
                    const categoryName = config.text
                    obj[categoryId] = {
                        key: No,
                        No: No++,
                        name: categoryName,
                        text: [text],
                        count: 1,
                    }
                }
            })
            const statisticsData = Object.keys(obj).map(key => {
                const item = obj[key]
                return item
            })
            setDataSource(statisticsData)
        }
    }, [annotationList, visible, categoryList])

    console.log('annotationList', config)
    return (
        <Modal
            title='统计分析'
            okText='确定'
            cancelText='取消'
            confirmLoading={loading}
            visible={visible}
            onOk={handleEdit}
            width={800}
            onCancel={handleCancel}
        >
            <Table dataSource={dataSource} columns={columns} />;
        </Modal>
    )
}

export default StatisticsModal
