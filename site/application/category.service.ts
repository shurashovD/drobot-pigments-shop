import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ICategory, ICategorySiteProduct, ICategorySiteSubcategory } from '../../shared'

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
		getSubCategories: build.query<ICategorySiteSubcategory[], { parentCategoryId: string }>({
			query: ({ parentCategoryId }) => `/subcategories/${parentCategoryId}`,
		}),
		getProducts: build.query<
			{ length: number; products: ICategorySiteProduct[]; filtersFieldsLength: { fieldId: string; productsLength: number }[] },
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
	useGetSubCategoriesQuery,
} = categoryApi

export default categoryApi