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
 * 1. 1/28 + 1/21 = 1/4*7 + 1/3*7 =  3+4/3*4*7 = 1/12. 12天
 * 2. 1/30 + 1/x = 1/12 => 1/12 - 1/30 = 10/3*4*10 - 4/3*10*4 = 1/20。所以20天完成
 * 3. 甲1分钟打 1/120, 乙1分钟打1/140，所以B更多
 * +4. 甲+乙效率1/8, 甲效率1/12, （1/8)*2.4 = 3/10, 还剩7/10 = 420未完成, 则1/10就是60， 乙效率是1/24，干了2.4小时，则干了总工程量的1/10，所以一共加工了420+60 = 480个
 * 5. 干了15天加工了195个，1天加工13*4 = 52个，455-195 = 260，所以还要260/52 = 5天
 * 6. 1/12, 1/9. 1/12 * x + 1/9 * y = 1 => 3x + 4y = 36. y是6，x是4天，因此甲做了4天
 * +7. 甲1/6, 乙1/7，丙1/14。看成三个人一起完成“2”的工作量，三个人的工作效率是：7+6+3/42 = 16/42 = 8 / 21。8/21*x = 2. x=21/4=5.25小时 = 21/4。因此丙帮了甲完成了1/8的工作量即是14/8 = 7/4，所以帮乙21/4 - 7/4 = 7/2
 * 8. 48天完成，说明甲做了15天等于乙做20天，即3天等于乙4天。 甲先做42天，少做6天，因此乙需要做48+8天 = 56天
 * 9. 乙做了30天，甲做20天完成，相当于乙30天做了甲20天的工作量，则完成需要60天。
 * 10. 乙10天等于甲20天，效率比则是2:1，则甲效率是1/60，乙丙效率一致都是1/30，三人合作效率是5/60，因此需要12天完成
 * 11. 总量设为48，甲+乙 = 6 乙+丙= 8 丙+丁=4 甲-丙 = -2 甲 +丁 = 2，所以需要24天
 * +12. 160x不会
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
    // 24133 44424 22443 43434
    return (
        <div className={prefix}>
            <div className={`${prefix}-method`}>
                <Radio.Group onChange={onChange} value={calcMethod}>
                    <Radio value={1}>除法</Radio>
                    <Radio value={2}>增长量</Radio>
                    <Radio value={3}>加法</Radio>
                    <Radio value={4}>减法</Radio>
                    <Radio value={5}>两位数乘法</Radio>
                    <Radio value={6}>三位数乘法</Radio>
                    <Radio value={7}>特殊分数</Radio>
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
