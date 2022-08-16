import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useParams } from 'react-router'

import Answer from '../xingce/components/Answer'
import { getBookList } from '../../service/exam'
import QuestionItem from './components/QuestionItem'
import BookListOper from './components/BookListOper'
import './BookList.scss'
import SkeletonList from '../../components/SkeletonList/SkeletonList'

const XingCeList = () => {
    const params = useParams()
    const [questionIds, setQuestionIds] = useState([])
    const [testCount, setTestCount] = useState(40)
    const [dataSource, setDataSource] = useState([])
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
                const data = res
                    .map(item => item.toJSON())
                    .sort(
                        (a, b) =>
                            b.questionMeta.totalCount -
                            a.questionMeta.totalCount
                    )
                setDataSource(data)
            })
        }
    }, [questionIds])

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

    const handleChangeCount = count => {
        setTestCount(count)
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

    const getIds = (ids, count = 1) => {
        const arr = []
        ids.forEach(item => {
            console.log('第多少题：', (count - 1) * 20 + item - 1)
            arr.push(dataSource[(count - 1) * 20 + item - 1].id)
        })
        return arr
    }

    // 过滤题目，留下需要的
    const filterQ = qIds => {
        const newDataSource = dataSource.map((item, index) => {
            if (qIds.includes(index + 1)) {
                return item
            } else {
                return {
                    ...item,
                    hidden: true,
                }
            }
        })
        console.log(newDataSource)
        setDataSource(newDataSource)
    }
    window.getAnswer = getAnswer
    window.filterQ = filterQ
    window.getIds = getIds

    return (
        <div className='wrap'>
            <BookListOper count={testCount} onChangeCount={handleChangeCount} />
            <div className='wrap-print'>
                {dataSource.length <= 0 ? (
                    <SkeletonList count={10} />
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
                            const clsItem = classNames({
                                question: true,
                                [item.status]: item.status,
                            })
                            const clsWrap = classNames({
                                'item-wrap': true,
                                hidden: item.hidden,
                            })
                            return (
                                <div key={item.id} className={clsWrap}>
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
                                            layout={layout}
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
