import React from 'react'
import classNames from 'classnames'
import { Dropdown } from 'react-bootstrap'
import './SideBar.scss'

// 侧边栏
const SideBar = props => {
    const { className } = props

    const prefix = 'zz-sidebar'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })

    const handleSelect = eventKey => {
        console.log('e', eventKey)
    }

    const options = [
        {
            name: '韩国',
            value: 'hg',
        },
        {
            name: '英国',
            value: 'hk',
        },
    ]
    return (
        <div className={cls}>
            <div className='select'>
                <Dropdown size>
                    <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
                        版本
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {options.map((item, index) => {
                            const { name, value } = item
                            return (
                                <Dropdown.Item
                                    onSelect={handleSelect}
                                    key={index}
                                    eventKey={value}
                                >
                                    {name}
                                </Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <ul>
                <li>标题标题标题</li>
                <li>标题标题标题</li>
                <li>标题标题标题</li>
                <li>标题标题标题</li>
                <li>标题标题标题</li>
                <li>标题标题标题</li>
            </ul>
        </div>
    )
}

export default SideBar
