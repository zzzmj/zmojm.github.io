import { Alert, Button, Col, Input, Radio, Row } from 'antd'
import React, { useState } from 'react'
import { formatAnswerNumber, getNumberFromLen } from '../../utils/math'
import './Calc.scss'

// const getNumberFromLen = numberLength => {
//     return parseInt(Math.random() * Math.pow(10, numberLength))
// }

// // number是数字，len是保留的位数，并且放大到的位数
// // 例如
// // formatAnswerNumber(0.03813, 2) => 38
// // formatAnswerNumber(0.03813, 3) => 381
// const formatAnswerNumber = (number, len) => {
//     let n = number
//     while (n < Math.pow(10, len - 1)) {
//         n *= 10
//     }
//     return parseInt(n)
// }

// type: 1除法
// type: 2加法
// type: 3减法
const getData = (type = 1) => {
    const arr = []
    for (let i = 0; i < 10; i++) {
        const a = getNumberFromLen(3)
        const b = getNumberFromLen(3)
        let answerObj = {}
        if (type === 1) {
            answerObj = {
                answer: a / b,
                formatAnswer: formatAnswerNumber(a / b, 2),
            }
        } else if (type === 2) {
            answerObj = {
                answer: a + b,
                formatAnswer: a + b,
            }
        } else if (type === 3) {
            answerObj = {
                answer: a + b,
                formatAnswer: a + b,
            }
        }
        const obj = {
            a,
            b,
            input: '',
            time: '',
            ...answerObj,
        }
        arr.push(obj)
    }
    return arr
}

const defaultColumn = [
    {
        type: 'span',
        label: 'a',
        span: 5,
    },
    {
        type: 'span',
        label: 'b',
        span: 5,
    },
    {
        type: 'input',
        label: 'a/b',
        span: 6,
    },
    {
        type: 'alert',
        label: 'answer',
        span: 4,
    },
    {
        type: 'span',
        label: 'time',
        span: 4,
    },
]

const Calc = () => {
    const [column, setColumn] = useState(defaultColumn)
    const [calcMethod, setCalcMethod] = useState(1)
    const [answerVisible, setAnswerVisible] = useState(false)
    const [acceptRate, setAcceptRate] = useState(0)
    const [data, setData] = useState(() => getData())
    window.data = data
    const [time, setTime] = useState({
        start: '',
        end: '',
    })
    const prefix = 'calc-wrap'
    const onChange = e => {
        const value = e.target.value
        let label = ''
        if (value == '1') {
            label = 'a/b'
        } else if (value == '2') {
            label = 'a+b'
        } else if (value == '3') {
            label = 'a-b'
        }
        const newColumn = column.map(item => {
            if (item.type === 'input') {
                return {
                    ...item,
                    label,
                }
            } else {
                return item
            }
        })
        setColumn(newColumn)
        const newData = getData(value)
        console.log('newData', newData)
        setData(newData)
        setCalcMethod(value)
        setAnswerVisible(false)
    }

    const handleChangeInput = (e, index) => {
        const newData = data.map((item, j) => {
            if (index === j) {
                return {
                    ...item,
                    input: e.target.value,
                }
            }
            return item
        })
        setData(newData)
    }

    const handleClickResult = () => {
        setAnswerVisible(true)
        let count = 0
        data.forEach(item => {
            const { input, formatAnswer } = item
            if (Math.abs(input - formatAnswer) <= 1) {
                count++
            }
        })
        setAcceptRate(count)
        setTime({
            ...time,
            end: parseInt((Date.now() - time.start) / 1000),
        })
    }

    const handleClickInput = index => {
        if (index === 0) {
            console.log('start!!!')
            setTime({
                ...time,
                start: Date.now(),
            })
        }
    }

    const handleBlur = index => {
        const newData = data.map((item, j) => {
            if (index === j) {
                return {
                    ...item,
                    time: Date.now(),
                }
            } else {
                return item
            }
        })
        setData(newData)
    }

    return (
        <div className={prefix}>
            <div className={`${prefix}-method`}>
                <Radio.Group onChange={onChange} value={calcMethod}>
                    <Radio value={1}>除法</Radio>
                    <Radio value={2}>加法</Radio>
                    <Radio value={3}>减法</Radio>
                </Radio.Group>
            </div>
            <div className={`${prefix}-content`}>
                <div className='list'>
                    <Row className='list-item'>
                        {column.map((item, index) => {
                            return (
                                <Col
                                    key={index}
                                    className='list-item-num'
                                    span={item.span}
                                >
                                    {item.label}
                                </Col>
                            )
                        })}
                    </Row>
                    {data.map((item, index) => {
                        const { a, b, input, formatAnswer } = item

                        let consumeTime = item.time - time.start
                        if (index > 1) {
                            const preItem = data[index - 1]
                            consumeTime = item.time - preItem.time
                        }
                        return (
                            <Row className='list-item' key={index}>
                                <Col
                                    span={5}
                                    className='list-item-num list-item-a'
                                >
                                    {a}
                                </Col>
                                <Col
                                    span={5}
                                    className='list-item-num list-item-b'
                                >
                                    {b}
                                </Col>
                                <Col
                                    span={6}
                                    className='list-item-num list-item-b'
                                >
                                    <Input
                                        type='tel'
                                        onClick={() => handleClickInput(index)}
                                        onChange={e =>
                                            handleChangeInput(e, index)
                                        }
                                        onBlur={() => handleBlur(index)}
                                        value={input}
                                    />
                                </Col>
                                {answerVisible && (
                                    <Col
                                        span={4}
                                        className='list-item-num list-item-c'
                                    >
                                        <Alert
                                            message={formatAnswer}
                                            type={
                                                Math.abs(
                                                    input - formatAnswer
                                                ) <= 1
                                                    ? 'success'
                                                    : 'error'
                                            }
                                            showIcon
                                        />
                                    </Col>
                                )}
                                {answerVisible && (
                                    <Col
                                        span={4}
                                        className='list-item-num list-item-c'
                                    >
                                        {parseInt(consumeTime / 1000)}
                                    </Col>
                                )}
                            </Row>
                        )
                    })}

                    <Button onClick={handleClickResult}>验证结果</Button>
                    <div>通过: {acceptRate}/10</div>
                    <div>用时: {time.end}s</div>
                </div>
            </div>
        </div>
    )
}

export default Calc
