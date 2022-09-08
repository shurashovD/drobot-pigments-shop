import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ICategory, ICategorySiteProduct } from '../../shared'

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
			{ length: number; products: ICategorySiteProduct[] },
			{
				id: string
				filters?: string[][]
				limit?: number
				page?: number
				sortByPrice?: boolean
				variantsFilter?: string[]
				minPrice?: number
				maxPrice?: number
			}
		>({
			query: ({ id, filters, limit, page, sortByPrice, maxPrice, minPrice, variantsFilter }) => {
				let url = `/products-and-variants/${id}`
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
				if (variantsFilter) {
					url += `&variantsFilter=${JSON.stringify(variantsFilter)}`
				}
				if (maxPrice) {
					url += `&maxPrice=${maxPrice}`
				}
				if (minPrice) {
					url += `&minPrice=${minPrice}`
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