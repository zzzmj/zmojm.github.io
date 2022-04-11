import React, { useEffect, useState } from 'react'
import {
    Button,
    Cascader,
    Divider,
    Input,
    message,
    Modal,
    Tree,
    Form,
} from 'antd'
import {
    addCustomWrongQuestionCategory,
    getCustomWrongQuestionCategory,
} from '../../../service/question'

const { TextArea } = Input

// 分类树
const CategoryTree = props => {
    const [form] = Form.useForm()
    const [treeData, setTreeData] = useState([])
    const [cascaderOptions, setCascaderOptions] = useState([])
    const [inputValue, setInputValue] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [addModalVisible, setAddModalVisible] = useState(false)
    const onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info)
    }

    useEffect(() => {
        getCustomCategory()
    }, [])

    const getCustomCategory = () => {
        const getCascaderData = data => {
            const result = []
            for (let i = 0; i < data.length; i++) {
                let obj = {}
                const item = data[i]
                obj.label = item.title
                obj.value = item.key
                if (item.children) {
                    obj.children = getCascaderData(item.children)
                }
                result.push(obj)
            }
            return result
        }
        getCustomWrongQuestionCategory().then(res => {
            const data = res.toJSON().content
            setTreeData(data)
            setInputValue(JSON.stringify(data, null, 4))
            const result = getCascaderData(data)
            console.log('caD', result)
            setCascaderOptions(result)
        })
    }

    const onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info)
    }

    const handleOk = type => {
        if (type === 'category') {
            try {
                const data = JSON.parse(inputValue)
                addCustomWrongQuestionCategory({ content: data })
                    .then(() => {
                        setIsModalVisible(false)
                        getCustomCategory()
                        message.success('更新成功！')
                    })
                    .catch(() => {
                        message.error('更新失败！')
                    })
            } catch (error) {
                message.error('格式有误！')
            }
        } else {
            submitQuestion()
        }
    }

    const handleCancel = type => {
        if (type === 'category') {
            setIsModalVisible(false)
        } else {
            setAddModalVisible(false)
        }
    }

    const handleInputChange = e => {
        setInputValue(e.target.value)
    }

    const handleClickPractice = () => {
        setIsModalVisible(true)
    }

    const handleAddQuestion = () => {
        setAddModalVisible(true)
    }

    const submitQuestion = () => {
        console.log('form', form.getFieldsValue())
        const { question, category } = form.getFieldsValue()
        const qIds = question.split(',')
        // 取最后一位ID找
        const id = category[category.length - 1]
        const dfs = (data, objectId) => {
            const result = []
            for (let i = 0; i < data.length; i++) {
                let obj = {}
                const item = data[i]
                obj.title = item.title
                obj.key = item.key
                if (item.questionIds) {
                    obj.questionIds = item.questionIds
                }
                if (item.children) {
                    obj.children = dfs(item.children)
                }
                if (item.key === objectId) {
                    // 将题目添加进去
                    obj.questionIds = obj.questionIds.concat(qIds)
                }
                result.push(obj)
            }
            return result
        }
    }

    const onFinish = values => {
        console.log('values', values)
    }

    const handleClickPreview = () => {
        const { question } = form.getFieldsValue()
        window.open(
            `https://zmojm.github.io/build/index.html#/xingce/${question}`,
            '',
            'width=800,height=1000'
        )
    }

    return (
        <div className='category-tree'>
            <Tree
                checkable
                onSelect={onSelect}
                onCheck={onCheck}
                treeData={treeData}
            />
            <Divider />
            <Button onClick={handleClickPractice}>更新分类</Button>
            <Divider type='vertical' />
            <Button onClick={handleAddQuestion}>添加错题</Button>

            <Modal
                width={800}
                title='更新分类'
                visible={isModalVisible}
                onOk={() => handleOk('category')}
                onCancel={() => handleCancel('category')}
            >
                <TextArea
                    rows={20}
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </Modal>
            <Modal
                width={600}
                title='添加错题'
                visible={addModalVisible}
                onOk={() => handleOk('question')}
                onCancel={() => handleCancel('question')}
            >
                <Form
                    form={form}
                    name='basic'
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete='off'
                >
                    <Form.Item label='分类' name='category'>
                        <Cascader
                            options={cascaderOptions}
                            placeholder='Please select'
                        />
                    </Form.Item>

                    <Form.Item label='题目' name='question'>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={handleClickPreview}>预览</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default CategoryTree
