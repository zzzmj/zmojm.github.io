import React, { useState, useEffect } from 'react'
import './TextBroadcast.scss'

const TextBroadcast = ({ texts }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(currentIndex => (currentIndex + 1) % texts.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [texts])

    return (
        <div className='text-broadcast'>
            {texts.map((text, index) => (
                <div
                    key={index}
                    className={`text-broadcast-item ${
                        index === currentIndex ? 'active' : ''
                    }`}
                >
                    {text}
                </div>
            ))}
        </div>
    )
}

export default TextBroadcast
