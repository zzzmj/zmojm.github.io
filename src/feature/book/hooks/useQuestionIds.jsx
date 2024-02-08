// 获取qIds
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setQuestionIds } from '../BookSlice'

function useQuestionIds() {
    const dispatch = useDispatch()
    const questionIds = useSelector(state => state.book.questionIds)
    const params = useParams()
    useEffect(() => {
        const id = params.objectId
        if (id && id.includes(',')) {
            const qIds = id
                .split(',')
                .filter(item => item != '')
                .map(item => parseInt(item))
            dispatch(setQuestionIds(qIds))
            // setQuestionIds(qIds)
        }
    }, [params])

    return {
        questionIds
    }
}

export default useQuestionIds
