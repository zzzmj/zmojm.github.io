import React, { useEffect, useState } from 'react'
import { Tree, Button } from 'antd'
import { getCategoryQuestion } from '../../service/question'
import { useNavigate } from 'react-router-dom'
import './BookList.scss'

const XingCe = () => {
    const [categoryList, setCategoryList] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        getCategoryQuestion('65ec759b9bbdb31949a8e2e4').then(res => {
            const data = res.toJSON().content
            processCategoryList(data)
            console.log('res', data)
            setCategoryList(data)
        })
    }, [])

    // 开始练习
    const handleClickPractice = (questionIds, id) => {
        navigate({
            pathname: `/test_book/${questionIds.toString()}`,
        })
    }
    const handleClickRandomPractice = (questionIds, id) => {
        const shuffled = [...questionIds].sort(() => 0.5 - Math.random());
        const selectedIds = shuffled.slice(0, 10);

        navigate({
            pathname: `/test_book/${selectedIds.toString()}`,
        });
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
                            style={{ marginRight: 8 }}
                        >
                            练习
                        </Button>
                        <Button
                            onClick={() =>
                                handleClickRandomPractice(item.questionIds, item.id)
                            }
                            shape='round'
                        >
                            随机练
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
