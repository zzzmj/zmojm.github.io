// 获取qIds
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

function useQuestionIds() {
    const [questionIds, setQuestionIds] = useState([])
    const params = useParams()
    useEffect(() => {
        const id = params.objectId
        if (id && id.includes(',')) {
            const qIds = id
                .split(',')
                .filter(item => item != '')
                .map(item => parseInt(item))
            setQuestionIds(qIds)
        }
    }, [params])
    return {
        questionIds,
    }
}

export default useQuestionIds
