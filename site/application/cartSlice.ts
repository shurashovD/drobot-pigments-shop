import { createAsyncThunk } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';

interface IState {
	delivery?: number
    products: {
		checked: boolean
        productId: string
        quantity: number
    }[],
	total?: number
	totalFetching: boolean
}

const initialState: IState = {
    products: [],
	totalFetching: false
}

export const toggleCheckInCart = createAsyncThunk<{total: number, productId: string}, string, { dispatch: AppDispatch, state: RootState }>(
	'cartSlice/toggleCheckInCart',
	async (productId, thunkAPI) => {
		try {
			const { getState } = thunkAPI
			const { cartSlice } = getState()
			const ids = cartSlice.products.filter(({ checked }) => checked).map(({ productId }) => productId)
			const index = ids.findIndex(item => item === productId)
			if ( index === -1 ) {
				ids.push(productId)
			}
			else {
				ids.splice(index, 1)
			}
			const request = await fetch(`/api/orders/cart-total/${JSON.stringify(ids)}`)
			const total = await request.json()
			return { total, productId }
		}
		catch (e) {
			console.log(e)
			throw e
		}
	}
)

const cartSlice = createSlice({
	initialState,
	name: "cartSlice",
	extraReducers: builder => {
		builder.addCase(toggleCheckInCart.pending, (state) => {
			state.totalFetching = true
		}),
		builder.addCase(toggleCheckInCart.fulfilled, (state, { payload }) => {
			state.totalFetching = false
			const index = state.products.findIndex(({ productId }) => productId === payload.productId)
			if ( index !== -1 ) {
				state.products[index].checked = !state.products[index].checked
			}
			state.total = payload.total
		}),
		builder.addCase(toggleCheckInCart.rejected, (state) => {
			state.totalFetching = false
		})
	},
	reducers: {
		addToCart: (state, { payload }: PayloadAction<string>) => {
			const index = state.products.findIndex(
				({ productId }) => productId === payload
			)
			if (index === -1) {
				state.products.push({
					checked: false,
					productId: payload,
					quantity: 1,
				})
			} else {
				++state.products[index].quantity
			}
		},
		rmFromCart: (state, { payload }: PayloadAction<string>) => {
			const index = state.products.findIndex(
				({ productId }) => productId === payload
			)
			if (index !== -1) {
                if (state.products[index].quantity === 1) {
                    state.products.splice(index, 1)
                }
                else {
                    --state.products[index].quantity
                }
			}
		},
		setQuantity: (state, {payload}: PayloadAction<{productId: string, quantity: number}>) => {
			const index = state.products.findIndex(
				({ productId }) => productId === payload.productId
			)
			if (index !== -1) {
				if (payload.quantity === 0) {
					state.products.splice(index, 1)
				} else {
					state.products[index].quantity = payload.quantity
				}
			}
		}
	},
})

export const { addToCart, rmFromCart, setQuantity } = cartSlice.actions

export default cartSlice