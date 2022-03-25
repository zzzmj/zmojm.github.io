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
const getData = (type = 1, count = 10) => {
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
    // 高难度除法，不好算的数字
    const divisionFn2 = () => {
        let a = getNumberFromLen(3)
        let b = getNumberFromLen(3)
        let formatAnswer = formatAnswerNumber(a / b, 2)
        while (formatAnswer / 10 < 5 || formatAnswer % 10 < 5) {
            a = getNumberFromLen(3)
            b = getNumberFromLen(3)
            formatAnswer = formatAnswerNumber(a / b, 2)
        }
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
    // 增长率
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
                Math.abs(input - answer) / answer <= 0.05,
        }
    }

    // 加法
    const addFn = () => {
        const a = getNumberFromLen(3)
        const b = getNumberFromLen(3)
        return {
            formula: (
                <div>
                    {a}+{b}
                </div>
            ),
            formatAnswer: a + b,
            // 不能有误差
            errorAnalysis: (input, answer) => input - answer === 0,
        }
    }
    // 减法
    const subFn = () => {
        const a = getNumberFromLen(3)
        const b = getNumberFromLen(3)
        return {
            formula: (
                <div>
                    {a}-{b}
                </div>
            ),
            formatAnswer: a - b,
            // 不能有误差
            errorAnalysis: (input, answer) => input - answer === 0,
        }
    }
    // 两位数乘法误差允许3%以内
    const mulFn = () => {
        const a = getNumberFromLen(2)
        const b = getNumberFromLen(2)
        return {
            formula: (
                <div>
                    {a} * {b}
                </div>
            ),
            formatAnswer: a * b,
            // 误差控制在3%
            errorAnalysis: (input, answer) =>
                Math.abs(input - answer) / answer <= 0.03,
        }
    }
    // 3*1乘法
    const threeMulToOneFn = () => {
        let a = getNumberFromLen(3)
        let b = getNumberFromLen(1)
        while (a % 10 < 3 || b < 3) {
            a = getNumberFromLen(3)
            b = getNumberFromLen(1)
        }
        return {
            formula: (
                <div>
                    {a} * {b}
                </div>
            ),
            formatAnswer: a * b,
            // 误差控制在3%
            errorAnalysis: (input, answer) => input - answer === 0,
        }
    }
    // 三位数乘法误差允许3%以内
    const threeMulFn = () => {
        const a = getNumberFromLen(3)
        const b = getNumberFromLen(3)
        return {
            formula: (
                <div>
                    {a} * {b}
                </div>
            ),
            formatAnswer: formatAnswerNumber(a * b, 3),
            // 误差控制在3%
            errorAnalysis: (input, answer) =>
                Math.abs(input - answer) / answer <= 0.03,
        }
    }
    // 特殊分数
    const fractionFn = () => {
        const map = {
            '33.3%': 3,
            '25%': 4,
            '20%': 5,
            '16.7%': 6,
            '14.3%': 7,
            '12.5%': 8,
            '11.1%': 9,
            '10%': 10,
            '9.1%': 11,
            '8.3%': 12,
            '7.7%': 13,
            '7.1%': 14,
            '6.7%': 15,
            '6.25%': 16,
            '5.9%': 17,
            '5.6%': 18,
            '5.3%': 19,
            '11%': 9.1,
            '12%': 8.3,
            '13%': 7.7,
            '14%': 7.1,
            '15%': 6.7,
            '16%': 6.25,
            '17%': 5.9,
            '18%': 5.6,
            '19%': 5.3,
        }
        const arr = Object.keys(map).sort(() => Math.random() - 0.5)
        let index = -1
        return () => {
            index += 1
            return {
                formula: <div>{arr[index]}</div>,
                formatAnswer: map[arr[index]],
                errorAnalysis: (input, answer) => input - answer === 0,
            }
        }
    }

    // 加法
    const mapTypeToFn = {
        1: divisionFn,
        2: growthFn,
        3: addFn,
        4: subFn,
        5: mulFn,
        6: threeMulFn,
        7: fractionFn(),
        8: divisionFn2,
        9: threeMulToOneFn,
    }
    const arr = []
    for (let i = 0; i < count; i++) {
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
        label: '输入',
        span: 6,
    },
    {
        type: 'alert',
        label: 'answer',
        span: 6,
    },
    {
        type: 'span',
        label: 'time',
        span: 4,
    },
]
/**
 * 各清理了200米，
 * 前半段设甲效率是4，乙是3（设是x分钟）。 中间十分钟是4:0，提高效率后半段是4:6（50-x分钟）
 * 总效率是4:4
 * 则：4x+40 + 4（50-x） = 3x + 6*（50-x） => x+40 = 2*(50-x) => 2x = 60, x = 30
 * 甲60分钟清理了4*60 = 240，乙则是4*60 = 240
 * 所以乙后面工作了20分钟
 * 【例2】
 * 乙：7.5小时完成1/2+40个，甲：300个 =》 说明总量 = 640个
 * 1/2差40 = 280个， 所以360/7.5 = 720/15 = 48个
 * 【例7】设工作总量分别是120,150，晴天：甲效率是10 乙效率是10。 雨天：甲6，乙9。设晴天为x，雨天为y
 * 10x + 6y = 120
 * 10x + 9y = 150，y = 10。
 * 【例8】
 */
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
            const { input, formatAnswer, errorAnalysis } = item
            if (errorAnalysis(input, formatAnswer)) {
                count++
            }
        })
        setAcceptRate(count)
        setTime({
            ...time,
            end: time.start ? parseInt((Date.now() - time.start) / 1000) : 0,
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

    const handleReset = () => {
        setData(getData(calcMethod))
        setAnswerVisible(false)
        setAcceptRate(0)
        setTime({
            start: '',
            end: '',
        })
    }
    // 24133 44424 22443 43434
    return (
        <div className={prefix}>
            <div className={`${prefix}-method`}>
                <Button onClick={handleReset}>刷新数据</Button>
                <Radio.Group onChange={onChange} value={calcMethod}>
                    <Radio value={1}>除法</Radio>
                    <Radio value={2}>增长量</Radio>
                    <Radio value={3}>加法</Radio>
                    <Radio value={4}>减法</Radio>
                    <Radio value={5}>两位数乘法</Radio>
                    <Radio value={6}>三位数乘法</Radio>
                    <Radio value={7}>特殊分数</Radio>
                    <Radio value={8}>高难度除法</Radio>
                    <Radio value={9}>3*1乘法</Radio>
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
                            const {
                                formula,
                                input,
                                formatAnswer,
                                errorAnalysis,
                            } = item
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
                                        span={6}
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
                                            span={6}
                                            className='list-item-num list-item-c'
                                        >
                                            <Alert
                                                message={formatAnswer}
                                                type={
                                                    errorAnalysis(
                                                        input,
                                                        formatAnswer
                                                    )
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
