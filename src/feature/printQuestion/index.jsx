import React, { useState } from 'react'
import { message, Input, Button, Space } from 'antd'
import Answer from '../xingce/components/Answer'
import QuestionItem from '../book/components/QuestionItem'
import NotesEditor from '../book/components/NotesEditor'
import { updateQuestionNotes } from '../../service/question'
import useDeviceInfo from '../book/hooks/useDeviceInfo'
import '../book/BookList.scss'
import { formatSelectedItem } from '../book/BookList'
import { nanoid } from '@reduxjs/toolkit'

const { TextArea } = Input

// 补零函数，从BookList复用
const prefixZero = number => {
    if (number < 10) return `00${number}`
    if (number < 100) return `0${number}`
    return number
}

const PrintQuestion = () => {
    const [questionsInput, setQuestionsInput] = useState('')
    const [questions, setQuestions] = useState([])
    const [notes, setNotes] = useState({ id: '', content: '' })
    const [notesVisible, setNotesVisible] = useState(false)
    const { isMobile } = useDeviceInfo()

    // 解析输入的JSON为题目列表
    const handleParseQuestions = () => {
        try {
            const parsedData = JSON.parse(questionsInput)
            if (Array.isArray(parsedData)) {
                const mapLetterToIndex = {
                    A: 0,
                    B: 1,
                    C: 2,
                    D: 3,
                    E: 4,
                    F: 5,
                    G: 6,
                }
                setQuestions(parsedData.map((item, index) => {
                    const newOptions = item.accessories[0].options.map(option => {
                        return option.replace(/[A-Z]\.\s*/g, '')
                    })
                    return {
                        ...item,
                        id: nanoid(),
                        correctAnswer: {
                            choice: mapLetterToIndex[item.correctAnswer.choice],
                        },
                        accessories: [
                            {
                                options: newOptions,
                            }
                        ],
                    }
                }))
                message.success('解析成功')
            } else {
                message.error('数据格式不正确，请确保输入是题目数组')
            }
        } catch (error) {
            console.log('error', error)
            message.error('JSON格式错误，请检查输入')
        }
    }

    const handleSelectOption = (item, index) => {
        const newQuestions = questions.map(q => 
            q.id === item.id ? formatSelectedItem(q, index) : q
        )
        setQuestions(newQuestions)
    }

    const handleClose = (item) => {
        const newQuestions = questions.map(q => 
            q.id === item.id ? formatSelectedItem(q) : q
        )
        setQuestions(newQuestions)
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

    return (
        <div className='book-wrap'>
            <div className='category-input-section no-print' style={{ marginBottom: 20 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <TextArea 
                        value={questionsInput}
                        onChange={(e) => setQuestionsInput(e.target.value)}
                        placeholder={`请直接输入题目列表的JSON数据，格式如：
[
  {"id": 123, "title": "题目1内容", "options": [...], "correctAnswer": {...}},
  {"id": 124, "title": "题目2内容", "options": [...], "correctAnswer": {...}}
]`}
                        rows={6}
                    />
                    <Button type="primary" onClick={handleParseQuestions}>
                        解析并显示题目
                    </Button>
                </Space>
            </div>

            <div className='wrap-print'>
                <div className='list'>
                    {questions.map((item, index) => (
                        <div key={index} className='item-wrap'>
                            <div className='item'>
                                <QuestionItem
                                    status={item.status}
                                    data={item}
                                    index={index}
                                    layout={item.layout}
                                    onClick={(item, index) => handleSelectOption(item, index)}
                                />
                                {item.answerVisible && (
                                    <Answer
                                        onChange={() => handleNotesChange(item)}
                                        onClose={() => handleClose(item)}
                                        data={item}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* 答案列表 */}
                {questions.length > 0 && (
                    <div className='category-answer-sheet'>
                        <h3>答案</h3>
                        <div className='book-list-answer' style={{ fontSize: '14px' }}>
                            {questions.map((item, index) => {
                                const choice = item.correctAnswer?.choice
                                const mapIndexToLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
                                return index % 5 === 0 ? (
                                    <React.Fragment key={index}>
                                        {index > 0 && <div style={{ height: 8 }} />}
                                        <span style={{ display: 'inline-block', width: 88 }}>
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
                )}
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

export default PrintQuestion 