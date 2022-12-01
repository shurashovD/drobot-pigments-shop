import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from './store'

interface IState {
	isHiding: boolean
	isShowing: boolean
	pane: string
    show: boolean
}

const initialState: IState = {
	isHiding: false,
	isShowing: false,
	pane: "0",
    show: false
}

export const showCatalog = createAsyncThunk<void, number, { dispatch: AppDispatch, state: RootState }>(
	'navCatalogSlice/showingCatalog',
	async (ms = 200) => {
		try {
			await new Promise(resolve => setTimeout(resolve, ms))
		}
		catch (e) {
			throw e
		}
	}
)

export const hideCatalog = createAsyncThunk<
	void,
	number,
	{ dispatch: AppDispatch; state: RootState }
>("navCatalogSlice/hidingCatalog", async (ms = 200) => {
	try {
		await new Promise((resolve) => setTimeout(resolve, ms))
	} catch (e) {
		throw e
	}
})

const navCatalogSlice = createSlice({
	initialState,
	name: "navCatalogSlice",
	extraReducers: builder => {
		builder.addCase(showCatalog.pending, state => {
			state.show = false
			state.isShowing = true
		}),
		builder.addCase(showCatalog.fulfilled, state => {
			state.isShowing = false
			state.show = true
		}),
		builder.addCase(hideCatalog.pending, state => {
			state.show = true
			state.isHiding = true
		}),
		builder.addCase(hideCatalog.fulfilled, state => {
			state.isHiding = false
			state.show = false
		})
	},
	reducers: {
		hideNavCatalog: (state) => ({ ...state, show: false }),
		setPane(state, { payload }: PayloadAction<string|undefined>) {
			state.pane = payload || "0"
		},
		showNavCatalog: (state) => ({ ...state, show: true }),
	},
})

export const { hideNavCatalog, setPane, showNavCatalog } = navCatalogSlice.actions

export default navCatalogSlice