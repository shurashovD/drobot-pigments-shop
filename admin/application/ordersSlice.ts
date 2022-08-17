import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { IOrder, IOrderPop } from '../../shared';

interface IState {
    orders: IOrderPop[]
    news: IOrderPop[]
}

const initialState: IState = {
    orders: [],
    news: []
}

const ordersSlice = createSlice({
    initialState,
    name: 'ordersSlice',
    reducers: {
        resetNew: (state, { payload }: PayloadAction<string>) => {
            const index = state.news.findIndex(({ id }) => id === payload)
            if ( index !== -1 ) {
                state.news.splice(index, 1)
            }
        },
        setOrders: (state, {payload}: PayloadAction<IOrderPop[]>) => ({
            ...state, orders: payload, news: payload.filter(({ status }) => status === 'new')
        })
    }
})

export const { resetNew, setOrders } = ordersSlice.actions

export default ordersSlice