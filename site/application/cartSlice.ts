import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface IState {
    products: {
        productId: string
        quantity: number
    }[]
}

const initialState: IState = {
    products: []
}

const cartSlice = createSlice({
	initialState,
	name: "cartSlice",
	reducers: {
		addToCart: (state, { payload }: PayloadAction<string>) => {
			const index = state.products.findIndex(
				({ productId }) => productId === payload
			)
			if (index === -1) {
				state.products.push({
					productId: payload,
					quantity: 1,
				})
			} else {
				++state.products[index].quantity
			}
		},
		rmFromCart: (state, { payload }: PayloadAction<string>) => {
			const index = state.products.findIndex(
				({ productId }) => productId === payload
			)
			if (index !== -1) {
                if (state.products[index].quantity === 1) {
                    state.products.splice(index, 1)
                }
                else {
                    --state.products[index].quantity
                }
			}
		}
	},
})

export const { addToCart, rmFromCart } = cartSlice.actions

export default cartSlice