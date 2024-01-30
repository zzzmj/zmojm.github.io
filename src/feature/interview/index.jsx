import React from 'react'
import TextBroadcast from './components/TextBroadcast'

const Interview = () => {
    const texts = ['你好', 'see you', '但是呢']
    return (
        <div>
            <TextBroadcast texts={texts} />
        </div>
    )
}

export default Interview
