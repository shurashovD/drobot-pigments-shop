import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface IState {
    checkedVariant?: string
}

const initialState: IState = {}

const productPageSlice = createSlice({
    initialState,
    name: 'productPageSlice',
    reducers: {
        resetCheckedVariant(state) {
            state.checkedVariant = undefined
        },
        setCheckedVariant(state, { payload }: PayloadAction<string|undefined>) {
            state.checkedVariant = payload
        }
    }
})

export const { resetCheckedVariant, setCheckedVariant } = productPageSlice.actions
export default productPageSlice