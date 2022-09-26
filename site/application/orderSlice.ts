import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    available: string[],
    empty: string[],
    active?: string
    city?: string,
    sdek?: boolean,
    pickup?: boolean
    tariff?: number
    pvz?: string
    address?: string
    name?: string
    mail?: string
    phone?: string
	collapsedPvz?: string
}

const getAvailable = (state: IState) => {
    const res = ["1", "4"]
    if ( !!state.city ) {
        res.push("2")
    }
    if ( !!state.sdek ) {
        if (state.tariff === 139 && !!state.address ) {
            res.push("3")
        }
        if ( (state.tariff === 138 || state.tariff === 366) && !!state.pvz ) {
            res.push("3")
        }
    }
    if ( !!state.pickup ) {
        res.push("3")
    }
    return res
}

const getEmpty = (state: IState) => {
    const res: string[] = ["4"]
    if ( !state.city ) {
        res.push("1")
    }
    if ( !state.sdek && !state.address && !state.pvz && !state.tariff && !state.pickup ) {
        res.push('2')
    }
    if ( !state.name && !state.mail && !state.phone ) {
        res.push("3")
    }
    return res
}

const initialState: IState = {
    available: ["1", "4"],
    empty: ["1", "2", "3", "4"]
}

const orderSlice = createSlice({
	initialState,
	name: "orderSlice",
	reducers: {
		setActive: (state, { payload }: PayloadAction<string | undefined>) => {
			if (payload === state.active) {
				delete state.active
				return
			}
			if (payload) {
				state.active = payload
			} else {
				delete state.active
			}
		},
		setCity: (state, { payload }: PayloadAction<string | undefined>) => {
			if (payload) {
				state.city = payload
			} else {
				delete state.city
			}
			state.available = getAvailable(state)
			state.empty = getEmpty(state)
		},
		setSdek: (state, { payload }: PayloadAction<boolean>) => {
			state.sdek = payload
            if ( payload ) {
                delete state.pickup
            }
			state.available = getAvailable(state)
			state.empty = getEmpty(state)
		},
		setPickup: (state, { payload }: PayloadAction<boolean>) => {
			state.pickup = payload
            if ( payload ) {
                delete state.sdek
                delete state.pvz
                delete state.tariff
            }
			state.available = getAvailable(state)
			state.empty = getEmpty(state)
		},
		setSdekTariff: (state, { payload }: PayloadAction<{ tariff?: number; pvz?: string; address?: string }>) => {
			const { address, pvz, tariff } = payload
			if (address) {
				state.address = address
			} else {
				delete state.address
			}
			if (pvz) {
				state.pvz = pvz
			} else {
				delete state.pvz
			}
			if (tariff) {
				state.tariff = tariff
			} else {
				delete state.tariff
			}
			state.available = getAvailable(state)
			state.empty = getEmpty(state)
		},
		setPhone: (state, { payload }: PayloadAction<string | undefined>) => {
			if (payload) {
				state.phone = payload
			} else {
				delete state.phone
			}
			state.available = getAvailable(state)
			state.empty = getEmpty(state)
		},
		setNameMail: (state, { payload }: PayloadAction<{ name?: string; mail?: string }>) => {
			const { mail, name } = payload
			if (mail) {
				state.mail = mail
			} else {
				delete state.mail
			}
			if (name) {
				state.name = name
			} else {
				delete state.name
			}
			state.available = getAvailable(state)
			state.empty = getEmpty(state)
		},
		setCollapsedPvz: (state, {payload}: PayloadAction<string | undefined>) => {
			state.collapsedPvz = payload
		},
		resetOrderPage: (state) => {
			state = initialState
		},
	},
})

export const { setActive, setCity, setCollapsedPvz, setNameMail, setPickup, setPhone, setSdek, setSdekTariff, resetOrderPage } = orderSlice.actions

export default orderSlice