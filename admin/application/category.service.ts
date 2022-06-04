import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ICategory, Product } from '../../shared'

const categoryApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/categories" }),
	endpoints: (build) => ({
		getCategories: build.query<ICategory[], undefined>({
			query: () => "/",
			providesTags: () => ["categories"],
		}),
		getCategoryById: build.query<ICategory, string>({
			query: (id: string) => `/${id}`,
			providesTags: () => ["category"],
		}),
		getProducts: build.query<
			{ length: number; products: Product[] },
			{
				id: string
				filters?: string[][]
				limit?: number
				page?: number
				sortByPrice?: boolean
			}
		>({
			query: ({ id, filters, limit, page, sortByPrice }) => {
				let url = `/products/${id}`
				if (filters) {
					url += `?filters=${JSON.stringify(filters)}`
				}
				if (limit) {
					url += `&limit=${limit}`
				}
				if (page) {
					url += `&page=${page}`
				}
				if (sortByPrice) {
					url += "&sortByPrice=true"
				}
				return url
			},
			providesTags: () => ["products"],
		}),
		createCategory: build.mutation<undefined, string>({
			query: (title) => ({
				body: { title },
				method: "POST",
				url: "/",
			}),
			invalidatesTags: ["categories"],
		}),
		updateCategory: build.mutation<
			undefined,
			{ id: string; body: { description: string; title: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/${id}`,
			}),
			invalidatesTags: ["categories"],
		}),
		deleteCategory: build.mutation<undefined, string>({
			query: (id) => ({
				method: "DELETE",
				url: `/${id}`,
			}),
			invalidatesTags: ["categories"],
		}),
		uploadPhoto: build.mutation<undefined, { id: string; body: FormData }>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/photo/${id}`,
			}),
			invalidatesTags: ["categories"],
		}),
		deletePhoto: build.mutation<undefined, string>({
			query: (id) => ({
				method: "DELETE",
				url: `/photo/${id}`,
			}),
			invalidatesTags: ["categories"],
		}),
		createFilter: build.mutation<undefined, { id: string; title: string }>({
			query: ({ id, title }) => ({
				body: { title },
				method: "POST",
				url: `/filter/${id}`,
			}),
			invalidatesTags: ["categories", "category"],
		}),
		updateFilter: build.mutation<
			undefined,
			{ id: string; body: { filterId: string; title: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/filter/${id}`,
			}),
			invalidatesTags: ["categories", "category"],
		}),
		deleteFilter: build.mutation<
			undefined,
			{ id: string; body: { filterId: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "DELETE",
				url: `/filter/${id}`,
			}),
			invalidatesTags: ["categories", "category"],
		}),
		addFilterValue: build.mutation<
			undefined,
			{ id: string; body: { filterId: string; value: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "POST",
				url: `/filter/value/${id}`,
			}),
			invalidatesTags: ["categories", "category"],
		}),
		updateFilterValue: build.mutation<
			undefined,
			{
				id: string
				body: { filterId: string; fieldId: string; value: string }
			}
		>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/filter/value/${id}`,
			}),
			invalidatesTags: ["categories", "category"],
		}),
		deleteFilterValue: build.mutation<
			undefined,
			{ id: string; body: { filterId: string; fieldId: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "DELETE",
				url: `/filter/value/${id}`,
			}),
			invalidatesTags: ["categories", "category"],
		}),
		addProduct: build.mutation<
			undefined,
			{ id: string; body: { products: string[] } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "POST",
				url: `/products/${id}`,
			}),
			invalidatesTags: ["categories", "category"],
		}),
		rmProduct: build.mutation<
			undefined,
			{ id: string; body: { productId: string } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "DELETE",
				url: `/products/${id}`,
			}),
			invalidatesTags: ["categories", "category"],
		}),
	}),
	reducerPath: "categoryApi",
	tagTypes: ["categories", "products", "category"],
})

export const {
	useGetCategoriesQuery,
	useGetCategoryByIdQuery,
	useGetProductsQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeletePhotoMutation,
	useDeleteCategoryMutation,
	useUploadPhotoMutation,
	useCreateFilterMutation,
	useUpdateFilterMutation,
	useDeleteFilterMutation,
	useAddFilterValueMutation,
	useUpdateFilterValueMutation,
	useDeleteFilterValueMutation,
	useAddProductMutation,
	useRmProductMutation,
} = categoryApi

export default categoryApi