import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    filterObject: {
        filterId: string
        values: string[]
    }[]
	filtersFieldLength: {
		fieldId: string
		productsLength: number
	}[]
    filters: string[][]
    limit: number
    page: number
	variantsFilter: string[]
	minPrice?: number
	maxPrice?: number
}

const initialState: IState = {
	filterObject: [],
	filters: [[]],
	filtersFieldLength: [],
	limit: 4,
	page: 1,
	variantsFilter: [],
	minPrice: undefined,
	maxPrice: undefined,
}

const generateFilters = (filterObject: IState['filterObject']) =>
    filterObject.reduce<IState['filters']>((result, {values}) => result.concat([values]), [])

const filtersSlice = createSlice({
	initialState,
	name: "filtersSlice",
	reducers: {
		initFilterObject: (state, { payload }: PayloadAction<{ filterId: string; valueIds: string[] }[]>) => {
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
		toggleFilterValue: (state, { payload }: PayloadAction<{ filterId: string; valueId: string }>) => {
			const { filterId, valueId } = payload
			const filter = state.filterObject.find((item) => item.filterId === filterId)

			if (!filter) {
				const filterObject = state.filterObject.concat({ filterId, values: [valueId] })
				const filters = generateFilters(filterObject)
				state.filterObject = filterObject
				state.filters = filters
				state.page = initialState.page
			} else {
				const index = filter.values.findIndex((item: string) => item === valueId)
				if (index === -1) {
					filter.values.push(valueId)
				} else {
					filter.values.splice(index, 1)
				}
				const filters = generateFilters(state.filterObject)
				state.filters = filters
				state.page = initialState.page
			}
		},
		nextPage: (state) => {
			++state.page
		},
		toggleVariantsFilter: (state, { payload }: PayloadAction<string>) => {
			const index = state.variantsFilter.findIndex((item) => item === payload)
			if (index === -1) {
				state.variantsFilter.push(payload)
			} else {
				state.variantsFilter.splice(index, 1)
			}
			state.page = 1
		},
		setFiltersLength(state, { payload }: PayloadAction<IState["filtersFieldLength"]>) {
			state.filtersFieldLength = payload
		},
		setMinPrice: (state, { payload }: PayloadAction<number>) => {
			state.minPrice = payload
			state.page = 1
		},
		setMaxPrice: (state, { payload }: PayloadAction<number>) => {
			state.maxPrice = payload
			state.page = 1
		},
		resetFilters: () => initialState,
	},
})

export const { initFilterObject, nextPage, toggleFilterValue, resetFilters, toggleVariantsFilter, setFiltersLength, setMaxPrice, setMinPrice } = filtersSlice.actions
export default filtersSlice