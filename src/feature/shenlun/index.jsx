import { Input } from 'antd'
import classNames from 'classnames'
import React, { useState } from 'react'
import './index.scss'

const ShenLun = () => {
    const [textList, setTextList] = useState(new Array(1400).fill(''))
    const [activeIndex, setActiveIndex] = useState(0)

    const handleInputChange = e => {
        let value = e.target.value
        while (value.includes('\n')) {
            const pos = value.indexOf('\n')
            const suffix = 25 - (pos % 25)
            if (suffix < 25) {
                value = value.replace(
                    '\n',
                    new Array(suffix).fill(' ').join('')
                )
            } else {
                value = value.replace('\n', '')
            }
        }
        // setInputValue(value)
        const newTextList = new Array(1400).fill('')
        Array.from(value).forEach((item, index) => {
            newTextList[index] = item
        })
        setTextList(newTextList)
        setActiveIndex(value.length)
    }
    return (
        <div className='shenlun-wrap'>
            <Input.TextArea
                className='input'
                type='text'
                onChange={handleInputChange}
            />

            <div className='list'>
                {textList.map((item, index) => {
                    const cls = classNames({
                        item: true,
                        active: activeIndex === index,
                    })
                    return (
                        <div key={index} className={cls}>
                            {item}
                            {(index + 1) % 100 === 0 && (
                                <div className='count'>{index + 1}</div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ShenLun
