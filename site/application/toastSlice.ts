import { createSlice } from "@reduxjs/toolkit"

interface IState {
	type?: "cart"|"compare"|"favourites"
}

const initialState: IState = {}

const toastSlice = createSlice({
	initialState,
	name: "toastSlice",
	reducers: {
		addCartToast: (state) => ({ ...state, type: "cart" }),
		addCompareToast: (state) => ({ ...state, type: "compare" }),
		addFavouritesToast: (state) => ({ ...state, type: "favourites" }),
		clearToast: () => initialState,
	},
})

export const { addCartToast, addCompareToast, addFavouritesToast, clearToast } = toastSlice.actions
export default toastSlice