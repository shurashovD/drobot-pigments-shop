import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IOrder, IOrderPop } from '../../shared'

const orderApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/orders" }),
	endpoints: (build) => ({
		
	}),
	reducerPath: "orderApi",
	tagTypes: ['orders'],
})

export const {  } = orderApi

export default orderApi