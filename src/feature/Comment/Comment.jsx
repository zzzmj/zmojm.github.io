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
import { useDispatch, useSelector } from 'react-redux'
import { List, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { deleteAnnotation } from '../Annotation/AnnotationSlice'
// import { Button } from 'react-bootstrap'

// const log = console.log.bind(console, '[comment]')
// 自定义颜色。

// 侧边栏
const Comment = props => {
    const { className, highlighter } = props
    const prefix = 'zz-comment'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })

    const disptach = useDispatch()

    const annotationList = useSelector(state => state.annotation.annotationList)
    const categoryList = useSelector(state => state.header.categoryList)

    const handleDelete = annotationId => {
        Modal.confirm({
            title: '删除',
            icon: <ExclamationCircleOutlined />,
            content: '确认删除吗？',
            okText: '确认',
            cancelText: '取消',
            onCancel: () => {
                console.log('取消')
            },
            onOk: () => {
                // 删除状态
                disptach(deleteAnnotation(annotationId))
                // 删除dom结构
                highlighter.remove(annotationId)
            },
        })
    }

    const addClass = id => {
        highlighter.addClass('highlight-wrap-hover', id)
    }

    const removeClass = id => {
        highlighter.removeClass('highlight-wrap-hover', id)
    }

    return (
        <div className={cls}>
            <header>我的标注列表</header>
            <List
                itemLayout='horizontal'
                className={`${prefix}-list`}
                dataSource={annotationList}
                renderItem={item => {
                    const config = categoryList.find(
                        i => i.id === item.categoryId
                    )

                    return (
                        <List.Item className={`${prefix}-list-item`}>
                            {config.text}：{item.text}
                            <div className='action'>
                                <a
                                    onClick={() => handleDelete(item.id)}
                                    onMouseEnter={() => addClass(item.id)}
                                    onMouseLeave={() => removeClass(item.id)}
                                    key='list-loadmore-edit'
                                >
                                    delete
                                </a>
                            </div>
                        </List.Item>
                    )
                }}
            />
        </div>
    )
}

export default Comment
