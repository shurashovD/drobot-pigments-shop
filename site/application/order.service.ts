import { ICart, ISdekPoints } from './../../shared/index.d';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const orderApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/orders" }),
	endpoints: (build) => ({
		createOrder: build.mutation<{ url: string; orderNumber: string }, { products: string[]; variants: string[] }>({
			query: ({ products, variants }) => ({
				body: {
					products: JSON.stringify(products),
					variants: JSON.stringify(variants),
				},
				method: "POST",
				url: "/",
			}),
		}),
		getCart: build.query<ICart, { checkedVariants?: string[]; checkedProducts?: string[] } | undefined>({
			query: (body) => `/cart?products=${JSON.stringify(body?.checkedProducts || [])}&variants=${JSON.stringify(body?.checkedVariants || [])}`,
			providesTags: () => ["cart"],
		}),
		changeProductInCart: build.mutation<
			undefined,
			{ productId: string; quantity: number; checkedVariants?: string[]; checkedProducts?: string[] }
		>({
			query: (body) => ({
				body,
				method: "PUT",
				url: "/cart/product",
			}),
			invalidatesTags: ["cart"],
		}),
		changeVariantInCart: build.mutation<
			undefined,
			{ productId: string; variantId: string; quantity: number; checkedVariants?: string[]; checkedProducts?: string[] }
		>({
			query: (body) => ({
				body,
				method: "PUT",
				url: "/cart/variant",
			}),
			invalidatesTags: ["cart"],
		}),
		deleteFromCart: build.mutation<
			undefined,
			{ productIds: string[]; variantIds: string[]; checkedVariants?: string[]; checkedProducts?: string[] }
		>({
			query: ({ productIds, variantIds }) => ({
				method: "DELETE",
				url: `/cart?productIds=${JSON.stringify(productIds)}&variantIds=${JSON.stringify(variantIds)}`,
			}),
			invalidatesTags: ["cart"],
		}),
		getRelevantCities: build.query<{ city: string; city_code: number }[], string>({
			query: (str) => `/delivery/cities/${str}`,
		}),
		getDeliveryCity: build.query<string, undefined>({
			query: () => "/delivery/city",
			providesTags: () => ["deliveryCity"],
		}),
		setDeliveryCity: build.mutation<undefined, { city_code: number }>({
			query: ({ city_code }) => ({
				method: "PUT",
				url: `/set/city/${city_code}`,
			}),
			invalidatesTags: ["deliveryCity", "points"],
		}),
		getDeliveryDetail: build.query<
			{
				sdek: boolean
				tariff_code: number
				address?: string
				code?: string
				period_max?: number
				period_min?: number
				total_sum?: number
			},
			undefined
		>({
			query: () => "/delivery/detail",
			providesTags: () => ["deliveryDetail"],
		}),
		setDeliveryDetail: build.mutation<
			undefined,
			{
				sdek: boolean
				tariff_code: number
				address?: string
				code?: string
			}
		>({
			query: (body) => ({
				body,
				method: "PUT",
				url: "/set/delivery",
			}),
			invalidatesTags: ["deliveryDetail", "points"],
		}),
		getPoints: build.query<ISdekPoints[], undefined>({
			query: () => "/delivery/points",
			providesTags: () => ["points"],
		}),
		checkNumberInit: build.mutation<undefined, string>({
			query: (phone) => ({
				body: { phone },
				method: "POST",
				url: "/check-number/init",
			}),
		}),
		checkNumberPin: build.mutation<undefined, string>({
			query: (pin) => ({
				body: { pin },
				method: "POST",
				url: "/check-number/pin",
			}),
			invalidatesTags: ["recipient"],
		}),
		getRecipient: build.query<{ phone: string; name?: string; mail?: string }, undefined>({
			query: () => "/delivery/recipient",
			providesTags: () => ["recipient"],
		}),
		setRecipient: build.mutation<undefined, { name: string; mail: string }>({
			query: (body) => ({
				body,
				method: "PUT",
				url: "/delivery/recipient",
			}),
			invalidatesTags: ["recipient"],
		}),
		checkPaymentProbably: build.query<{ status: string }, { orderNumber: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/check-payment/probably",
			}),
		}),
	}),
	reducerPath: "orderApi",
	tagTypes: ["cart", "orders", "deliveryCity", "deliveryDetail", "recipient", "points"],
})

export const {
	useCreateOrderMutation,
	useGetCartQuery,
	useChangeProductInCartMutation,
	useChangeVariantInCartMutation,
	useDeleteFromCartMutation,
	useSetDeliveryCityMutation,
	useGetDeliveryCityQuery,
	useGetRelevantCitiesQuery,
	useGetDeliveryDetailQuery,
	useSetDeliveryDetailMutation,
	useGetPointsQuery,
	useCheckNumberInitMutation,
	useCheckNumberPinMutation,
	useGetRecipientQuery,
	useSetRecipientMutation,
	useCheckPaymentProbablyQuery,
} = orderApi

export default orderApi