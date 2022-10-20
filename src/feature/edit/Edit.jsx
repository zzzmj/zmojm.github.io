import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from './Header/Header'
import Annotation from './Annotation/Annotation'
import Comment from './Comment/Comment'
import Highlighter from 'web-highlighter'

const Edit = () => {
    const params = useParams()
    const [highlighter, setHighlighter] = useState(
        new Highlighter({
            exceptSelectors: ['.ant-list-item'],
        })
    )
    useEffect(() => {
        const h = new Highlighter({
            exceptSelectors: ['.ant-list-item'],
        })
        setHighlighter(h)

        return () => {
            h.dispose()
        }
    }, [params])

    return (
        <div className='yryr-home'>
            <Header />
            <div className='main'>
                <Annotation key={highlighter} highlighter={highlighter} />
                <Comment key={highlighter} highlighter={highlighter} />
            </div>
        </div>
    )
}

export default Edit
