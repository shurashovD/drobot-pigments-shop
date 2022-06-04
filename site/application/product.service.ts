import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Product } from '../../shared'

const productApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/products" }),
	endpoints: (build) => ({
		getProductById: build.query<Product, string>({
			query: (id) => `/${id}`,
			providesTags: () => ["product"],
		}),
	}),
	reducerPath: "productApi",
	tagTypes: ["product"],
})

export const {
	useGetProductByIdQuery,
} = productApi

export default productApi