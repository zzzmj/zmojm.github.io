// 隐藏元素hooks

import { message } from 'antd'
import { useEffect, useState } from 'react'
import { removeDuplicateElements, extractChineseWords } from '../../../utils'
import useQuestionIds from './useQuestionIds'
function useVisibleData({
    dataSource,
    visibleIdList,
    sortType,
    correctRate,
    hasVideo,
    optionKeyword,
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

        // 按照正确率过滤元素
        if (correctRate && correctRate.left && correctRate.right) {
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

        // 按照选项关键词筛选
        if (optionKeyword) {
            const map = getMapIdiomToIds(data)
            if (map[optionKeyword]) {
                data = data.filter(item => {
                    return map[optionKeyword].ids.has(item.id)
                })
                setVisibleData(data)
            }
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
        optionKeyword,
    ])

    var getMapIdiomToIds = data => {
        // 智能排序
        // 统计词频
        const mapIdiomToIds = {}
        data.map(question => {
            const options = question.accessories[0].options
            // 将词语纳入数组中
            let idiomArr = []
            options.forEach(item => {
                const idioms = extractChineseWords(item).map(item => ({
                    name: item,
                }))
                idiomArr = idiomArr.concat(idioms)
            })
            // 去除重复的词语
            idiomArr = removeDuplicateElements(idiomArr, 'name')

            idiomArr.forEach(idiom => {
                if (mapIdiomToIds[idiom.name]) {
                    mapIdiomToIds[idiom.name].count++
                    mapIdiomToIds[idiom.name].ids.add(question.id)
                } else {
                    mapIdiomToIds[idiom.name] = {
                        ids: new Set([question.id]),
                        count: 1,
                    }
                }
            })

            return {
                id: question.id,
                options: idiomArr,
            }
        })
        // const arr = Object.keys(mapIdiomToIds)
        //     .map(key => {
        //         return {
        //             name: key,
        //             ...mapIdiomToIds[key],
        //         }
        //     })
        //     .sort((a, b) => a.count - b.count)
        return mapIdiomToIds
    }

    return {
        visibleData,
    }
}

export default useVisibleData
