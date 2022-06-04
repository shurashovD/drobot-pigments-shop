import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IOrder, IOrderPop } from '../../shared'

const orderApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/orders" }),
	endpoints: (build) => ({
		getOrders: build.query<IOrderPop[], {filters?: string[][], limit?: number, page?: number}>({
			query: ({filters, limit, page}) => {
				let url = '/'
				if ( filters ) {
					url += `?${JSON.stringify(filters)}`
				}
				if ( limit && page ) {
					url += `&limit=${limit}&page=${page}`
				}
				return { url }
			},
			providesTags: () => ['orders']
		}),
		getOrderById: build.query<IOrderPop, string>({
			query: (id) => `/${id}`
		}),
		updateOrder: build.mutation<undefined, {id: string, body: IOrder}>({
			query: () => '/',
		})
	}),
	reducerPath: "orderApi",
	tagTypes: ['orders'],
})

export const { useGetOrdersQuery, useGetOrderByIdQuery, useUpdateOrderMutation } = orderApi

export default orderApi