// 隐藏元素hooks

import { useEffect, useState } from 'react'
import { removeDuplicateElements } from '../../../utils'
import useQuestionIds from './useQuestionIds'
function useVisibleData({
    dataSource,
    visibleIdList,
    sortType,
    correctRate,
    hasVideo,
}) {
    const [visibleData, setVisibleData] = useState([])
    const { questionIds } = useQuestionIds()

    useEffect(() => {
        // 给元素排序
        let data = removeDuplicateElements([...dataSource], 'id')
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
            data = data.filter(item => {
                return visibleIdList.includes(String(item.id))
            })
            setVisibleData(data)
        }

        if (correctRate && correctRate.left && correctRate.right) {
            // 验证答案
            const l = parseInt(correctRate.left)
            const r = parseInt(correctRate.right)
            data = data.filter(item => {
                return (
                    item.questionMeta.correctRatio >= l &&
                    item.questionMeta.correctRatio <= r
                )
            })
            setVisibleData(data)
        }

        if (hasVideo) {
            data = data.filter(item => item.video)
            setVisibleData(data)
        } else {
            setVisibleData(data)
        }
    }, [
        dataSource,
        visibleIdList,
        sortType,
        questionIds,
        correctRate,
        hasVideo,
    ])
    return {
        visibleData,
    }
}

export default useVisibleData
