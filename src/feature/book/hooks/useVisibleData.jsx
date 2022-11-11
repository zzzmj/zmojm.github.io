// 隐藏元素hooks

import { useEffect, useState } from 'react'
import useQuestionIds from './useQuestionIds'
function useVisibleData(dataSource, visibleIdList, sortType) {
    const [visibleData, setVisibleData] = useState([])
    const { questionIds } = useQuestionIds()

    useEffect(() => {
        // 给元素排序
        let data = [...dataSource]
        const mapNumToSort = {
            1: (a, b) => questionIds.indexOf(a.id) - questionIds.indexOf(b.id),
            2: (a, b) => b.questionMeta.totalCount - a.questionMeta.totalCount,
            3: (a, b) =>
                a.questionMeta.correctRatio - b.questionMeta.correctRatio,
            4: (a, b) =>
                b.questionMeta.correctRatio - a.questionMeta.correctRatio,
        }
        // 1按照默认顺序, 2按照频率排序, 3正确率正序排序, 4正确率倒序排序
        if (sortType) {
            data.sort(mapNumToSort[sortType])
        }

        if (data.length <= 0 || visibleIdList.length <= 0) {
            setVisibleData(data)
        } else {
            const data = data.filter(item => {
                return visibleIdList.includes(String(item.id))
            })
            setVisibleData(data)
        }
    }, [dataSource, visibleIdList, sortType, questionIds])
    return {
        visibleData,
    }
}

export default useVisibleData
