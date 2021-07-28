/**
 * 技术方案构想：
 * 每次编辑后，将html传给服务器即可。
 *
 * UI设计。
 * - 高亮
 * - 标签
 */
import React from 'react'
import classNames from 'classnames'
import './Comment.scss'
// import { Button } from 'react-bootstrap'

// const log = console.log.bind(console, '[comment]')
// 自定义颜色。

// 侧边栏
const Comment = props => {
    const { className } = props
    const prefix = 'zz-comment'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })

    return (
        <div className={cls}>
            <header>我的标注列表</header>
            <ul>
                <li>标注一</li>
                <li>标注一</li>
                <li>标注一</li>
                <li>标注一</li>
                <li>标注一</li>
                <li>标注一</li>
                <li>标注一</li>
            </ul>
        </div>
    )
}

export default Comment
