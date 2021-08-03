import React, { useState } from 'react'
import { Button, Form, Modal, Input, Row, Col, Select, message } from 'antd'
import {
    MinusCircleOutlined,
    PlusOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
    changeCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from './HeaderSlice'
import { mapColorToHex, presetColor } from '../../utils'
import { useEffect } from 'react'
import {
    getConfigFromLeanCloud,
    updateConfigToLeanCloud,
} from '../../service/service'
import './Header.scss'

const { Option } = Select
const objectId = '610291721de21d3e072c5432'
const EditCategoryModal = props => {
    const { visible, onOk, onCancel } = props
    const [loading, setLoading] = useState(false)
    const disptach = useDispatch()
    //
    const categoryList = useSelector(state => state.header.categoryList)
    const header = useSelector(state => state.header)
    console.log('**categoryList', categoryList, header)
    const handleEdit = () => {
        setLoading(true)
        console.log('更新的对象', categoryList)
        updateConfigToLeanCloud(objectId, {
            categoryList: categoryList,
        })
            .then(res => {
                setLoading(false)
                message.success('上传成功')
                onOk && onOk()
            })
            .catch(() => {
                setLoading(false)
                message.error('上传失败')
            })
    }

    const handleCancel = () => {
        onCancel && onCancel()
    }

    useEffect(() => {
        getConfigFromLeanCloud(objectId).then(res => {
            const list = res.get('categoryList')
            // 更新到redux中
            disptach(updateCategory(list))
        })
    }, [])

    const handleAdd = () => {
        disptach(createCategory())
    }

    const handleChange = ({ id, value, name }) => {
        disptach(
            changeCategory({
                id,
                value,
                name,
            })
        )
    }

    const handleDelete = id => {
        Modal.confirm({
            title: '删除',
            icon: <ExclamationCircleOutlined />,
            content: '删除该标注后，曾经使用过该标注的数据无法正确显示',
            okText: '确认',
            cancelText: '取消',
            onCancel: () => {
                console.log('取消')
            },
            onOk: () => {
                disptach(deleteCategory(id))
                console.log('删除', id)
            },
        })
    }

    return (
        <Modal
            title='编辑配置'
            okText='上传'
            cancelText='取消'
            confirmLoading={loading}
            visible={visible}
            onOk={handleEdit}
            width={800}
            onCancel={handleCancel}
        >
            <Form layout={'inline'}>
                {categoryList.map((item, index) => {
                    const { id, text, color, type } = item
                    return (
                        <Row style={{ marginBottom: 30 }} key={id}>
                            <Col>
                                <Form.Item label='标注颜色'>
                                    <Select
                                        value={color}
                                        style={{ width: 120 }}
                                        onChange={value =>
                                            handleChange({
                                                id,
                                                value,
                                                name: 'color',
                                            })
                                        }
                                    >
                                        {presetColor.map((item, index) => {
                                            const { key, label } = item
                                            return (
                                                <Option key={index} value={key}>
                                                    {label}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <div
                                        style={{
                                            marginTop: 5,
                                            borderRadius: 3,
                                            height: 20,
                                            backgroundColor:
                                                mapColorToHex[color],
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label='标注文案'>
                                    <Input
                                        value={text}
                                        onChange={e =>
                                            handleChange({
                                                id,
                                                value: e.target.value,
                                                name: 'text',
                                            })
                                        }
                                        placeholder='请输入标注的文案'
                                    />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label='批注类型'>
                                    <Select
                                        value={type}
                                        style={{ width: 120 }}
                                        onChange={value =>
                                            handleChange({
                                                id,
                                                value,
                                                name: 'type',
                                            })
                                        }
                                    >
                                        <Option value='accept'>正确类型</Option>
                                        <Option value='wrong'>错误类型</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                className='delete'
                            >
                                <MinusCircleOutlined
                                    onClick={() => handleDelete(item.id)}
                                />
                            </div>
                        </Row>
                    )
                })}
                <Button
                    type='dashed'
                    onClick={() => handleAdd()}
                    style={{ marginTop: 30 }}
                    icon={<PlusOutlined />}
                >
                    添加标注
                </Button>
            </Form>
        </Modal>
    )
}

export default EditCategoryModal
