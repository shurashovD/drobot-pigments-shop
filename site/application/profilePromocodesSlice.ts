import { PayloadAction } from '@reduxjs/toolkit';
import { IPromocodeDetails } from './../../shared/index.d';
import { createSlice } from '@reduxjs/toolkit';
import { Ref, RefCallback } from 'react';

interface IState {
    activeTab: string
    editedPromocode?: IPromocodeDetails
    lastPromocodeName?: string
    form: {
        code: string
        dateStart: string
        dateFinish: string
    }
    isCreate?: boolean
	showCalendar: boolean
}

const initialState: IState = {
    activeTab: "1",
    form: {
        code: '', dateFinish: "", dateStart: ""
    },
	showCalendar: false
}

const profilePromocodesSlice = createSlice({
	initialState,
	name: "profilePromocodesSlice",
	reducers: {
		watchAllPromocodes: (state) => {
			state.activeTab = "1"
			state.form = initialState.form
		},
		createPromocode: (state) => {
			state.activeTab = "2"
			state.form = initialState.form
            delete state.editedPromocode
		},
		setForm: (state, { payload }: PayloadAction<{ key: "code" | "dateStart" | "dateFinish"; value: string }>) => {
			state.form[payload.key] = payload.value
		},
		editPromocode: (state, { payload }: PayloadAction<IPromocodeDetails>) => {
			const { code, dateFinish, dateStart } = payload
			state.form = { code, dateFinish: dateFinish.toString(), dateStart: dateStart.toString() }
			state.editedPromocode = payload
			state.activeTab = "2"
		},
		promocodeIsCreated: (state) => {
			state.lastPromocodeName = state.form.code
			state.form = initialState.form
			state.isCreate = true
			state.activeTab = "1"
		},
		promocodeIsUpdated: (state) => {
			state.lastPromocodeName = state.form.code
			state.form = initialState.form
			state.activeTab = "1"
            delete state.editedPromocode
		},
        resetLastPromocodeName: state => {
            delete state.isCreate
            delete state.lastPromocodeName
        },
		setShowCalendar: (state, {payload}: PayloadAction<boolean>) => {
			state.showCalendar = payload
		}
	},
})

export const { 
    createPromocode,
    editPromocode,
    promocodeIsCreated,
    promocodeIsUpdated,
    resetLastPromocodeName,
    setForm,
	setShowCalendar,
    watchAllPromocodes
} = profilePromocodesSlice.actions

export default profilePromocodesSlice