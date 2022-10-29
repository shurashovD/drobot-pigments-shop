import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    categoryId?: string
    firstGoodId?: string
    secondGoodId?: string
}

const initialState: IState = {}

const compareSlice = createSlice({
	initialState,
	name: "compareSlice",
	reducers: {
		setCategory(state, { payload }: PayloadAction<string>) {
			state.categoryId = payload
		},
		setFirstGood(state, { payload }: PayloadAction<string | undefined>) {
			state.firstGoodId = payload
		},
		setSecondGood(state, { payload }: PayloadAction<string | undefined>) {
			state.secondGoodId = payload
		},
	},
})

export const { setCategory, setFirstGood, setSecondGood } = compareSlice.actions
export default compareSlice