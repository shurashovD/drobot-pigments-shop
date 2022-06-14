import { createSlice,createAsyncThunk, AnyAction } from "@reduxjs/toolkit"
import { PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';

interface IState {
	delivery?: number
	products: {
		checked: boolean
		productId: string
		quantity: number
	}[]
	variants: {
		checked: boolean
		productId: string
		variantId: string
		quantity: number
	}[]
	total?: number
}

const initialState: IState = {
    products: [],
	variants: []
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
		addVariantToCart: (state, { payload }: PayloadAction<{productId: string, variantId: string}>) => {
			const index = state.variants.findIndex(
				({ variantId }) => variantId === payload.variantId
			)
			if (index === -1) {
				state.variants.push({
					checked: false,
					productId: payload.productId,
					variantId: payload.variantId,
					quantity: 1,
				})
			} else {
				++state.variants[index].quantity
			}
		},
		clearCart: () => initialState,
		rmChecked: (state) => {
			state.products = state.products.filter(({ checked }) => !checked)
			state.variants = state.variants.filter(({ checked }) => !checked)
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
		rmVariantFromCart: (state, { payload }: PayloadAction<string>) => {
			const index = state.variants.findIndex(
				({ variantId }) => variantId === payload
			)
			if (index !== -1) {
				if (state.variants[index].quantity === 1) {
					state.variants.splice(index, 1)
				} else {
					--state.variants[index].quantity
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
		setVariantQuantity: (
			state,
			{ payload }: PayloadAction<{ variantId: string; quantity: number }>
		) => {
			const index = state.variants.findIndex(
				({ variantId }) => variantId === payload.variantId
			)
			if (index !== -1) {
				if (payload.quantity === 0) {
					state.variants.splice(index, 1)
				} else {
					state.variants[index].quantity = payload.quantity
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
		toggleCheckVariantInCart: (state, { payload }: PayloadAction<string>) => {
			const index = state.variants.findIndex(
				({ variantId }) => variantId === payload
			)
			if (index !== -1) {
				state.variants[index].checked = !state.variants[index].checked
			}
		},
		toggleCheckAll: (state) => {
			let checked = true
			if ( state.products.length > 0 ) {
				checked &&= !state.products.every(({ checked }) => checked)
			}
			if ( state.variants.length > 0 ) {
				checked &&= !state.variants.every(({ checked }) => checked)
			}
			state.products = state.products.map((item) => ({
				...item,
				checked,
			}))
			state.variants = state.variants.map((item) => ({
				...item,
				checked,
			}))
		},
	},
})

export const {
	addToCart,
	addVariantToCart,
	clearCart,
	rmChecked,
	rmFromCart,
	rmVariantFromCart,
	setQuantity,
	setVariantQuantity,
	toggleCheckAll,
	toggleCheckInCart,
	toggleCheckVariantInCart
} = cartSlice.actions

export default cartSlice