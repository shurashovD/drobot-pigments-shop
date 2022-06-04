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
    limit: 12,
    page: 1
}

const filtersSlice = createSlice({
    initialState,
    name: 'filtersSlice',
    reducers: {
        initFilterObject: (state, { payload }: PayloadAction<string[]>) => {
            for (const i in payload) {
                const filterId = payload[i]
                state.filterObject.push({
                    filterId, values: []
                })
            }
        },
        toggleFilterValue: (state, { payload }: PayloadAction<{filterId: string, valueId: string}>) => {
            const { filterId, valueId } = payload
            const values = state.filterObject.find(item => item.filterId === filterId)?.values
            if (!values) return

            const index = values.findIndex((item: string) => item === valueId)
            if ( index === -1 ) {
                values.push(valueId)
            }
            else {
                values.splice(index, 1)
            }
            state.page = initialState.page
        },
        nextPage: state => {
            ++state.page
        },
        resetFilters: () => initialState
    }
})

export const { initFilterObject, nextPage, toggleFilterValue, resetFilters } = filtersSlice.actions
export default filtersSlice