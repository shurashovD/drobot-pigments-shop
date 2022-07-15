import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    filterObject: {
        filterId: string
        values: string[]
    }[]
    filters: string[][]
    limit: number
    page: number
}

const initialState: IState = {
    filterObject: [],
    filters: [[]],
    limit: 4,
    page: 1
}

const generateFilters = (filterObject: IState['filterObject']) =>
    filterObject.reduce<IState['filters']>((result, {values}) => result.concat([values]), [])

const filtersSlice = createSlice({
	initialState,
	name: "filtersSlice",
	reducers: {
		initFilterObject: (
			state,
			{ payload }: PayloadAction<{ filterId: string; valueIds: string[] }[]>
		) => {
            state.filterObject = []
			for (const i in payload) {
				const { filterId, valueIds } = payload[i]
				state.filterObject.push({
					filterId,
					values: valueIds,
				})
			}
            state.filters = generateFilters(state.filterObject)
            state.page = initialState.page
		},
		toggleFilterValue: (
			state,
			{ payload }: PayloadAction<{ filterId: string; valueId: string }>
		) => {
			const { filterId, valueId } = payload
			const values = state.filterObject.find(
				(item) => item.filterId === filterId
			)?.values
			if (!values) return

			const index = values.findIndex((item: string) => item === valueId)
			if (index === -1) {
				values.push(valueId)
			} else {
				values.splice(index, 1)
			}
			state.page = initialState.page
            state.filters = generateFilters(state.filterObject)
		},
		nextPage: (state) => {
			++state.page
		},
		resetFilters: () => initialState,
	},
})

export const { initFilterObject, nextPage, toggleFilterValue, resetFilters } = filtersSlice.actions
export default filtersSlice