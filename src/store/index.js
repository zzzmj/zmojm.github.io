import { configureStore } from '@reduxjs/toolkit'
import annotationReducer from '../feature/Annotation/AnnotationSlice'
import headerReducer from '../feature/Header/HeaderSlice'

export const store = configureStore({
    reducer: {
        annotaion: annotationReducer,
        header: headerReducer,
    },
})
