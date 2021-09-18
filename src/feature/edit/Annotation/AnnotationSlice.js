import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    annotationList: [], // {id, text, }
}

export const Annotation = createSlice({
    name: 'annotation',
    initialState,
    reducers: {
        initAnnotation: (state, action) => {
            const annotation = action.payload
            state.annotationList = annotation
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
