// 考试模式
import React, { useEffect, useState } from 'react'
import { Button, Divider, message, Select } from 'antd'
import { getCategoryQuestion } from '../../service/question'
import './XingCe.scss'
import './Exam.scss'
import { useHistory } from 'react-router'
import { getExamList } from '../../service/exam'
const { Option } = Select

const Exam = () => {
    const [dataSource, setDataSource] = useState([])
    const [selectIndex, setSelectIndex] = useState(0)
    const [pageList, setPageList] = useState([])
    const history = useHistory()
    useEffect(() => {
        getExamList().then(res => {
            const data = res.map(item => item.toJSON())
            setDataSource(data)

            const newPageList = []
            for (let i = 0; i < data.length; i += 10) {
                const item = data.slice(i, i + 10)
                newPageList.push(item)
            }
            setPageList(newPageList)
        })
    }, [])

    // 开始练习
    const handleClickPractice = () => {
        const ids = pageList[selectIndex].map(item => item.id)
        console.log('ids', ids.toString())
        history.push(`/xingce/${ids.toString()}`)
    }

    const copyText = text => {
        var textarea = document.createElement('textarea')
        document.body.appendChild(textarea)
        // 隐藏此输入框
        textarea.style.position = 'fixed'
        textarea.style.clip = 'rect(0 0 0 0)'
        textarea.style.top = '10px'
        // 赋值
        textarea.value = text
        // 选中
        textarea.select()
        // 复制
        document.execCommand('copy', true)
        // 移除输入框
        document.body.removeChild(textarea)
    }

    const handleCopy = () => {
        const data = pageList[selectIndex]
        let html = ''
        data.forEach(item => {
            // item.content是内容
            // item.accessories[0].options是选项
            // item.correctAnswer.choice是答案
            const choice = item.correctAnswer.choice
            const option = item.accessories[0].options.map((item, index) => {
                if (index == choice) {
                    return `<strong>「${item}」</strong>`
                } else {
                    return `<span>「${item}」</span>`
                }
            })
            const qaItem = `
                <div class="qa-item">
                    ${item.content}<input style="border: none; width: 300px; height: 35px; font-weight: bold;" />
                    <details>
                        <summary>查看</summary>
                        <p>${option}</p>
                    </details>
                </div>
                `
            html += qaItem
        })
        const result = `<div style="height: 300px; overflow-y: scroll;">${html}</div>`
        // 复制成功
        copyText(result)
        message.success('已复制!')
    }

    const handleChange = index => {
        setSelectIndex(index)
    }

    return (
        <div className='xing-ce'>
            能力训练
            <div className='category'>
                <h3>阅读概括能力</h3>
                {/* <Tree className='xing-ce-tree' treeData={categoryList} /> */}
                <Select
                    defaultValue={1}
                    style={{ width: 120 }}
                    onChange={handleChange}
                >
                    {pageList.map((item, index) => {
                        return (
                            <Option
                                key={index}
                                value={index}
                            >{`套卷 ${index}`}</Option>
                        )
                    })}
                </Select>
                <Divider />
                <Button onClick={handleClickPractice}>开始练习</Button>
                <Divider />
                <Button onClick={handleCopy}>复制套题</Button>
            </div>
        </div>
    )
}

export default Exam
