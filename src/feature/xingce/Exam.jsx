// 考试模式
import React, { useEffect, useState } from 'react'
import { Button, Radio, Tree } from 'antd'
import { getCategoryQuestion } from '../../service/question'
import './XingCe.scss'
import './Exam.scss'
import { useHistory } from 'react-router'

const treeStruct = ['']
function handleResponse(url, response) {
    let res = response
    if (res.status === 200) {
        return res.json()
    } else {
        console.error(`Request fail. url:${url}`)
        Promise.reject({
            error: {
                message: 'Request failed due to server error',
            },
        })
    }
}

var headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
}

function post(url, data) {
    return fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
    })
        .then(response => {
            return handleResponse(url, response)
        })
        .catch(err => {
            console.error(`Request failed. Url = ${url} . Message = ${err}`)
            return { error: { message: 'Request failed.' } }
        })
}
/**
 * 
 type=3&keypointId=22339&limit=15&exerciseTimeMode=2
 */

post(
    'https://tiku.fenbi.com/api/xingce/exercises?app=web&kav=12&version=3.0.0.0',
    'type=3&keypointId=22339&limit=15&exerciseTimeMode=2'
)

// 通过题目id查询题目内容以及解析
// const getSolutionByIds = async questionIds => {
//     const sliceQuestionIds = []
//     for (let i = 0; i < questionIds.length; i += 500) {
//         sliceQuestionIds.push(questionIds.slice(i, i+500))
//     }
//     let solution = []
//     for (let i = 0; i < sliceQuestionIds.length; i++) {
//         const s = await get(`https://tiku.fenbi.com/api/xingce/solutions?ids=${sliceQuestionIds[i].toString()}&app=web&kav=12&version=3.0.0.0`)
//         console.log('插入一次', sliceQuestionIds[i], s)
//         solution = solution.concat(s)
//     }
//     return solution
// }

var sleep = (timeout = 1000) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}

// 导出阅读题
var exportRead = async () => {
    const set = new Set()
    for (let i = 0; i < 15; i++) {
        const data = await post(
            'https://tiku.fenbi.com/api/xingce/exercises?app=web&kav=12&version=3.0.0.0',
            'type=3&keypointId=22339&limit=100&exerciseTimeMode=2'
        )
        await sleep(500)
        data.sheet.questionIds.forEach(item => set.add(item))
        console.log(`第${i + 1}次加载100题`)
    }
    console.log('set', [...set])
    return [...set]
}

const Exam = () => {
    const [categoryList, setCategoryList] = useState([])
    const history = useHistory()
    useEffect(() => {
        getCategoryQuestion().then(res => {
            const data = res.toJSON().content
            processCategoryList(data)
            console.log('res', data)
            setCategoryList(data)
        })
    }, [])

    // 开始练习
    const handleClickPractice = (questionIds, id) => {
        history.push(`/xingce/${id}`)
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
            能力训练
            <div className='category'>
                <div className='options'>
                    <Radio.Group defaultValue={10} buttonStyle='solid'>
                        <Radio.Button value={5}>5题</Radio.Button>
                        <Radio.Button value={10}>10题</Radio.Button>
                        <Radio.Button value={20}>20题</Radio.Button>
                    </Radio.Group>
                </div>
                <Tree className='xing-ce-tree' treeData={categoryList} />
            </div>
        </div>
    )
}

export default Exam
