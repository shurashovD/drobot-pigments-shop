import { createSlice,createAsyncThunk, AnyAction } from "@reduxjs/toolkit"
import { PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';

interface IState {
	delivery?: number
    products: {
		checked: boolean
        productId: string
        quantity: number
    }[],
	total?: number
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
					checked: false,
					productId: payload,
					quantity: 1,
				})
			} else {
				++state.products[index].quantity
			}
		},
		clearCart: () => ({ products: [] }),
		rmChecked: state => {
			state.products = state.products.filter(({ checked }) => !checked)
		},
		rmFromCart: (state, { payload }: PayloadAction<string>) => {
			const index = state.products.findIndex(
				({ productId }) => productId === payload
			)
			if (index !== -1) {
				if (state.products[index].quantity === 1) {
					state.products.splice(index, 1)
				} else {
					--state.products[index].quantity
				}
			}
		},
		setQuantity: (
			state,
			{ payload }: PayloadAction<{ productId: string; quantity: number }>
		) => {
			const index = state.products.findIndex(
				({ productId }) => productId === payload.productId
			)
			if (index !== -1) {
				if (payload.quantity === 0) {
					state.products.splice(index, 1)
				} else {
					state.products[index].quantity = payload.quantity
				}
			}
		},
		toggleCheckInCart: (state, { payload }: PayloadAction<string>) => {
			const index = state.products.findIndex(
				({ productId }) => productId === payload
			)
			if (index !== -1) {
				state.products[index].checked = !state.products[index].checked
			}
		},
		toggleCheckAll: state => {
			const checked = !state.products.every(({ checked }) => checked)
			state.products = state.products.map(item => ({ ...item, checked }))
		}
	},
})

export const { addToCart, clearCart, rmChecked, rmFromCart, setQuantity, toggleCheckAll, toggleCheckInCart } = cartSlice.actions

export default cartSlice