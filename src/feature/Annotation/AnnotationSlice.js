import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    markList: [], // {id, text, }
}

export const Annotation = createSlice({
    name: 'annotaion',
    initialState,
    reducers: {
        createAnnotaion: (state, action) => {
            // const component = action.payload
            // const { type } = component
            // if (type === 'rc-global') {
            //     state.componentList.unshift(component)
            // } else {
            //     state.componentList.push(component)
            // }
        },
    },
})

export const { createAnnotaion } = Annotation.actions

export default Annotation.reducer
