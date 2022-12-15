import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
	activeKey: "phone"|"pin"|"pass"
	authorization: boolean
	insertPass: boolean
	number: string
	pin: string
    pass: string
	doublePass: string
	show: boolean
}

const initialState: IState = {
	activeKey: 'phone',
    authorization: true,
	insertPass: false,
	number: "",
    pass: '',
	doublePass: '',
	pin: "",
	show: false,
}

const authComponentSlice = createSlice({
	initialState,
	name: "authComponentSlice",
	reducers: {
		resetAuthComponent: () => initialState,
		setInsertPhone(state) {
			state.activeKey = "phone"
		},
		setInsertPin(state) {
			state.activeKey = "pin"
			state.pin = ""
		},
		setInsertPass(state) {
			state.activeKey = "pass"
			state.pass = ""
			state.doublePass = ""
		},
		setAuthorization(state, { payload }: PayloadAction<boolean>) {
			state.authorization = payload
		},
		setNumber(state, { payload }: PayloadAction<string>) {
			state.number = payload
		},
		setPin(state, { payload }: PayloadAction<string>) {
			state.pin = payload
		},
		setPass(state, { payload }: PayloadAction<string>) {
			state.pass = payload
		},
		setDoublePass(state, { payload }: PayloadAction<string>) {
			state.doublePass = payload
		},
		setShow(state, { payload }: PayloadAction<boolean>) {
			if (payload === false) {
				return { ...initialState, show: false }
			}
			state.show = payload
		},
	},
})

export const {
	resetAuthComponent,
	setAuthorization,
	setInsertPass,
	setInsertPhone,
	setInsertPin,
	setNumber,
	setPin,
	setPass,
	setDoublePass,
	setShow
} = authComponentSlice.actions

export default authComponentSlice