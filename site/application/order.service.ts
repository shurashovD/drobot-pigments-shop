import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IOrder, IOrderPop } from '../../shared'

const orderApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/orders" }),
	endpoints: (build) => ({
		getCartTotal: build.query<
			number,
			{
				products: { productId: string; quantity: number }[]
				variants: {
					productId: string
					variantId: string
					quantity: number
				}[]
			}
		>({
			query: ({ products, variants }) =>
				`/cart-total?products=${JSON.stringify(
					products
				)}&variants=${JSON.stringify(variants)}`,
		}),
		createOrder: build.mutation<
			string,
			{
				tel: string
				address: string
				products: { productId: string; quantity: number }[]
				variants: {
					variantId: string
					productId: string
					quantity: number
				}[]
			}
		>({
			query: ({ address, products, tel, variants }) => ({
				body: {
					address, tel, products: JSON.stringify(products), variants: JSON.stringify(variants)
				},
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