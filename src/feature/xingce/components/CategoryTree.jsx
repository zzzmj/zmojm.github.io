import React, { useEffect, useState } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
    Button,
    Cascader,
    Divider,
    Input,
    message,
    Modal,
    Tree,
    Form,
    Skeleton,
} from 'antd'
import {
    addCustomWrongQuestionCategory,
    getCustomWrongQuestionCategory,
} from '../../../service/question'
import lodash from 'lodash'
import { useNavigate } from 'react-router-dom'

const { TextArea } = Input
const { confirm } = Modal

// 分类树
const CategoryTree = props => {
    const history = useNavigate()
    const [form] = Form.useForm()
    const [treeData, setTreeData] = useState([])
    const [showData, setShowData] = useState([])
    const [cascaderOptions, setCascaderOptions] = useState([])
    const [inputValue, setInputValue] = useState()
    const [deleteInputValue, setDeleteInputValue] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [addModalVisible, setAddModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [checkedQuestionIds, setCheckedQuestionIds] = useState([])
    /**
     * 17:10 (33) 17:38
     * 12212 13142 33412 12312 42214 43433 21321 33244
     */
    const onSelect = (selectedKeys, info) => {
        const selectedKey = selectedKeys[selectedKeys.length - 1]
        console.log('selected', selectedKey, info)
        const qIds = []
        info.checkedNodes.forEach(item => {
            qIds.push(...item.questionIds)
        })
        setCheckedQuestionIds(qIds)
        console.log('qIDs', qIds)
    }

    useEffect(() => {
        getCustomCategory()
    }, [])

    useEffect(() => {
        setInputValue(JSON.stringify(treeData, null, 4))

        //
        const getQuestionIdCount = treeNode => {
            if (!treeNode) return 0
            let count = 0
            treeNode.forEach(item => {
                count += item.questionIds.length
                if (item.children) {
                    count += getQuestionIdCount(item.children)
                }
            })
            return count
        }

        const dfs = data => {
            const result = []
            for (let i = 0; i < data.length; i++) {
                let obj = {}
                const item = data[i]
                const count =
                    item.questionIds.length + getQuestionIdCount(item.children)
                obj.title = (
                    <div style={{ display: 'flex' }} className='tree-title'>
                        <div className='name'>{item.title}</div>
                        <div
                            style={{
                                marginLeft: '30px',
                                fontSize: '12px',
                                color: '#5f6368',
                            }}
                            className='num'
                        >
                            {`${count}题`}
                        </div>
                    </div>
                )
                obj.key = item.key
                if (item.questionIds) {
                    obj.questionIds = item.questionIds
                }
                if (item.children) {
                    obj.children = dfs(item.children)
                }
                result.push(obj)
            }
            return result
        }
        const newShowData = dfs(treeData)
        setShowData(newShowData)
    }, [treeData])

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
            const result = getCascaderData(data)
            console.log('caD', result)
            setCascaderOptions(result)
        })
    }

    const onCheck = (selectedKeys, info) => {
        const qIds = []
        info.checkedNodes.forEach(item => {
            qIds.push(...item.questionIds)
        })
        setCheckedQuestionIds(qIds)
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
        } else if (type === 'question') {
            submitQuestion()
        } else if (type === 'delete') {
            deleteQuestion()
        }
    }

    const handleCancel = type => {
        if (type === 'category') {
            setIsModalVisible(false)
        } else {
            form.resetFields()
            setAddModalVisible(false)
        }
    }

    const handleInputChange = e => {
        setInputValue(e.target.value)
    }

    const handleClickPractice = () => {
        history(`/book/${checkedQuestionIds.toString()},`)
    }

    const handleClickCategory = () => {
        setIsModalVisible(true)
    }

    const handleAddQuestion = () => {
        setAddModalVisible(true)
    }

    const handleDeleteQuestion = () => {
        setDeleteModalVisible(true)
    }

    const submitQuestion = () => {
        console.log('form', form.getFieldsValue())
        form.validateFields()
            .then(res => {
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
                            obj.children = dfs(item.children, objectId)
                        }
                        if (item.key == objectId) {
                            // 取交集
                            const interArr = lodash.intersection(
                                obj.questionIds,
                                qIds
                            )
                            console.log(
                                'obj.questionIds,',
                                obj.questionIds,
                                qIds
                            )
                            if (interArr.length > 0) {
                                message.error(
                                    `您添加的部分题目已存在， ${interArr.toString()}`
                                )
                            } else {
                                // 将题目添加进去
                                const newQuestionIds =
                                    obj.questionIds.concat(qIds)
                                obj.questionIds = newQuestionIds
                            }
                            console.log('添加题目所在的ITEM', item)
                        }
                        result.push(obj)
                    }
                    return result
                }

                const newData = dfs(treeData, id)
                // 前后有变化才更新
                if (!lodash.isEqual(newData, treeData)) {
                    addCustomWrongQuestionCategory({ content: newData })
                        .then(() => {
                            setIsModalVisible(false)
                            getCustomCategory()
                            message.success(
                                `添加成功！共添加${
                                    qIds.length
                                }道题，${qIds.toString()}`
                            )
                        })
                        .catch(() => {
                            message.error('添加失败！')
                        })
                }
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const deleteQuestion = () => {
        const deleteIds = deleteInputValue.split(',')
        if (deleteIds.length <= 0) {
            message.error('请输入正确格式')
            return
        }
        const dfs = (data, deleteIds, arr) => {
            const result = []
            for (let i = 0; i < data.length; i++) {
                let obj = {}
                const item = data[i]
                obj.title = item.title
                obj.key = item.key
                if (item.questionIds) {
                    // 过滤掉数组中包含deleteIds的元素
                    const newIds = lodash.without(
                        item.questionIds,
                        ...deleteIds
                    )
                    if (newIds.length !== item.questionIds.length) {
                        // 求交集，看哪个元素被删除了
                        const xorIds = lodash.xor(item.questionIds, newIds)
                        // 求并集
                        arr.push({
                            title: obj.title,
                            ids: xorIds,
                        })
                    }
                    obj.questionIds = newIds
                }
                if (item.children) {
                    obj.children = dfs(item.children, deleteIds, arr)
                }
                result.push(obj)
            }
            return result
        }
        // 删除信息
        let arr = []
        const newData = dfs(treeData, deleteIds, arr)
        console.log('newData', newData)
        console.log('treeData', treeData)
        if (arr.length > 0) {
            confirm({
                title: '您确定要删除这些题目吗?',
                icon: <ExclamationCircleOutlined />,
                content: (
                    <div>
                        {arr.map((item, index) => {
                            return (
                                <div key={index}>
                                    {item.title}: {item.ids.toString()}
                                </div>
                            )
                        })}
                    </div>
                ),
                onOk() {
                    addCustomWrongQuestionCategory({ content: newData })
                        .then(() => {
                            setDeleteModalVisible(false)
                            getCustomCategory()
                            message.success(`删除成功！`)
                        })
                        .catch(() => {
                            message.error('删除失败！')
                        })
                },
                onCancel() {
                    console.log('Cancel')
                },
            })
        } else {
            message.warn('没有找到该题！')
        }
    }

    const onFinish = values => {
        console.log('values', values)
    }

    const handleClickPreview = () => {
        const { question } = form.getFieldsValue()
        window.open(
            `https://zmojm.github.io/build/index.html#/book/${question},`,
            '',
            'width=800,height=1000'
        )
    }

    const handleDeletePreview = () => {
        window.open(
            `https://zmojm.github.io/build/index.html#/book/${deleteInputValue},`,
            '',
            'width=800,height=1000'
        )
    }

    return (
        <div className='category-tree'>
            {showData.length > 0 ? (
                <Tree
                    defaultExpandAll
                    checkable
                    onSelect={onSelect}
                    onCheck={onCheck}
                    treeData={showData}
                />
            ) : (
                <Skeleton />
            )}

            <Divider />
            <span>已勾选{checkedQuestionIds.length}题</span>
            <Divider type='vertical' />
            <Button onClick={handleClickPractice}>开始练习</Button>
            <Divider />
            <Button onClick={handleClickCategory}>更新分类</Button>
            <Divider type='vertical' />
            <Button onClick={handleAddQuestion}>添加错题</Button>
            <Divider type='vertical' />
            <Button danger onClick={handleDeleteQuestion}>
                删除
            </Button>

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
                okText='提交'
                okCancel='取消'
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
                    <Form.Item
                        label='分类'
                        name='category'
                        rules={[
                            {
                                required: true,
                                message: '请选择分类',
                            },
                        ]}
                    >
                        <Cascader
                            options={cascaderOptions}
                            placeholder='Please select'
                        />
                    </Form.Item>

                    <Form.Item
                        label='题目'
                        name='question'
                        rules={[
                            {
                                required: true,
                                message: '请输入题目',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={handleClickPreview}>预览</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                width={600}
                title='删除错题'
                visible={deleteModalVisible}
                okText='提交'
                okCancel='取消'
                onOk={() => handleOk('delete')}
                onCancel={() => setDeleteModalVisible(false)}
            >
                <Input
                    value={deleteInputValue}
                    onChange={e => setDeleteInputValue(e.target.value)}
                />
                <Divider />
                <Button onClick={handleDeletePreview}>预览</Button>
            </Modal>
        </div>
    )
}

export default CategoryTree
