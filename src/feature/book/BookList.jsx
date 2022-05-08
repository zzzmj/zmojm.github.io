import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import classNames from 'classnames'
import { getCategoryQuestion, getQuestionList } from '../../service/question'
import '../xingce/XingCe.scss'
import { useParams } from 'react-router'
import Answer from '../xingce/components/Answer'
import { getBookList, getExamList } from '../../service/exam'
import CollectIcon from '../xingce/components/CollectIcon'
import {
    addCollect,
    deleteCollect,
    getCollectList,
} from '../../service/collect'

const XingCeList = () => {
    const params = useParams()
    const [testCount, setTestCount] = useState(20)
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        // getCollect()
    }, [])

    useEffect(() => {
        const id = params.objectId
        const data = window.localStorage.getItem('dataSource')
        if (data) {
            setDataSource(data)
        } else {
            if (id.includes(',')) {
                const questionIds = id
                    .split(',')
                    .filter(item => item != '')
                    .map(item => parseInt(item))

                getBookList(questionIds).then(res => {
                    const data = res
                        .map(item => item.toJSON())
                        .sort(
                            (a, b) =>
                                b.questionMeta.totalCount -
                                a.questionMeta.totalCount
                        )
                        .slice(0, 520)
                    setDataSource(data)
                })
            }
        }
    }, [params])

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

    const getAnswer = (left, stringArr) => {
        const answer = dataSource.map(
            item => parseInt(item.correctAnswer.choice) + 1
        )
        let pos = 0
        let count = 0
        let wrong = []
        const arr = stringArr.split('').filter(item => item != ' ')
        for (let i = left; i < arr.length + left; i++) {
            const item = answer[i]
            const p = arr[pos]
            pos++
            if (item == p) {
                count++
            } else {
                wrong.push(i + 1)
            }
        }
        console.log('正确率：', parseInt((count * 100) / arr.length))
        console.log('正确答案：', answer.slice(left, arr.length + left))
        console.log('错题：', wrong)
    }
    window.getAnswer = getAnswer

    return (
        <div className='wrap'>
            <div className='wrap-print'>
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
                            <div key={item.id} className='item-wrap'>
                                {index % testCount === 0 && (
                                    <h2>
                                        练习题{parseInt(index / testCount) + 1}
                                    </h2>
                                )}
                                <div className='item'>
                                    <div className={cls}>
                                        <span>{index + 1}.</span>
                                        <div className='content'>
                                            <div className='title'>
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.content,
                                                    }}
                                                ></span>
                                                {/* <CollectIcon
                                                checked={collectMap[item.id]}
                                                onClick={() =>
                                                    handleCollect(
                                                        item,
                                                        collectMap[item.id]
                                                    )
                                                }
                                            /> */}
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
                                            onClose={() => handleClose(item)}
                                            data={item}
                                        />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default XingCeList
