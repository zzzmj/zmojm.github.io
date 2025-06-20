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
import { useDispatch, useSelector } from 'react-redux'
import { setList, updateList } from './BookSlice'
import { useLocation, useSearchParams } from 'react-router-dom'
import PieCharts from '../../components/PieChart'
import WordFrequency from './components/WordFrequency'

// 格式化数据源
export const formatDataSource = (dataSource, isMobile) => {
    const data = dataSource
        .map(item => item.toJSON())
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
    return data
}

// 格式化被选中的数据
export const formatSelectedItem = (item, selectIndex) => {
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

const prefixZero = number => {
    if (number < 10) return `00${number}`
    if (number < 100) return `0${number}`
    return number
}

const sleep = (timeout = 1000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}

const XingCeList = () => {
    const [exerTitle, setExerTitle] = useState('')
    const testCount = useSelector(state => state.book.filter.count)
    // 笔记相关state
    const [notes, setNotes] = useState({
        id: '',
        content: '',
    })
    const [notesVisible, setNotesVisible] = useState(false)
    const { isMobile } = useDeviceInfo()
    const filterDataList = useSelector(state => state.book.filterDataList)
    const sortedKeyPoints = useSelector(state => state.book.sortedKeyPoints)
    const { questionIds } = useQuestionIds()
    const dispatch = useDispatch()
    const bookType = getParams('type')

    const getAllBookList = useCallback(
        async questionIds => {
            const requestList = []
            const result = []
            for (let i = 0; i < questionIds.length / 1000; i++) {
                const item = await getBookList(questionIds, i * 1000, bookType)
                await sleep(1000)
                result.push(formatDataSource(item, isMobile))
                // requestList.push(request)
            }
            dispatch(setList(result.flat()))
            // Promise.all(requestList)
            //     .then(res => {
            //         const data = res.map(item => formatDataSource(item, isMobile)).flat()
            //         // setDataSource(data)
            //         dispatch(setList(data))
            //     })
            //     .catch(err => {
            //         console.log('err', err)
            //     })
        },
        [isMobile, bookType]
    )

    useEffect(() => {
        const title = getParams('title')
        title && setExerTitle(title)
        if (title) {
            document.title = title
        }
    }, [])

    useEffect(() => {
        const data = window.localStorage.getItem('dataSource')
        if (data) {
            dispatch(setList(data))
        } else {
            getAllBookList(questionIds)
        }
    }, [questionIds, getAllBookList])

    const handleSelectOption = (item, index) => {
        const questionId = item.id
        const newDataSource = filterDataList.map(item => {
            if (item.id === questionId) {
                return formatSelectedItem(item, index)
            } else {
                return item
            }
        })
        dispatch(updateList(newDataSource))
    }

    const handleClose = item => {
        const questionId = item.id
        const newDataSource = filterDataList.map(item => {
            if (item.id === questionId) {
                return formatSelectedItem(item)
            } else {
                return item
            }
        })
        dispatch(updateList(newDataSource))
    }

    const handleNotesChange = data => {
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
    console.log('filterDataList', filterDataList)
    
    // 将题目按testCount分组
    const groupedQuestions = []
    for (let i = 0; i < filterDataList.length; i += testCount) {
        groupedQuestions.push(filterDataList.slice(i, i + testCount))
    }
    
    return (
        <div className='book-wrap'>
            <BookListOper />
            <div className='wrap-print'>
                {filterDataList.length <= 0 ? (
                    <SkeletonList count={10} />
                ) : (
                    <>
                        {groupedQuestions.map((group, groupIndex) => (
                            <div key={groupIndex} className='question-group'>
                                {/* 题目组标题 */}
                                <h2>{exerTitle ? `${exerTitle} 第${groupIndex + 1}组` : `练习题${groupIndex + 1}`}</h2>
                                
                                {/* 题目列表 */}
                                <div className='list'>
                                    {group.map((item, index) => {
                                        const globalIndex = groupIndex * testCount + index
                                        return (
                                            <div key={item.id} className='item-wrap'>
                                                <div className='item'>
                                                    <QuestionItem
                                                        status={item.status}
                                                        data={item}
                                                        index={globalIndex}
                                                        layout={item.layout}
                                                        onClick={handleSelectOption}
                                                    />
                                                    {item.answerVisible && (
                                                        <Answer
                                                            onChange={() => handleNotesChange(item)}
                                                            onClose={() => handleClose(item)}
                                                            data={item}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                
                                {/* 每组答案 */}
                                <div className='group-answer'>
                                    <h3>第{groupIndex + 1}组答案</h3>
                                    <div className='book-list-answer' style={{ fontSize: '14px' }}>
                                        {group.map((item, index) => {
                                            const globalIndex = groupIndex * testCount + index
                                            const choice = item.correctAnswer.choice
                                            const mapIndexToLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
                                            return index % 5 === 0 ? (
                                                <React.Fragment key={item.id}>
                                                    {index > 0 && <div style={{ height: 8 }} />}
                                                    <span style={{ display: 'inline-block', width: 88 }}>
                                                        {prefixZero(globalIndex + 1)}-{prefixZero(Math.min(globalIndex + 5, (groupIndex + 1) * testCount))}：
                                                    </span>
                                                    <span style={{ display: 'inline-block', width: 12 }}>
                                                        {mapIndexToLetter[choice]}
                                                    </span>
                                                </React.Fragment>
                                            ) : (
                                                <span 
                                                    style={{ display: 'inline-block', width: 12 }} 
                                                    key={item.id}
                                                >
                                                    {mapIndexToLetter[choice]}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
                
                <div className='data-any'>
                    <PieCharts dataSource={sortedKeyPoints} />
                    {/* 查看词频 */}
                    <WordFrequency />
                </div>
            </div>

            <NotesEditor value={notes.content} visible={notesVisible} onOk={handleNotesOk} onCancel={handleNotesCancel} />
        </div>
    )
}

export default XingCeList
