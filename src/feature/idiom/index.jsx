import React, { useEffect, useState } from 'react'
import sentenceList from './sentence.json'
import idiomList from './idiom.json'
import './github.css'
import './index.scss'
// 成语查询页面
function Idiom() {
    const [idiomObject, setIdiomObject] = useState({
        name: '',
        explanation: '',
        sentence: [],
        questionList: [],
    })

    const handleKeyUp = e => {
        if (e.keyCode === 13) {
            const value = e.target.value
            // 找到例句
            const s = sentenceList.find(item => item.name === value)
            // 找到真题
            const q = idiomList.find(item => item.idiom === value)
            setIdiomObject({
                name: value,
                explanation: s ? s.explanation : '',
                sentence: s ? s.sentence : '',
                url: q
                    ? `https://zmojm.github.io/build/index.html?title=${value} 专项练习#/book/${q.ids.toString()}`
                    : '',
            })
        }
    }

    useEffect(() => {
        document.title = '成语查询'
    }, [])

    return (
        <div className='container'>
            <div className='search'>
                <h1>成语词典Plus版</h1>
                <input
                    onKeyUp={handleKeyUp}
                    type='text'
                    placeholder='请输入您想查询的成语...'
                />
            </div>
            {idiomObject.name && (
                <div className='markdown-body'>
                    <h1>{idiomObject.name}</h1>
                    <p>{idiomObject.explanation || '没有找到释义'}</p>
                    <h2>例句</h2>
                    {idiomObject.sentence ? (
                        <ul>
                            {idiomObject.sentence.map((item, index) => {
                                // 将成语高亮
                                const html = item.replace(
                                    idiomObject.name,
                                    `<b>${idiomObject.name}</b>`
                                )
                                return (
                                    <li
                                        key={index}
                                        dangerouslySetInnerHTML={{
                                            __html: html,
                                        }}
                                    />
                                )
                            })}
                        </ul>
                    ) : (
                        <p>没有找到该成语例句</p>
                    )}
                    <h2>真题</h2>
                    <p>
                        {idiomObject.url ? (
                            <a
                                href={idiomObject.url}
                                target='_blank'
                                rel='noreferrer'
                            >
                                真题练习
                            </a>
                        ) : (
                            <p>没有找到相关的真题</p>
                        )}
                    </p>
                </div>
            )}
        </div>
    )
}

export default Idiom
