import { Alert, Button, Col, Input, Radio, Row, Form } from 'antd'
import React, { useState } from 'react'
import { formatAnswerNumber, getNumberFromLen } from '../../utils/math'
import './Calc.scss'

/**
 * {
 *    formula：'', // 算式
 *    formatAnswer: '', // 真实答案
 *    time: '', //耗时
 *    input: '', // inputValue用户输入的答案
 *    errorAnalysis:
 * }
 */
// type: 1除法
// type: 2加法
// type: 3减法
const getData = (type = 1) => {
    // 除法
    const divisionFn = () => {
        const a = getNumberFromLen(3)
        const b = getNumberFromLen(3)
        return {
            formula: (
                <div>
                    {a}
                    <div className='divider'></div>
                    {b}
                </div>
            ),
            formatAnswer: formatAnswerNumber(a / b, 2),
            // 误差小于1
            errorAnalysis: (input, answer) => Math.abs(input - answer) <= 1,
        }
    }

    const growthFn = () => {
        // 现期量
        const a = getNumberFromLen(3)
        // 增长率
        const b = getNumberFromLen(3) / 10
        return {
            formula: (
                <div>
                    <span>
                        {a} * {b}%
                    </span>
                    <div className='divider'></div>
                    <span>1 + {b}%</span>
                </div>
            ),
            formatAnswer: Math.round((a * (b / 100)) / (1 + b / 100)),
            // 误差5%以内
            errorAnalysis: (input, answer) =>
                Math.abs(input - answer) / 100 <= 0.05,
        }
    }

    const mapTypeToFn = {
        1: divisionFn,
        2: growthFn,
    }
    const arr = []
    for (let i = 0; i < 10; i++) {
        let answerObj = mapTypeToFn[type]()
        const obj = {
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
        label: '算式',
        span: 8,
    },
    {
        type: 'input',
        label: '答案',
        span: 8,
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
                    <Radio value={2}>增长量</Radio>
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
                    <Form>
                        {data.map((item, index) => {
                            const { formula, input, formatAnswer } = item
                            let consumeTime = item.time - time.start
                            if (index > 1) {
                                const preItem = data[index - 1]
                                consumeTime = item.time - preItem.time
                            }
                            return (
                                <Row className='list-item' key={index}>
                                    <Col
                                        span={8}
                                        className='list-item-num list-item-a'
                                    >
                                        {formula}
                                    </Col>
                                    <Col
                                        span={8}
                                        className='list-item-num list-item-b'
                                    >
                                        <Input
                                            type='tel'
                                            onClick={() =>
                                                handleClickInput(index)
                                            }
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
                    </Form>
                    <Button onClick={handleClickResult}>验证结果</Button>
                    <div>
                        通过: {acceptRate}/{data.length}
                    </div>
                    <div>用时: {time.end}s</div>
                </div>
            </div>
        </div>
    )
}

export default Calc
