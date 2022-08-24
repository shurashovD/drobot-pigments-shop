import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from '@reduxjs/toolkit';

interface IState {
	checkedProducts: string[]
	checkedVariants: string[]
}

const initialState: IState = {
    checkedProducts: [], checkedVariants: []
}

const cartSlice = createSlice({
	initialState,
	name: "cartSlice",
	reducers: {
		toggleCheckProductInCart: (state, { payload }: PayloadAction<string>) => {
			const index = state.checkedProducts.findIndex((item) => item === payload)
			if (index !== -1) {
				state.checkedProducts.push(payload)
			} else {
				state.checkedProducts.splice(index, 1)
			}
		},
		toggleCheckVariantInCart: (state, { payload }: PayloadAction<string>) => {
			const index = state.checkedVariants.findIndex((item) => item === payload)
			if (index !== -1) {
				state.checkedVariants.push(payload)
			} else {
				state.checkedVariants.splice(index, 1)
			}
		},
		toggleCheckAll: (state, { payload }: PayloadAction<{ cartProductsIds: string[]; cartVariantsIds: string[] }>) => {
			const { cartProductsIds, cartVariantsIds } = payload
			if (state.checkedProducts.length === 0 && state.checkedVariants.length === 0) {
				state.checkedProducts = cartProductsIds
				state.checkedVariants = cartVariantsIds
			} else {
				state.checkedProducts = []
				state.checkedVariants = []
			}
		},
		resetChekProduct: (state, { payload }: PayloadAction<{ productId: string }>) => {
			const index = state.checkedProducts.findIndex((item) => item === payload.productId)
			if (index !== -1) {
				state.checkedProducts.splice(index, 1)
			}
		},
		resetChekVariant: (state, { payload }: PayloadAction<{ variantId: string }>) => {
			const index = state.checkedVariants.findIndex((item) => item === payload.variantId)
			if (index !== -1) {
				state.checkedVariants.splice(index, 1)
			}
		},
		resetCheckAll: (state) => {
			state.checkedProducts = []
			state.checkedVariants = []
		}
	},
})

export const {
	toggleCheckAll,
	toggleCheckProductInCart,
	toggleCheckVariantInCart,
	resetCheckAll,
	resetChekProduct,
	resetChekVariant,
} = cartSlice.actions

export default cartSlice