// 答案组件
import React, { useEffect } from 'react'
import { Button, Divider, Tag, message } from 'antd'
import './Answer.scss'

const Answer = props => {
    const {
        correctAnswer,
        solution,
        keypoints,
        questionMeta,
        source,
        id,
        notes,
    } = props.data

    const mapIndexToLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

    const handleClick = () => {
        props.onClose()
    }

    useEffect(() => {}, [])

    const handleClickNotes = () => {
        props.onChange && props.onChange(props.data)
    }

    const handleClickCollect = async () => {
        try {
            const response = await fetch(`http://localhost:3456/collect?questionId=${id}`)
            const data = await response.json()
            message.success('添加成功')
            console.log('data', data)
        } catch (error) {
            message.success('添加成功')
        }
    }

    return (
        <div className='answer'>
            <div className='correct'>
                <p>
                    正确答案是：
                    <span>{mapIndexToLetter[correctAnswer['choice']]}</span>
                </p>

                <Button onClick={handleClick}>收起</Button>
            </div>
            <Divider />
            <ul>
                <li>
                    <span>解析：</span>
                    <div
                        className='content'
                        dangerouslySetInnerHTML={{ __html: solution }}
                    ></div>
                </li>
                <li>
                    <span>考点：</span>
                    <div className='content'>
                        {keypoints &&
                            keypoints.map((item, index) => {
                                return (
                                    <Tag key={index} color='#108ee9'>
                                        {item.name}
                                    </Tag>
                                )
                            })}
                    </div>
                </li>
                <li>
                    <span>来源：</span>
                    <div className='content'>{source}</div>
                </li>
                <li>
                    <span>统计：</span>
                    <div className='content'>
                        <Tag color='green'>
                            正确率：{questionMeta?.correctRatio?.toFixed(2)}%
                        </Tag>
                        <Tag color='magenta'>
                            易错项：
                            {
                                mapIndexToLetter[
                                    questionMeta?.mostWrongAnswer?.choice
                                ]
                            }
                        </Tag>
                    </div>
                </li>
                <li>
                    <span>题号：</span>
                    <div className='content'>{id}</div>
                </li>
                <li>
                    <span>收藏：</span>
                    <Button
                        className='video-href'
                        type='link'
                        target='_blank'
                        onClick={handleClickCollect}
                    >
                        收藏一下呗
                    </Button>
                </li>
                <li>
                    <span>解析：</span>
                    <Button
                        className='video-href'
                        type='link'
                        target='_blank'
                        href={`http://localhost:3456/comment?commentId=${id}`}
                    >
                        详细解析
                    </Button>
                </li>
                <li>
                    <span>粉笔：</span>
                    <Button
                        className='video-href'
                        type='link'
                        target='_blank'
                        href={`https://www.fenbi.com/spa/tiku/report/preview/xingce/xingce/question?id=${id}&checkId=C24Q5VJgtA&fromType=1`}
                    >
                        链接
                    </Button>
                </li>
                <li>
                    <span>笔记：</span>
                    <div onClick={handleClickNotes} className='question-notes'>
                        <div
                            className='html'
                            dangerouslySetInnerHTML={{ __html: notes }}
                        />
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Answer
