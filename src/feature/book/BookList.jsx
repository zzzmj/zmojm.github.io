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
    if (!selectIndex) {
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
    const { visibleData } = useVisibleData(dataSource, visibleIdList)
    console.log('visibleData', visibleData)
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
            getBookList(questionIds).then(res => {
                const data = formatDataSource(res)
                setDataSource(data)
            })
        }
    }, [questionIds])

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
        </div>
    )
}

export default XingCeList
