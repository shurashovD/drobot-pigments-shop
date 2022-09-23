import { ICart, ISdekPoints } from './../../shared/index.d';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const orderApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/orders" }),
	endpoints: (build) => ({
		createOrder: build.mutation<{ url: string; orderNumber: string }, void>({
			query: () => ({
				method: "POST",
				url: "/",
			}),
		}),
		getCart: build.query<ICart, { checkedVariants?: string[]; checkedProducts?: string[] } | undefined>({
			query: (body) => `/cart?products=${JSON.stringify(body?.checkedProducts || [])}&variants=${JSON.stringify(body?.checkedVariants || [])}`,
			providesTags: () => ["cart"],
		}),
		changeProductInCart: build.mutation<undefined, { productId: string; quantity: number }>({
			query: (body) => ({
				body,
				method: "PUT",
				url: "/cart/product",
			}),
			invalidatesTags: ["cart"],
		}),
		changeVariantInCart: build.mutation<undefined, { productId: string; variantId: string; quantity: number }>({
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
		resetCheckProducts: build.mutation<undefined, void>({
			query: () => ({
				method: "PUT",
				url: "/cart/check/reset",
			}),
			invalidatesTags: ["cart"],
		}),
		toggleCheckAll: build.mutation<undefined, void>({
			query: () => ({
				method: "PUT",
				url: "/cart/check/toggle-all",
			}),
			invalidatesTags: ["cart"],
		}),
		toggleCheckOne: build.mutation<undefined, { productId: string; variantId?: string }>({
			query: (body) => ({
				body,
				method: "PUT",
				url: "/cart/check/toggle",
			}),
			invalidatesTags: ["cart"],
		}),
		resetPromocode: build.mutation<undefined, void>({
			query: () => ({
				method: "DELETE",
				url: "/cart/promocode",
			}),
			invalidatesTags: ["cart"],
		}),
		toggleUseCahback: build.mutation<undefined, void>({
			query: () => ({
				method: "PUT",
				url: "/cart/use-cashback-toggle",
			}),
			invalidatesTags: ["cart"],
		}),
		setPromocode: build.mutation<{ message?: string }, { code: string }>({
			query: (body) => ({
				body,
				method: "PUT",
				url: "/cart/promocode",
			}),
			invalidatesTags: ["cart"],
		}),
		getRelevantCities: build.query<{ city: string; city_code: number }[], string>({
			query: (str) => `/delivery/cities/${str}`,
		}),
		getDeliveryCity: build.query<{ region: string; city: string; city_code?: number }, undefined>({
			query: () => "/delivery/city",
			providesTags: () => ["deliveryCity"],
		}),
		setDeliveryCity: build.mutation<undefined, { city_code: number }>({
			query: ({ city_code }) => ({
				method: "PUT",
				url: `/set/city/${city_code}`,
			}),
			invalidatesTags: ["deliveryCity", "points", "deliveryDetail", 'deliveryWays'],
		}),
		getDeliveryDetail: build.query<
			{
				pickup?: boolean
				sdek?: boolean
				tariff_code?: number
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
		getDeliveryWays: build.query<{ pickup?: boolean; sdek?: boolean }, void>({
			query: () => "/delivery/ways",
			providesTags: () => ['deliveryWays']
		}),
		setDeliveryDetail: build.mutation<
			undefined,
			{
				pickup: boolean
				sdek: boolean
				tariff_code?: number
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
		checkPaymentProbably: build.query<{ status: string; title: string; func: string }, { orderNumber: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/check-payment/probably",
			}),
		}),
	}),
	reducerPath: "orderApi",
	tagTypes: ["cart", "orders", "deliveryCity", "deliveryDetail", "recipient", "points", 'deliveryWays'],
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
	useGetDeliveryWaysQuery,
	useSetDeliveryDetailMutation,
	useGetPointsQuery,
	useCheckNumberInitMutation,
	useCheckNumberPinMutation,
	useGetRecipientQuery,
	useSetRecipientMutation,
	useCheckPaymentProbablyQuery,
	useResetCheckProductsMutation,
	useToggleCheckAllMutation,
	useToggleCheckOneMutation,
	useSetPromocodeMutation,
	useResetPromocodeMutation,
	useToggleUseCahbackMutation,
} = orderApi

export default orderApi