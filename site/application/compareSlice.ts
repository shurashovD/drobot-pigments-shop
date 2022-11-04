import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    categoryId?: string
	allProps: boolean
	scrolled: boolean
	scrollLeft: number
	leftFeedIndex: number
	rightFeedIndex: number
}

const initialState: IState = {
	allProps: true,
	scrolled: false,
	scrollLeft: 0,
	leftFeedIndex: 0,
	rightFeedIndex: 0,
}

const compareSlice = createSlice({
	initialState,
	name: "compareSlice",
	reducers: {
		setCategory(state, { payload }: PayloadAction<string | undefined>) {
			state.categoryId = payload
		},
		setScrolled(state, { payload }: PayloadAction<boolean>) {
			state.scrolled = payload
		},
		setScrollLeft(state, { payload }: PayloadAction<number>) {
			state.scrollLeft = Math.max(payload, 0)
		},
		setAllProps(state, { payload }: PayloadAction<boolean>) {
			state.allProps = payload
		},
		setLeftIndex(state, { payload }: PayloadAction<number|undefined>) {
			state.leftFeedIndex = payload || 0
		},
		setRightIndex(state, { payload }: PayloadAction<number|undefined>) {
			state.rightFeedIndex = payload || 0
		},
	},
})

export const { setAllProps, setCategory, setLeftIndex, setScrolled, setRightIndex, setScrollLeft } = compareSlice.actions
export default compareSlice