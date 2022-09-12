import { Skeleton } from 'antd'
import React from 'react'

function SkeletonList(props) {
    const count = props.count
    const list = new Array(count).fill(0)
    return (
        <div className='skeleton-list'>
            {list.map((item, index) => {
                return <Skeleton key={index} active />
            })}
        </div>
    )
}

export default SkeletonList
