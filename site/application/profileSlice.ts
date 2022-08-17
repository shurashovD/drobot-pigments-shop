import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface IState {
	showAuthModal: boolean
	client?: {
		name?: string
		initials?: string
		mail?: string
		phone?: string
		isCounterparty: boolean
        status?: string
	}
	successModal: {
		show: boolean
		message?: string
	}
}

const initialState: IState = {
	showAuthModal: false,
	successModal: {
		show: false,
	}
}

const profileSlice = createSlice({
    initialState,
    name: 'profileSlice',
    reducers: {
        setShowAuthModal: (state, { payload }: PayloadAction<boolean>) => {
            state.showAuthModal = payload
        },
        setProfileClient: (state, {payload}: PayloadAction<IState['client']>) => {
            state.client = payload
        },
        profileToggleSuccesModal: (state, { payload }: PayloadAction<string | undefined>) => {
            state.successModal.show = !!payload
            state.successModal.message = payload
        },
    }
})

export const {
    setProfileClient,
    setShowAuthModal,
    profileToggleSuccesModal,
} = profileSlice.actions

export default profileSlice