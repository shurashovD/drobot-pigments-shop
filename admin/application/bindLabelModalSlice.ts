import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface IState {
    bindId?: string
    bindProductId?: string
    productId?: string
    show: boolean
}

const initialState: IState = {
    bindId: undefined,
    bindProductId: undefined,
    productId: undefined,
    show: false
}

const bindLabelModalSlice = createSlice({
	initialState,
	name: "bindLabelModalSlice",
    reducers: {
        hideBindLabelModal: (state) => {
            state.bindId = undefined
            state.bindProductId = undefined
            state.productId = undefined
            state.show = false
        },
        showBindLabelModal: (state, { payload }: PayloadAction<{bindId: string, bindProductId: string, productId: string}>) => {
            state.bindId = payload.bindId
            state.bindProductId = payload.bindProductId
            state.productId = payload.productId
            state.show = true
        }
    }
})

export const { hideBindLabelModal, showBindLabelModal } = bindLabelModalSlice.actions

export default bindLabelModalSlice