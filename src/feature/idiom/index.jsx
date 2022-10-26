import React, { useEffect, useState } from 'react'
import sentenceList from './sentence.json'
import idiomList from './idiom.json'
import SearchSvg from './icon.svg'
import './github.css'
import './index.scss'
// 成语查询页面
function Idiom() {
    const [idiomObject, setIdiomObject] = useState({
        name: '',
        explanation: '',
        sentence: [],
        url: '',
        questionCount: 0,
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
                questionCount: q ? q.ids.length : 0,
            })
        }
    }

    useEffect(() => {
        document.title = '成语查询'
    }, [])

    return (
        <div className='container'>
            <div className='title'>
                <h1>成语词典Plus版</h1>
            </div>
            <div className='search'>
                <div className='icon'>
                    <svg
                        t='1666753462959'
                        viewBox='0 0 1024 1024'
                        version='1.1'
                        xmlns='http://www.w3.org/2000/svg'
                        p-id='2555'
                        width='20'
                        height='20'
                    >
                        <path
                            d='M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6c3.2 3.2 8.4 3.2 11.6 0l43.6-43.5c3.2-3.2 3.2-8.4 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z'
                            p-id='2556'
                            fill='#9aa0a6'
                        ></path>
                    </svg>
                </div>
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
                            <React.Fragment>
                                「{idiomObject.name}」在真题中出现过
                                {idiomObject.questionCount}
                                次，
                                <a
                                    href={idiomObject.url}
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    练习
                                </a>
                            </React.Fragment>
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
