import { configureStore } from '@reduxjs/toolkit'
import annotationReducer from '../feature/edit/Annotation/AnnotationSlice'
import headerReducer from '../feature/edit/Header/HeaderSlice'
import BookReducer from '../feature/book/BookSlice'

export const store = configureStore({
    reducer: {
        annotation: annotationReducer,
        header: headerReducer,
        book: BookReducer,
    },
})
