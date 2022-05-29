import React, { useEffect, useRef, useState } from 'react'
import { message, Modal, Skeleton } from 'antd'
import classNames from 'classnames'
import {
    getCategoryQuestion,
    getQuestionList,
    updateQuestionNotes,
} from '../../service/question'
import './XingCe.scss'
import { useParams } from 'react-router'
import Answer from './components/Answer'
import { getBookList, getExamList } from '../../service/exam'
import CollectIcon from './components/CollectIcon'
import { Editor } from '@tinymce/tinymce-react'
import {
    addCollect,
    deleteCollect,
    getCollectList,
} from '../../service/collect'

/**
 */
const XingCeList = () => {
    const editorRef = useRef(null)
    const params = useParams()
    const [activeNotes, setActiveNotes] = useState({})
    const [loading, setLoading] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [categoryList, setCategoryList] = useState([])
    const [collectMap, setCollectMap] = useState({})
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        getCategoryQuestion().then(res => {
            const data = res.toJSON().content
            setCategoryList(data)
        })

        getCollect()
    }, [])

    useEffect(() => {
        const getQuestionIds = (data, id, callback) => {
            for (let i = 0; i < data.length; i++) {
                const item = data[i]
                if (item.id == id) {
                    callback(item.questionIds)
                    return
                }
                if (item.children) {
                    getQuestionIds(item.children, id, callback)
                }
            }
        }
        const id = params.objectId
        if (id.includes(',')) {
            getQuestions()
        } else {
            if (categoryList.length > 0) {
                let questionIds = ''
                getQuestionIds(categoryList, id, res => {
                    questionIds = res
                })
                if (questionIds) {
                    getQuestionList(questionIds).then(res => {
                        const data = res.map(item => item.toJSON())
                        setDataSource(data)
                    })
                } else {
                    message.error('题目不存在')
                }
            }
        }
    }, [])

    const getQuestions = () => {
        const getAllData = async questionIds => {
            const examData = await getExamList(questionIds)
            const questionData = await getQuestionList(questionIds)
            const bookData = await getBookList(questionIds)
            const data = [
                ...examData.map(item => item.toJSON()),
                ...questionData.map(item => item.toJSON()),
                ...bookData.map(item => item.toJSON()),
            ]
            const result = []
            questionIds.forEach(qId => {
                const question = data.find(item => item.id === qId)
                if (question) {
                    result.push(question)
                }
            })
            return result
        }
        const id = params.objectId
        const questionIds = id
            .split(',')
            .filter(item => item != '')
            .map(item => parseInt(item))

        setLoading(true)
        getAllData(questionIds)
            .then(res => {
                setDataSource(res)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
    }

    const getCollect = () => {
        getCollectList().then(res => {
            const data = res.map(item => item.toJSON())
            const newMap = {}
            data.forEach(item => {
                newMap[item.id] = item.objectId
            })
            setCollectMap(newMap)
        })
    }

    const handleSelectOption = (item, index) => {
        const choice = item.correctAnswer.choice
        const questionId = item.id
        let status = ''
        if (choice == index) {
            status = 'correct'
        } else {
            status = 'wrong'
        }
        const newDataSource = dataSource.map(item => {
            if (item.id === questionId) {
                return {
                    ...item,
                    answerVisible: true,
                    status,
                    selectIndex: index,
                }
            } else {
                return item
            }
        })
        setDataSource(newDataSource)
    }

    const handleClose = item => {
        const questionId = item.id
        const newDataSource = dataSource.map(item => {
            if (item.id === questionId) {
                return {
                    ...item,
                    answerVisible: false,
                    status: '',
                    selectIndex: '',
                }
            } else {
                return item
            }
        })
        setDataSource(newDataSource)
    }

    const handleCollect = (item, checked) => {
        if (checked) {
            // 取消收藏
            const objectId = collectMap[item.id]
            console.log('objectId', objectId)
            deleteCollect(objectId)
                .then(() => {
                    message.success('取消收藏')
                    getCollect()
                })
                .catch(err => {
                    message.error('取消失败')
                })
        } else {
            // 点击收藏
            addCollect([{ id: item.id }])
                .then(() => {
                    //
                    message.success('收藏成功')
                    getCollect()
                })
                .catch(err => {
                    message.error('收藏失败')
                })
        }
    }

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        const content = editorRef.current.getContent()
        // 更新看看
        console.log('activeNotes.objectId', activeNotes.id)
        updateQuestionNotes(activeNotes.id, content)
            .then(res => {
                message.success('更新成功')
                getQuestions()
                setIsModalVisible(false)
            })
            .catch(err => {
                message.success('更新失败')
            })
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleNotesChange = data => {
        const { notes, objectId, id } = data
        setActiveNotes({
            id: objectId,
            notes,
        })
        console.log('data', data)
        setIsModalVisible(true)
        editorRef.current.setContent(notes || '')
    }
    const getAnswer = (left, stringArr) => {
        const answer = dataSource.map(
            item => parseInt(item.correctAnswer.choice) + 1
        )

        let pos = 0
        let count = 0
        let wrong = []
        let qIds = []
        let arr = stringArr.split('').filter(item => item != ' ')
        if (
            arr.includes('A') ||
            arr.includes('B') ||
            arr.includes('C') ||
            arr.includes('D')
        ) {
            arr = arr.map(item => item.charCodeAt() - 64)
            console.log('arr', arr)
        }
        for (let i = left; i < arr.length + left; i++) {
            const item = answer[i]
            const p = arr[pos]
            pos++
            if (item == p) {
                count++
            } else {
                wrong.push(i + 1)
                qIds.push(dataSource[i].id)
            }
        }
        console.log('正确率：', parseInt((count * 100) / arr.length))
        console.log('错题：', wrong.join(', '))
        console.log('题号：', qIds.join(', '))
    }
    window.getAnswer = getAnswer

    return (
        <div className='wrap'>
            <h2>错题整理</h2>
            <div className='wrap-print'>
                {loading ? (
                    <Skeleton />
                ) : (
                    <div className='list'>
                        {dataSource.map((item, index) => {
                            let layout = 'four'
                            // 任一选项文字长度超过10，则选择两栏布局
                            // 任一选项文字长度超过20，则选择一栏布局
                            // 否则使用四栏布局
                            const itemLength = []
                            item.accessories[0].options.forEach(item => {
                                itemLength.push(item.length)
                            })
                            const len = Math.max(...itemLength)
                            if (len >= 20) {
                                layout = 'one'
                            } else if (len > 10) {
                                layout = 'two'
                            }
                            const cls = classNames({
                                question: true,
                                [item.status]: item.status,
                            })
                            return (
                                <div key={item.id} className='item'>
                                    <div className={cls}>
                                        <span>{index + 1}.</span>
                                        <div className='content'>
                                            <div className='title'>
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.content,
                                                    }}
                                                ></span>
                                                {item.answerVisible && (
                                                    <CollectIcon
                                                        checked={
                                                            collectMap[item.id]
                                                        }
                                                        onClick={() =>
                                                            handleCollect(
                                                                item,
                                                                collectMap[
                                                                    item.id
                                                                ]
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>

                                            <div
                                                className={`options ${layout}`}
                                            >
                                                {item.accessories[0] &&
                                                    item.accessories[0].options.map(
                                                        (option, pos) => {
                                                            const mapIndexToLetter =
                                                                [
                                                                    'A',
                                                                    'B',
                                                                    'C',
                                                                    'D',
                                                                ]
                                                            let status =
                                                                pos ==
                                                                    item.selectIndex &&
                                                                item.status ==
                                                                    'correct'
                                                                    ? 'correct'
                                                                    : 'wrong'
                                                            const optionCls =
                                                                classNames({
                                                                    option: true,
                                                                    [status]:
                                                                        pos ===
                                                                        item.selectIndex,
                                                                })
                                                            return (
                                                                <div
                                                                    key={pos}
                                                                    onClick={() =>
                                                                        handleSelectOption(
                                                                            item,
                                                                            pos
                                                                        )
                                                                    }
                                                                    className={
                                                                        optionCls
                                                                    }
                                                                >
                                                                    <span className='num'>
                                                                        {
                                                                            mapIndexToLetter[
                                                                                pos
                                                                            ]
                                                                        }
                                                                        .
                                                                    </span>
                                                                    <span
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: option,
                                                                        }}
                                                                    ></span>
                                                                </div>
                                                            )
                                                        }
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    {item.answerVisible && (
                                        <Answer
                                            onChange={handleNotesChange}
                                            onClose={() => handleClose(item)}
                                            data={item}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <Modal
                forceRender={true}
                width={1000}
                title='编辑笔记'
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Editor
                    className='notes-editor'
                    onInit={(evt, editor) => {
                        setLoading(false)
                        editorRef.current = editor
                    }}
                    apiKey='24p0l3ih7zoyefn7sj47oxgrjz14zp69vuiyxo9tzk25oapj'
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist',
                            'autolink',
                            'lists',
                            'link',
                            'image',
                            'charmap',
                            'anchor',
                            'searchreplace',
                            'visualblocks',
                            'code',
                            'fullscreen',
                            'insertdatetime',
                            'media',
                            'table',
                            'preview',
                            'help',
                            'wordcount',
                        ],
                        toolbar:
                            'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style:
                            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    }}
                />
            </Modal>
        </div>
    )
}

export default XingCeList
