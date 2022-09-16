import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IInitialState {
    show: boolean
    text: string | undefined
    variant: 'danger' | 'success' | 'warning' | 'primary'
	orderNumber?: string
	failedOrder?: boolean
	redirectUrl?: string
}

const initialState: IInitialState = {
    show: false,
	text: undefined,
    variant: 'success'
}

const alertSlice = createSlice({
	initialState,
	name: "alertSlice",
	reducers: {
		errorAlert: (state, { payload }: PayloadAction<string>) => {
			state.show = true
			state.text = payload
			state.variant = "danger"
		},
		successAlert: (state, { payload }: PayloadAction<string>) => {
			state.show = true
			state.text = payload
			state.variant = "success"
		},
		hideAlert: (state) => {
			state.show = false
			state.text = undefined
			state.failedOrder = undefined
			state.orderNumber = undefined
		},
		setRedirectUrl: (state, { payload }: PayloadAction<string>) => {
			state.redirectUrl = payload
		},
		resetRedirectUrl: (state) => {
			delete state.redirectUrl
		},
		setOrderAlert: (state, {payload}: PayloadAction<{orderNumber: string, failedOrder: boolean}>) => {
			state.failedOrder = payload.failedOrder
			state.orderNumber = payload.orderNumber
			state.show = true
			state.variant = payload.failedOrder ? "danger" : "success"
		}
	},
})

export const { errorAlert, hideAlert, successAlert, setRedirectUrl, resetRedirectUrl, setOrderAlert } = alertSlice.actions

export default alertSlice