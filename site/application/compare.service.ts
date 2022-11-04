import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICompareReport, Product } from '../../shared';

const compareApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/compare" }),
	endpoints: (build) => ({
		clearProducts: build.mutation<undefined, { categoryId: string }>({
			query: ({ categoryId }) => ({
				method: "DELETE",
				url: `/category/${categoryId}`,
			}),
			invalidatesTags: ["categories", "compare", "goods"],
		}),
		getCompare: build.query<{ id: string; productId: string; variantId?: string }[], void>({
			query: () => "/",
			providesTags: () => ["compare"],
		}),
		getCategories: build.query<{ id: string; title: string; length: number }[], void>({
			query: () => "/categories",
			providesTags: () => ["categories"],
		}),
		getProducts: build.query<ICompareReport, { categoryId: string }>({
			query: ({ categoryId }) => `/products-by-category/${categoryId}`,
			providesTags: () => ["goods"],
		}),
		addToCompareList: build.mutation<undefined, { productId: string; variantId?: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/good",
			}),
			invalidatesTags: ["categories", "compare", "goods"],
		}),
		rmFromCompareList: build.mutation<undefined, { goodId: string }>({
			query: ({ goodId }) => ({
				method: "DELETE",
				url: `/good/${goodId}`,
			}),
			invalidatesTags: ["categories", "compare", "goods"],
		}),
	}),
	reducerPath: "compareApi",
	tagTypes: ["categories", "goods", "compare"],
})

export const {
    useAddToCompareListMutation,
	useClearProductsMutation,
    useGetCategoriesQuery,
    useGetCompareQuery,
    useGetProductsQuery,
    useRmFromCompareListMutation
} = compareApi
export default compareApi