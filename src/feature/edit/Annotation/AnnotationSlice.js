import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    annotationList: [], // {id, text, }
}

export const Annotation = createSlice({
    name: 'annotation',
    initialState,
    reducers: {
        createAnnotaion: (state, action) => {
            const mark = action.payload
            state.annotationList.push(mark)
        },
        deleteAnnotation: (state, action) => {
            const id = action.payload
            state.annotationList = state.annotationList.filter(
                item => item.id !== id
            )
        },
    },
})

export const { createAnnotaion, deleteAnnotation } = Annotation.actions

export default Annotation.reducer
