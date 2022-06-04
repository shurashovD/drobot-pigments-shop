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
		createBind: build.mutation<
			undefined,
			{ id: string; body: { bindTitle: string; productLabel: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "POST",
				url: `/bind/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		updateBind: build.mutation<
			undefined,
			{
				id: string
				body: {
					bindId: string
					bindTitle: string
					productLabel: string
				}
			}
		>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/bind/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		rmBind: build.mutation<
			undefined,
			{ id: string; body: { bindId: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "DELETE",
				url: `/bind/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		setProductBind: build.mutation<
			undefined,
			{
				id: string
				body: { bindId: string; bindLabel: string; productId: string }
			}
		>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/bind-product/${id}`,
			}),
		}),
		resetProductBind: build.mutation<
			undefined,
			{ id: string; body: { bindId: string; productId: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "DELETE",
				url: `/bind-product/${id}`,
			}),
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
	useCreateBindMutation,
	useUpdateBindMutation,
	useRmBindMutation,
	useSetProductBindMutation,
	useResetProductBindMutation,
} = productApi

export default productApi