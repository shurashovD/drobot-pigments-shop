import { ICart } from './../../shared/index.d';
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from '@reduxjs/toolkit';

interface IState {
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
	isLoading: boolean
	cartBusy: boolean
}

const initialState: IState = {
    products: [],
	variants: [],
	isLoading: false,
	cartBusy: false
}

const cartSlice = createSlice({
	initialState,
	name: "cartSlice",
	reducers: {
		setCart: (state, { payload }: PayloadAction<ICart>) => {
			const products = payload.products.map(item => ({
				...item, checked: state.products.find(({ productId }) => productId === item.productId)?.checked || false
			}))
			const variants = payload.variants.map(item => ({
				...item, checked: state.variants.find(({ variantId }) => variantId === item.variantId)?.checked || false
			}))
			state.products = products
			state.variants = variants
			state.cartBusy = false
		},
		setCartBusy: (state, { payload }: PayloadAction<boolean>) => {
			state.cartBusy = payload
		},
		setLoading: (state, { payload }: PayloadAction<boolean>) => {
			state.isLoading = payload
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
	setCart,
	setCartBusy,
	setLoading,
	toggleCheckAll,
	toggleCheckInCart,
	toggleCheckVariantInCart
} = cartSlice.actions

export default cartSlice