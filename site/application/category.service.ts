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
	}),
	reducerPath: "categoryApi",
	tagTypes: ["categories", "products", "category"],
})

export const {
	useGetCategoriesQuery,
	useGetCategoryByIdQuery,
	useGetProductsQuery,
} = categoryApi

export default categoryApi