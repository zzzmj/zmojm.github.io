import React, { useCallback, useEffect, useState } from 'react'
// import { SketchField, Tools } from 'react-sketch'
import { message, Modal } from 'antd'
import Answer from '../xingce/components/Answer'
import { getBookList } from '../../service/exam'
import QuestionItem from './components/QuestionItem'
import BookListOper from './components/BookListOper'
import SkeletonList from '../../components/SkeletonList/SkeletonList'
import useVisibleData from './hooks/useVisibleData'
import NotesEditor from './components/NotesEditor'
import { updateQuestionNotes } from '../../service/question'
import useQuestionIds from './hooks/useQuestionIds'
import './BookList.scss'
import useDeviceInfo from './hooks/useDeviceInfo'
import { getParams } from '../../utils'

// 格式化数据源
const formatDataSource = (dataSource, isMobile) => {
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

            if (isMobile) {
                layout = 'one'
            }
            return {
                ...item,
                layout,
            }
        })
    console.log('data', data)
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

const XingCeList = () => {
    const [exerTitle, setExerTitle] = useState('')
    const [testCount, setTestCount] = useState(40)
    const [dataSource, setDataSource] = useState([])
    const [visibleIdList, setVisibleIdList] = useState([])

    // 笔记相关state
    const [notes, setNotes] = useState({
        id: '',
        content: '',
    })
    const [notesVisible, setNotesVisible] = useState(false)
    const { isMobile } = useDeviceInfo()
    const { visibleData } = useVisibleData(dataSource, visibleIdList)
    const { questionIds } = useQuestionIds()

    const getAllBookList = useCallback(
        questionIds => {
            const requestList = []
            for (let i = 0; i < questionIds.length / 1000; i++) {
                const request = getBookList(questionIds, i * 1000)
                requestList.push(request)
            }
            Promise.all(requestList)
                .then(res => {
                    const data = res
                        .map(item => formatDataSource(item, isMobile))
                        .flat()
                    setDataSource(data)
                })
                .catch(err => {
                    console.log('err', err)
                })
        },
        [isMobile]
    )

    useEffect(() => {
        const title = getParams('title')
        title && setExerTitle(title)
        document.title = title
    }, [])

    useEffect(() => {
        const data = window.localStorage.getItem('dataSource')
        if (data) {
            setDataSource(data)
        } else {
            getAllBookList(questionIds)
        }
    }, [questionIds, getAllBookList])

    const handleSelectOption = (item, index) => {
        // console.log('is', isMobile)
        // if (isMobile) return
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

    const handleChangeOper = data => {
        const { count, filterIds, answer } = data
        setTestCount(count)
        const qIds = filterIds ? filterIds.split(',') : []
        setVisibleIdList(qIds)

        // 验证答案
        const { key, value } = answer
        const left = (key - 1) * count
        getAnswer(left, value)
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
        const zql = parseInt((count * 100) / arr.length)
        const ct = wrong.join(', ')
        const zqda = answer
            .slice(left, arr.length + left)
            .map((item, index) => {
                if (index % 5 === 0) {
                    return ' ' + String.fromCharCode(item + 64)
                } else {
                    return String.fromCharCode(item + 64)
                }
            })
            .join('')
        Modal.success({
            title: '答案验证结果',
            content: (
                <div>
                    <p>正确率：{zql}%</p>
                    <p>错题：{ct}</p>
                    <p>正确答案：{zqda}</p>
                </div>
            ),
        })
    }

    window.getAnswer = getAnswer

    return (
        <div className='book-wrap'>
            <BookListOper onChange={handleChangeOper} />
            <div className='wrap-print'>
                {visibleData.length <= 0 ? (
                    <SkeletonList count={10} />
                ) : (
                    <div className='list'>
                        {visibleData.map((item, index) => {
                            return (
                                <div key={item.id} className='item-wrap'>
                                    {index % testCount === 0 && (
                                        <h2>
                                            {exerTitle
                                                ? exerTitle
                                                : ` 练习题${
                                                      parseInt(
                                                          index / testCount
                                                      ) + 1
                                                  }`}
                                        </h2>
                                    )}
                                    <div className='item'>
                                        <QuestionItem
                                            status={item.status}
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
            {/* <SketchField
                width='1024px'
                height='768px'
                tool={Tools.Pencil}
                lineColor='black'
                lineWidth={3}
            /> */}
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
