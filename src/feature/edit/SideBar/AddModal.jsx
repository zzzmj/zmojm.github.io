import React from 'react'
import { Form, Modal, Input, Select, Tooltip, message } from 'antd'
import { createArticle } from '../../../service/article'

const { Option } = Select
const { TextArea } = Input

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
}

const AddModal = props => {
    const { visible, onOk, onFail } = props
    const [form] = Form.useForm()

    const handleSelectChange = (type, value) => {
        form.setFieldsValue({
            [type]: value,
        })
    }

    const handleConfirm = () => {
        form.submit()
        props.onOk && props.onOk()
    }

    const handleClose = () => {
        props.onCancel && props.onCancel()
    }

    const onFinish = values => {
        createArticle(values).then(
            res => {
                handleClose()
                message.success('添加成功')
                onOk && onOk()
            },
            err => {
                message.error('添加失败')
                onFail && onFail()
            }
        )
        console.log('values', values)
    }
    return (
        <Modal
            title='添加文章'
            visible={visible}
            onOk={handleConfirm}
            onCancel={handleClose}
            okText='添加'
            cancelText='取消'
        >
            <Form
                {...formItemLayout}
                labelAlign={'right'}
                form={form}
                name='dynamic_form_nest_item'
                onFinish={onFinish}
                autoComplete='off'
            >
                <Form.Item
                    name='title'
                    label='文章标题'
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name='source'
                    label='语料来源'
                    rules={[{ required: true }]}
                >
                    <Select onChange={handleSelectChange} allowClear>
                        <Option value='BLCU'>hsk动态作文语料库</Option>
                        <Option value='SYSU'>
                            中山大学汉字偏误中介语语料库
                        </Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name='score'
                    label='汉语水平'
                    rules={[{ required: true }]}
                >
                    <Select onChange={handleSelectChange} allowClear>
                        <Option value='mid'>中级</Option>
                        <Option value='high'>高级</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name='nationality'
                    label='国籍'
                    rules={[{ required: true }]}
                >
                    <Select onChange={handleSelectChange} allowClear>
                        <Option value='korea'>韩国</Option>
                        <Option value='britain'>英国</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name='article'
                    label={
                        <Tooltip title='可以填入已标注的内容'>
                            <span>文章内容</span>
                        </Tooltip>
                    }
                    rules={[{ required: true }]}
                >
                    <TextArea rows={5} />
                </Form.Item>
                {/* <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        Submit
                    </Button>
                </Form.Item> */}
            </Form>
        </Modal>
    )
}

export default AddModal
