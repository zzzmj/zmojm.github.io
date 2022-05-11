// pdf版本

import { Alert, Button, Col, Input, Radio, Row, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatAnswerNumber, getNumberFromLen } from '../../utils/math'
import './Calc.scss'
import './CalcPdf.scss'

/**
 * {
 *    formula：'', // 算式
 *    formatAnswer: '', // 真实答案
 *    time: '', //耗时
 *    input: '', // inputValue用户输入的答案
 *    errorAnalysis:
 * }
 * ['A', 'B', 'A+B', 'A-b'], ['A', 'B', 'A*B'], ['A', 'B', 'A÷B']
 *
 */
// type: 1加减法
// type: 2乘法
// type: 3除法
const getData = (count = 20) => {
    // 除法
    const divisionFn = () => {
        const a = getNumberFromLen(5)
        const b = getNumberFromLen(3)
        return [a, b, formatAnswerNumber(a / b, 2)]
    }

    // 加减
    const addAndSubFn = () => {
        const a = getNumberFromLen(3)
        const b = getNumberFromLen(3)
        return [a, b, a + b, a - b]
    }

    // 2*1位乘法
    const mulFn = () => {
        const a = getNumberFromLen(2)
        let b = getNumberFromLen(1)
        while (b < 2) {
            b = getNumberFromLen(1)
        }
        return [a, b, a * b]
    }
    // 加法
    const mapTypeToFn = {
        1: addAndSubFn,
        2: mulFn,
        3: divisionFn,
    }
    const arr = []
    for (let i = 0; i < count; i++) {
        let a = mapTypeToFn[1]()
        let b = mapTypeToFn[2]()
        let c = mapTypeToFn[3]()
        arr.push([i + 1, ...a, ...b, ...c])
    }
    return arr
}

const defaultColumn = [
    {
        type: 'span',
        label: '',
        span: 2,
    },
    {
        type: 'span',
        label: 'A',
        span: 2,
    },
    {
        type: 'span',
        label: 'B',
        span: 2,
    },
    {
        type: 'span',
        label: 'A+B',
        span: 2,
    },
    {
        type: 'span',
        label: 'A-B',
        span: 2,
    },
    {
        type: 'span',
        label: 'A',
        span: 2,
    },
    {
        type: 'span',
        label: 'B',
        span: 2,
    },
    {
        type: 'span',
        label: 'A*B',
        span: 2,
    },
    {
        type: 'span',
        label: 'A',
        span: 2,
    },
    {
        type: 'span',
        label: 'B',
        span: 2,
    },
    {
        type: 'span',
        label: 'A÷B',
        span: 2,
    },
]

const CalcPdf = () => {
    const [column, setColumn] = useState(defaultColumn)
    const [data, setData] = useState(() => getData())
    const prefix = 'calc-wrap calc-pdf'

    useEffect(() => {
        document.title = '速算练习'
        const newData = getData()

        console.log('new', newData)
        setData(newData)
    }, [])

    // 24133 44424 22443 43434
    return (
        <div className={prefix}>
            <div className='test'>
                <h3>速算技巧练习</h3>
                <div className={`${prefix}-content`}>
                    <div className='list'>
                        <Row className='column list-item'>
                            {column.map((item, index) => {
                                return (
                                    <div key={index} className='list-item-num'>
                                        {item.label}
                                    </div>
                                )
                            })}
                        </Row>
                        <div className='data'>
                            {data.map((arr, index) => {
                                console.log('arr', arr.length)
                                return (
                                    <Row
                                        className='list-item'
                                        key={`item-${index}`}
                                    >
                                        {arr.map((item, j) => {
                                            // 隐藏答案行
                                            const hides = [3, 4, 7, 10]
                                            return (
                                                <div
                                                    className='list-item-num'
                                                    key={j}
                                                >
                                                    {hides.includes(j)
                                                        ? ''
                                                        : item}
                                                </div>
                                            )
                                        })}
                                    </Row>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className='test-answer'>
                <h3>速算技巧答案</h3>
                <div className={`${prefix}-content`}>
                    <div className='list'>
                        <Row className='column list-item'>
                            {column.map((item, index) => {
                                return (
                                    <div key={index} className='list-item-num'>
                                        {item.label}
                                    </div>
                                )
                            })}
                        </Row>
                        <div className='data'>
                            {data.map((arr, index) => {
                                console.log('arr', arr.length)
                                return (
                                    <Row
                                        className='list-item'
                                        key={`item-${index}`}
                                    >
                                        {arr.map((item, j) => {
                                            // 隐藏答案行
                                            const hides = [3, 4, 7, 10]
                                            return (
                                                <div
                                                    className={`list-item-num ${
                                                        hides.includes(j)
                                                            ? 'daan'
                                                            : ''
                                                    }`}
                                                    key={j}
                                                >
                                                    {item}
                                                </div>
                                            )
                                        })}
                                    </Row>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalcPdf
