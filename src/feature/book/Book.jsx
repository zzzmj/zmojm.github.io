import React, { useEffect, useState } from 'react'
import { Tree, Button } from 'antd'
import { getCategoryQuestion } from '../../service/question'
import { useNavigate } from 'react-router-dom'
import './BookList.scss'

const XingCe = () => {
    const [categoryList, setCategoryList] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        getCategoryQuestion('625d56e11122b910ec683964').then(res => {
            const data = res.toJSON().content
            processCategoryList(data)
            console.log('res', data)
            setCategoryList(data)
        })
    }, [])

    // 开始练习
    const handleClickPractice = (questionIds, id) => {
        navigate({
            pathname: `/book/${questionIds.toString()}`,
        })

        // getBookList(questionIds).then(res => {
        //     console.log('res', res.length, questionIds.length)
        //     const data = res
        //         .map(item => item.toJSON())
        //         .sort(
        //             (a, b) =>
        //                 b.questionMeta.totalCount - a.questionMeta.totalCount
        //         )
        //     window.localStorage.setItem('dataSource', JSON.stringify(data))
        // })
    }

    const processCategoryList = data => {
        // 处理数据
        data.forEach(item => {
            item.title = (
                <div className='category-item'>
                    <div className='name'>{item.name}</div>
                    <div className='num'>{item.questionIds.length}题</div>
                    <div className='practice'>
                        <Button
                            onClick={() =>
                                handleClickPractice(item.questionIds, item.id)
                            }
                            shape='round'
                        >
                            练习
                        </Button>
                    </div>
                </div>
            )
            item.key = item.id
            if (item.children) {
                processCategoryList(item.children)
            }
        })
    }

    return (
        <div className='xing-ce-book'>
            <div className='category'>
                <Tree className='xing-ce-tree' treeData={categoryList} />
            </div>
        </div>
    )
}

export default XingCe
