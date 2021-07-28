import React, { useState } from 'react'
import { Button, Form, Modal, Input, Row, Col, Select } from 'antd'
import './Header.scss'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { changeCategory, createCategory } from './HeaderSlice'
import { presetColor } from '../../utils'

const { Option } = Select
const EditCategoryModal = props => {
    const { visible, onOk, onCancel } = props
    const disptach = useDispatch()
    //
    const categoryList = useSelector(state => state.header.categoryList)
    const header = useSelector(state => state.header)
    console.log('**categoryList', categoryList, header)
    const handleEdit = () => {
        onOk && onOk()
    }

    const handleCancel = () => {
        onCancel && onCancel()
    }

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

    return (
        <Modal
            title='编辑配置'
            visible={visible}
            onOk={handleEdit}
            width={800}
            onCancel={handleCancel}
        >
            <Form layout={'inline'}>
                {categoryList.map(item => {
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
