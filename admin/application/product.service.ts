import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Product } from '../../shared'

const productApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/products" }),
	endpoints: (build) => ({
		getProductById: build.query<Product, string>({
			query: (id) => `/${id}`,
			providesTags: () => ["product"],
		}),
		setProductPhoto: build.mutation<
			undefined,
			{ id: string; body: FormData }
		>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/photo/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		rmProductPhoto: build.mutation<undefined, string>({
			query: (id) => ({
				method: "DELETE",
				url: `/photo/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		setProductDescription: build.mutation<
			undefined,
			{ id: string; body: { description: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/description/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		setProductFilter: build.mutation<
			undefined,
			{ id: string; body: { fieldId: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/filter/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		resetProductFilter: build.mutation<
			undefined,
			{ id: string; body: { fieldId: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "DELETE",
				url: `/filter/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
	}),
	reducerPath: "productApi",
	tagTypes: ["product"],
})

export const {
	useGetProductByIdQuery, 
	useSetProductPhotoMutation,
	useRmProductPhotoMutation,
	useSetProductDescriptionMutation,
	useSetProductFilterMutation,
	useResetProductFilterMutation,
} = productApi

export default productApi