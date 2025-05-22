import React, { useCallback, useEffect, useState } from 'react'
import { message, Input, Button, Space } from 'antd'
import Answer from '../xingce/components/Answer'
import { getBookList } from '../../service/exam'
import QuestionItem from '../book/components/QuestionItem'
import SkeletonList from '../../components/SkeletonList/SkeletonList'
import NotesEditor from '../book/components/NotesEditor'
import { updateQuestionNotes } from '../../service/question'
import useDeviceInfo from '../book/hooks/useDeviceInfo'
import '../book/BookList.scss'
import { formatDataSource, formatSelectedItem } from '../book/BookList'

const { TextArea } = Input

// 补零函数，从BookList复用
const prefixZero = number => {
    if (number < 10) return `00${number}`
    if (number < 100) return `0${number}`
    return number
}

const CategoryList = () => {
    const [categoryInput, setCategoryInput] = useState('')
    const [categories, setCategories] = useState([])
    const [categoryData, setCategoryData] = useState({})
    const [notes, setNotes] = useState({ id: '', content: '' })
    const [notesVisible, setNotesVisible] = useState(false)
    const { isMobile } = useDeviceInfo()

    // 解析输入的文本为categories数据结构
    const handleParseCategories = () => {
        try {
            const parsedData = JSON.parse(categoryInput)
            if (Array.isArray(parsedData) && parsedData.every(item => 
                item.category && Array.isArray(item.ids)
            )) {
                setCategories(parsedData)
                message.success('解析成功')
            } else {
                message.error('数据格式不正确')
            }
        } catch (error) {
            message.error('JSON格式错误，请检查输入')
        }
    }

    const getCategoryQuestions = useCallback(async (ids, type) => {
        try {
            const result = []
            for (let i = 0; i < ids.length / 1000; i++) {
                const item = await getBookList(ids, i * 1000, type)
                await new Promise(resolve => setTimeout(resolve, 1000)) // 添加延迟避免请求过快
                result.push(formatDataSource(item, isMobile))
            }
            const flatResult = result.flat()
            // 创建一个 id 到索引的映射
            const idToIndex = new Map(ids.map((id, index) => [id, index]))
            // 按照原始 ids 的顺序排序
            return flatResult.sort((a, b) => (idToIndex.get(a.id) || 0) - (idToIndex.get(b.id) || 0))
        } catch (error) {
            console.error('获取题目失败:', error)
            return []
        }
    }, [isMobile])

    useEffect(() => {
        const loadAllCategories = async () => {
            const loadedData = {}
            for (const category of categories) {
                const questions = await getCategoryQuestions(category.ids)
                console.log('原始ids顺序:', category.ids)
                console.log('获取到的questions顺序:', questions.map(q => q.id))
                loadedData[category.category] = questions
            }
            console.log('最终categoryData:', Object.entries(loadedData).map(([cat, qs]) => ({
                category: cat,
                questionIds: qs.map(q => q.id)
            })))
            setCategoryData(loadedData)
        }
        
        loadAllCategories()
    }, [categories, getCategoryQuestions])

    const handleSelectOption = (categoryName, item, index) => {
        const newCategoryData = {
            ...categoryData,
            [categoryName]: categoryData[categoryName].map(q => 
                q.id === item.id ? formatSelectedItem(q, index) : q
            )
        }
        setCategoryData(newCategoryData)
    }

    const handleClose = (categoryName, item) => {
        const newCategoryData = {
            ...categoryData,
            [categoryName]: categoryData[categoryName].map(q => 
                q.id === item.id ? formatSelectedItem(q) : q
            )
        }
        setCategoryData(newCategoryData)
    }

    const handleNotesChange = data => {
        setNotes({
            id: data.objectId,
            content: data.notes || '',
        })
        setNotesVisible(true)
    }

    const handleNotesOk = content => {
        updateQuestionNotes(notes.id, content)
            .then(() => {
                setNotesVisible(false)
                message.success('更新成功')
            })
            .catch(() => {
                message.error('更新失败')
            })
    }

    console.log('题目数据', categoryData, Object.entries(categoryData))
    return (
        <div className='book-wrap'>
            <div className='category-input-section no-print' style={{ marginBottom: 20 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <TextArea 
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        placeholder={`请输入分类数据，格式如：
[
  {"category": "选择题", "ids": [123, 124]},
  {"category": "判断题", "ids": [125, 126]}
]`}
                        rows={6}
                    />
                    <Button type="primary" onClick={handleParseCategories}>
                        解析并加载题目
                    </Button>
                </Space>
            </div>

            <div className='wrap-print'>
                {Object.entries(categoryData).map(([category, questions]) => (
                    <div key={category} className='category-section'>
                        <h2 style={{ margin: '50px 0' }}>{category}</h2>
                        {questions.length === 0 ? (
                            <SkeletonList count={5} />
                        ) : (
                            <>
                                <div className='list'>
                                    {questions.map((item, index) => (
                                        <div key={item.id} className='item-wrap'>
                                            <div className='item'>
                                                <QuestionItem
                                                    status={item.status}
                                                    data={item}
                                                    index={index}
                                                    layout={item.layout}
                                                    onClick={(item, index) => handleSelectOption(category, item, index)}
                                                />
                                                {item.answerVisible && (
                                                    <Answer
                                                        onChange={() => handleNotesChange(item)}
                                                        onClose={() => handleClose(category, item)}
                                                        data={item}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* 每个分类的答案列表 */}
                                <div className='category-answer-sheet'>
                                    <h3>《{category}》答案</h3>
                                    <div className='book-list-answer' style={{ fontSize: '14px' }}>
                                        {questions.map((item, index) => {
                                            const choice = item.correctAnswer.choice
                                            const mapIndexToLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
                                            return index % 5 === 0 ? (
                                                <React.Fragment key={item.id}>
                                                    {index > 0 && <div style={{ height: 8 }} />}
                                                    <span style={{ display: 'inline-block', width: 68 }}>
                                                        {prefixZero(index + 1)}-{prefixZero(Math.min(index + 5, questions.length))}：
                                                    </span>
                                                    <span style={{ display: 'inline-block', width: 12 }}>
                                                        {mapIndexToLetter[choice]}
                                                    </span>
                                                </React.Fragment>
                                            ) : (
                                                <span 
                                                    style={{ display: 'inline-block', width: 12 }} 
                                                    key={item.id}
                                                >
                                                    {mapIndexToLetter[choice]}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <NotesEditor 
                value={notes.content}
                visible={notesVisible}
                onOk={handleNotesOk}
                onCancel={() => setNotesVisible(false)}
            />
        </div>
    )
}

export default CategoryList 