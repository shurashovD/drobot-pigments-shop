import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
    authorization: boolean
    checkPin: boolean
    country: string
    number: string
    pin: string
    show: boolean
}

const initialState: IState = {
    authorization: true, checkPin: false, country: '', number: '', pin: '', show: false
}

const authComponentSlice = createSlice({
    initialState, name: 'authComponentSlice',
    reducers: {
        resetAuthComponent: () => initialState, 
        setCheckPin(state, { payload }: PayloadAction<boolean>) {
            state.checkPin = payload
        },
        setAuthorization(state, { payload }: PayloadAction<boolean>) {
            state.authorization = payload
        },
        setCountry(state, { payload }: PayloadAction<string>) {
            state.country = payload
        },
        setNumber(state, { payload }: PayloadAction<string>) {
            state.number = payload
        },
        setPin(state, { payload }: PayloadAction<string>) {
            state.pin = payload
        },
        setShow(state, { payload }: PayloadAction<boolean>) {
            if ( payload === false ) {
                return { ...initialState, show: false }
            }
            state.show = payload
        }
    }
})

export const { resetAuthComponent, setAuthorization, setCheckPin, setCountry, setNumber, setPin, setShow } = authComponentSlice.actions

export default authComponentSlice