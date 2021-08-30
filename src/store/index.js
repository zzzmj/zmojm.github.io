import { configureStore } from '@reduxjs/toolkit'
import annotationReducer from '../feature/edit/Annotation/AnnotationSlice'
import headerReducer from '../feature/edit/Header/HeaderSlice'

export const store = configureStore({
    reducer: {
        annotation: annotationReducer,
        header: headerReducer,
    },
})
