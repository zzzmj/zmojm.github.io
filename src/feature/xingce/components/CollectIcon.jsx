// 收藏组件
import React from 'react'
import './CollectIcon.scss'

const CollectIcon = props => {
    const { checked } = props
    const url = checked
        ? 'https://nodestatic.fbstatic.cn/weblts_spa_online/tiku/static/collected-btn.d4120fd14a7eda0e8e50.png'
        : 'https://nodestatic.fbstatic.cn/weblts_spa_online/tiku/static/collect-btn.e0cca1095b2514b3e6c5.png'
    const handleClick = () => {
        props.onClick && props.onClick()
    }
    return (
        <span onClick={handleClick} className='collect-icon'>
            <img src={url} alt='' />
        </span>
    )
}

export default CollectIcon
