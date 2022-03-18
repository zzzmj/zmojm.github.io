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
                Math.abs(input - answer) / answer <= 0.05,
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
    // 24133 44424 22443 43434
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
