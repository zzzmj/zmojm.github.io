import { createSlice, nanoid } from '@reduxjs/toolkit'
import { presetColor } from '../../utils'
// 预设的颜色

const initialState = {
    categoryList: [
        // {
        //     id: '', // 唯一id
        //     text: '', // 文案
        //     color: '', // 颜色
        //     type: '', // 标注类型 accpet | wrong
        // },
    ],
}

export const Header = createSlice({
    name: 'header',
    initialState,
    reducers: {
        createCategory: (state, action) => {
            const len = state.categoryList.length
            const index = len < presetColor.length ? len : presetColor.length
            console.log(
                'presetColor[index].key',
                presetColor[index],
                presetColor[index].key
            )
            const category = {
                id: nanoid(),
                text: '',
                color: presetColor[index].key,
                type: 'accept',
            }
            state.categoryList.push(category)
        },
        changeCategory: (state, action) => {
            const { id, name, value } = action.payload
            console.log('action.payload', action.payload)
            state.categoryList = state.categoryList.map(item => {
                if (id === item.id) {
                    return {
                        ...item,
                        [name]: value,
                    }
                } else {
                    return item
                }
            })
        },
    },
})

export const { createCategory, changeCategory } = Header.actions

export default Header.reducer
