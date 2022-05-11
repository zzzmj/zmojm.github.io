import React, { useEffect } from 'react'
import { Button, Form, Input, Select } from 'antd'

const { Option } = Select
import './SearchForm.scss'

const SearchForm = props => {
    const [form] = Form.useForm()

    const handleSelectChange = (type, value) => {
        form.setFieldsValue({
            [type]: value,
        })
    }
    const onFinish = values => {
        props.onChange && props.onChange(values)
    }
    return (
        <div className='yryr-form-wrap'>
            <Form
                // {...formItemLayout}
                // labelAlign={'right'}
                className='search-form'
                layout='inline'
                form={form}
                // name='dynamic_form_nest_item'
                onFinish={onFinish}
                autoComplete='off'
            >
                <Form.Item name='title' label='文章标题'>
                    <Input />
                </Form.Item>
                {/* 
                <Form.Item name='source' label='语料来源'>
                    <Select onChange={handleSelectChange} allowClear>
                        <Option value='BLCU'>hsk动态作文语料库</Option>
                        <Option value='SYSU'>
                            中山大学汉字偏误中介语语料库
                        </Option>
                    </Select>
                </Form.Item> */}
                <Form.Item name='score' label='汉语水平'>
                    <Select onChange={handleSelectChange} allowClear>
                        <Option value='mid'>中级</Option>
                        <Option value='high'>高级</Option>
                    </Select>
                </Form.Item>
                <Form.Item name='nationality' label='母语'>
                    <Select onChange={handleSelectChange} allowClear>
                        <Option value='korea'>韩语</Option>
                        <Option value='britain'>英语</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        搜索
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default SearchForm
