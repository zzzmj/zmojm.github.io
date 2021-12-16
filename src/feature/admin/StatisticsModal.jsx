import React from 'react'
import { Modal } from 'antd'
import { useSelector } from 'react-redux'

const StatisticsModal = props => {
    const { visible, count, onOk, onCancel } = props
    //
    const config = useSelector(state => state.annotation.config)

    const handleEdit = () => {
        onCancel && onCancel()
    }

    const handleCancel = () => {
        console.log('？？？调用一下啊')
        onCancel && onCancel()
    }
    return (
        <Modal
            title='统计分析'
            okText='确定'
            cancelText='取消'
            visible={visible}
            onOk={handleEdit}
            width={800}
            onCancel={handleCancel}
        >
            <div>字数统计：{count}字</div>
        </Modal>
    )
}

export default StatisticsModal
