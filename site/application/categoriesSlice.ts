import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { ICategory } from '../../shared';

interface IState {
    categories: ICategory[]
}

const initialState: IState = {
    categories: []
}

const categoriesSlice = createSlice({
    initialState,
    name: 'categoriesSlice',
    reducers: {
        setCategories: (state, { payload }: PayloadAction<ICategory[]>) => ({
            ...state, categories: payload
        })
    }
})

export const { setCategories } = categoriesSlice.actions

export default categoriesSlice