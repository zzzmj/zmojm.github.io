import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    annotationList: [], // {id, text, }
    config: {}, // 文章的配置信息, 等级，来源，国籍
}

export const Annotation = createSlice({
    name: 'annotation',
    initialState,
    reducers: {
        initAnnotation: (state, action) => {
            const obj = action.payload
            const { annotation, score, nationality, source } = obj
            state.annotationList = annotation || []
            state.config = {
                score,
                nationality,
                source,
            }
        },
        createAnnotation: (state, action) => {
            const mark = action.payload
            // 如果mark已经存在在annotationList中，则不被添加
            const repeat = state.annotationList.some(
                item => item.id === mark.id
            )
            if (!repeat) {
                state.annotationList.push(mark)
            }
        },
        deleteAnnotation: (state, action) => {
            const id = action.payload
            state.annotationList = state.annotationList.filter(
                item => item.id !== id
            )
        },
    },
})

export const { initAnnotation, createAnnotation, deleteAnnotation } =
    Annotation.actions

export default Annotation.reducer
