import { createSlice } from '@reduxjs/toolkit'
import { removeDuplicateElements } from '../../utils'
import { cloneDeep, isArray } from 'lodash'
import { provinceList } from './config'

function extractYearFromSource(source) {
    if (!source) return null
    // 正则表达式匹配四位数字年份
    const yearRegex = /\b(20\d{2}|19\d{2})\b/g
    // 执行匹配操作
    const matches = source.match(yearRegex)
    // 如果匹配到年份，则返回第一个匹配项（最常见的情况）
    // 如果没有匹配到或者需要其他处理，可以根据实际情况调整
    return matches ? matches[0] : null
}
function extractNumberFromSource(source) {
    if (!source) return null
    // 正则表达式匹配四位数字年份
    const yearRegex = /\d{2}题/g
    // 执行匹配操作
    const matches = source.match(yearRegex)
    // 如果匹配到年份，则返回第一个匹配项（最常见的情况）
    // 如果没有匹配到或者需要其他处理，可以根据实际情况调整
    return matches ? matches[0] : null
}

// 重构排序逻辑
const sortData = (data, sortType, questionIds) => {
    let questionIdMap = new Map()
    if (sortType === 1) {
        questionIdMap = new Map(questionIds.map((id, index) => [id, index]))
    }
    const mapNumToSort = {
        1: (a, b) => (questionIdMap.get(a.id) || 0) - (questionIdMap.get(b.id) || 0),
        2: (a, b) => b.questionMeta.totalCount - a.questionMeta.totalCount,
        3: (a, b) => a.questionMeta.correctRatio - b.questionMeta.correctRatio,
        4: (a, b) => b.questionMeta.correctRatio - a.questionMeta.correctRatio,
        5: (a, b) => b.createdYear - a.createdYear,
    }
    return data.sort(mapNumToSort[sortType])
}

// 重构过滤逻辑
const filterDataByCreatedTime = (data, createdTime) => {
    const diff = new Date().getFullYear() - createdTime
    return data.reduce((result, item) => {
        const createdYear = extractYearFromSource(item.source)
        const number = extractNumberFromSource(item.source)?.slice(0, -1)
        const p = provinceList.find(p => item.source.includes(p))
        if (createdYear >= diff && !item.source.includes('模考') && p) {
            result.push({
                ...item,
                createdYear,
                miniSource: `${createdYear}年${p === '国家' ? '国考' : p}${number}`,
            })
        }
        return result
    }, [])
}

const filterDataByProvince = (data, province) => {
    if (province === '全部') return data
    if (province === '除国家') {
        return data.filter(item => {
            return !item.source.includes('国家')
        })
    }
    const autonomyList = ["江苏", '浙江', '上海', '山东', '北京', '四川', '深圳']
    if (province === '参加联考') {
        return data.filter(item => {
            return !autonomyList.some(autonomy => item.source.includes(autonomy)) && !item.source.includes('国家');
        })
    }
    if (province === '自主命题') {
        return data.filter(item => {
            return autonomyList.some(autonomy => item.source.includes(autonomy));
        })
    }
    return data.filter(item => {
        return item.source.includes(province)
    })
}

// 更新后的getFilterDataListBySortType函数
const getFilterDataListBySortType = (dataSource, questionIds, { sortType, createdTime, province }) => {
    if (!Array.isArray(dataSource) || dataSource.length <= 0) return []
    let data = dataSource
    if (province) {
        data = filterDataByProvince(data, province)
    }

    if (createdTime) {
        data = filterDataByCreatedTime(data, createdTime)
    }

    if (sortType) {
        data = sortData(data, sortType, questionIds)
    }

    return data
}

const initialState = {
    questionIds: [],
    dataList: [],
    filterDataList: [],
    filter: {
        sortType: 5, // 排序规则
        count: 40, // 练习题数量
        createdTime: 3, // 创建时间
        province: '全部',
    },
}

export const Book = createSlice({
    name: 'book',
    initialState,
    reducers: {
        setList: (state, { payload }) => {
            const newDataList = removeDuplicateElements(payload, 'id')
            state.dataList = newDataList
            state.filterDataList = getFilterDataListBySortType(newDataList, state.questionIds, state.filter)
        },
        updateList: (state, { payload }) => {
            state.filterDataList = payload
        },
        setFilter: (state, { payload }) => {
            const { type, value } = payload
            state.filter[type] = value
            state.filterDataList = getFilterDataListBySortType(state.dataList, state.questionIds, state.filter)
        },
        setQuestionIds: (state, { payload }) => {
            state.questionIds = payload
            state.filterDataList = getFilterDataListBySortType(state.dataList, state.questionIds, state.filter)
        },
    },
})

export const { setList, setFilter, setQuestionIds, updateList } = Book.actions

export default Book.reducer
