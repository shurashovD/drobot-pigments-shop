import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Product } from '../../shared'

const productApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/products" }),
	endpoints: (build) => ({
		getProductById: build.query<Product, string>({
			query: (id) => `/${id}`,
			providesTags: () => ["product"],
		}),
		getVariant: build.query<
			Product['variants'][0],
			{ productId: string; variantId: string }
		>({
			query: ({ productId, variantId }) =>
				`/variant/${variantId}?productId=${productId}`,
			providesTags: () => ["product"],
		}),
	}),
	reducerPath: "productApi",
	tagTypes: ["product"],
})

export const {
	useGetProductByIdQuery,
	useGetVariantQuery,
	useLazyGetVariantQuery,
	useLazyGetProductByIdQuery
} = productApi

export default productApi