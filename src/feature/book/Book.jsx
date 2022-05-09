import React, { useEffect, useState } from 'react'
import { Upload, Tree, Button } from 'antd'
import { getCategoryQuestion } from '../../service/question'
import '../xingce/XingCe.scss'
import { useHistory } from 'react-router'

const XingCe = () => {
    const [categoryList, setCategoryList] = useState([])
    const history = useHistory()
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
        history.push(`/book/${questionIds.toString()}`)
    }

    /**
     * 17:36
     */
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
                            开始练习
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
        <div className='xing-ce'>
            hello, world
            <div className='category'>
                <Tree className='xing-ce-tree' treeData={categoryList} />
            </div>
        </div>
    )
}

export default XingCe
