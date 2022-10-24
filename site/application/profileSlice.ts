import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface IState {
	successModal: {
		show: boolean
		message?: string
	}
}

const initialState: IState = {
	successModal: {
		show: false,
	}
}

const profileSlice = createSlice({
    initialState,
    name: 'profileSlice',
    reducers: {
        profileToggleSuccesModal: (state, { payload }: PayloadAction<string | undefined>) => {
            state.successModal.show = !!payload
            state.successModal.message = payload
        },
    }
})

export const {
    profileToggleSuccesModal,
} = profileSlice.actions

export default profileSlice