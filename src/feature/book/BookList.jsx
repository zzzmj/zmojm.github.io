import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useParams } from 'react-router'

import Answer from '../xingce/components/Answer'
import { getBookList } from '../../service/exam'
import QuestionItem from './components/QuestionItem'
import BookListOper from './components/BookListOper'
import SkeletonList from '../../components/SkeletonList/SkeletonList'
import './BookList.scss'
import useVisibleData from './hooks/useVisibleData'
import NotesEditor from './components/NotesEditor'
import { updateQuestionNotes } from '../../service/question'
import { message } from 'antd'

// 格式化数据源
const formatDataSource = dataSource => {
    const data = dataSource
        .map(item => item.toJSON())
        // 排序，按照题目做过的次数
        .sort((a, b) => b.questionMeta.totalCount - a.questionMeta.totalCount)
        // 选项栏布局
        .map(item => {
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
            return {
                ...item,
                layout,
            }
        })

    return data
}

// 格式化被选中的数据
const formatSelectedItem = (item, selectIndex) => {
    if (!selectIndex && selectIndex !== 0) {
        return {
            ...item,
            answerVisible: false,
            status: '',
            selectIndex: '',
        }
    }
    const choice = item.correctAnswer.choice
    let status = ''
    if (choice == selectIndex) {
        status = 'correct'
    } else {
        status = 'wrong'
    }
    return {
        ...item,
        answerVisible: true,
        status,
        selectIndex,
    }
}

// 2264418,2448379
const XingCeList = () => {
    const params = useParams()
    const [questionIds, setQuestionIds] = useState([])
    const [testCount, setTestCount] = useState(40)
    const [dataSource, setDataSource] = useState([])
    const [visibleIdList, setVisibleIdList] = useState([])

    // 笔记相关state
    const [notes, setNotes] = useState({
        id: '',
        content: '',
    })
    const [notesVisible, setNotesVisible] = useState(false)

    const { visibleData } = useVisibleData(dataSource, visibleIdList)

    useEffect(() => {
        const id = params.objectId
        if (id && id.includes(',')) {
            const qIds = id
                .split(',')
                .filter(item => item != '')
                .map(item => parseInt(item))
            setQuestionIds(qIds)
            console.log('长度', qIds.length)
        }
    }, [params])

    useEffect(() => {
        const data = window.localStorage.getItem('dataSource')
        if (data) {
            setDataSource(data)
        } else {
            getAllBookList(questionIds)
        }
    }, [questionIds])

    const getAllBookList = questionIds => {
        const requestList = []
        for (let i = 0; i < questionIds.length / 1000; i++) {
            const request = getBookList(questionIds, i * 1000)
            requestList.push(request)
        }
        Promise.all(requestList)
            .then(res => {
                const data = res.map(item => formatDataSource(item)).flat()
                setDataSource(data)
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const handleSelectOption = (item, index) => {
        const questionId = item.id
        const newDataSource = dataSource.map(item => {
            if (item.id === questionId) {
                return formatSelectedItem(item, index)
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
                return formatSelectedItem(item)
            } else {
                return item
            }
        })
        setDataSource(newDataSource)
    }

    const handleChangeCount = count => {
        setTestCount(count)
    }

    // 控制需要单独显示的题目
    const handleChangeIdList = value => {
        const qIds = value ? value.split(',') : []
        setVisibleIdList(qIds)
    }

    const handleNotesChange = data => {
        console.log('data', data)
        setNotes({
            id: data.objectId,
            content: data.notes || '',
        })
        setNotesVisible(true)
    }

    const handleNotesOk = content => {
        // 更新看看
        updateQuestionNotes(notes.id, content)
            .then(() => {
                getAllBookList(questionIds)
                setNotesVisible(false)
                message.success('更新成功')
            })
            .catch(() => {
                message.error('更新失败')
            })
    }

    const handleNotesCancel = () => {
        setNotesVisible(false)
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
            <BookListOper
                count={testCount}
                onChangeCount={handleChangeCount}
                onChangeIdList={handleChangeIdList}
            />
            <div className='wrap-print'>
                {visibleData.length <= 0 ? (
                    <SkeletonList count={10} />
                ) : (
                    <div className='list'>
                        {visibleData.map((item, index) => {
                            const clsItem = classNames({
                                question: true,
                                [item.status]: item.status,
                            })
                            return (
                                <div key={item.id} className='item-wrap'>
                                    {index % testCount === 0 && (
                                        <h2>
                                            练习题
                                            {parseInt(index / testCount) + 1}
                                        </h2>
                                    )}
                                    <div className='item'>
                                        <QuestionItem
                                            className={clsItem}
                                            data={item}
                                            index={index}
                                            layout={item.layout}
                                            onClick={handleSelectOption}
                                        />
                                        {item.answerVisible && (
                                            <Answer
                                                onChange={() =>
                                                    handleNotesChange(item)
                                                }
                                                onClose={() =>
                                                    handleClose(item)
                                                }
                                                data={item}
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <NotesEditor
                value={notes.content}
                visible={notesVisible}
                onOk={handleNotesOk}
                onCancel={handleNotesCancel}
            />
        </div>
    )
}

export default XingCeList
