// 隐藏元素hooks

import { useEffect, useState } from 'react'

function useVisibleData(dataSource, questionIds) {
    const [visibleData, setVisibleData] = useState([])
    useEffect(() => {
        if (dataSource.length <= 0 || questionIds.length <= 0) {
            setVisibleData(dataSource)
        } else {
            const data = dataSource.filter(item => {
                return questionIds.includes(String(item.id))
            })
            setVisibleData(data)
        }
    }, [dataSource, questionIds])
    return {
        visibleData,
    }
}

export default useVisibleData
