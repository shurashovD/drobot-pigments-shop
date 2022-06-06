import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IOrder, IOrderPop } from '../../shared'

const orderApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/orders" }),
	endpoints: (build) => ({
		getCartTotal: build.query<
			number,
			{ productId: string; quantity: number }[]
		>({
			query: (prodIds) =>
				`/cart-total?products=${JSON.stringify(prodIds)}`,
		}),
		createOrder: build.mutation<
			string,
			{
				tel: string
				address: string
				products: string
			}
		>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/",
			}),
		}),
	}),
	reducerPath: "orderApi",
	tagTypes: ["orders"],
})

export const { useCreateOrderMutation, useLazyGetCartTotalQuery } = orderApi

export default orderApi