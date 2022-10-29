import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICompareReport, Product } from '../../shared';

const compareApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/compare" }),
	endpoints: (build) => ({
        getCompare: build.query<{ id: string, productId: string, variantId?: string }[], void>({
            query: () => '/',
            providesTags: () => ['compare']
        }),
		getCategories: build.query<{ id: string; title: string; length: number }[], void>({
			query: () => "/categories",
			providesTags: () => ["categories"],
		}),
		getProducts: build.query<Product[], { categoryId: string }>({
			query: ({ categoryId }) => `/products-by-category/${categoryId}`,
			providesTags: () => ["goods"],
		}),
		getReport: build.query<ICompareReport, { firstGoodId: string; secondGoodId: string }>({
			query: ({ firstGoodId, secondGoodId }) => `/compare/${firstGoodId}/${secondGoodId}`,
            providesTags: () => ['report']
		}),
		addToCompareList: build.mutation<undefined, { productId: string; variantId?: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/good",
			}),
			invalidatesTags: ["compare"],
		}),
		rmFromCompareList: build.mutation<undefined, { goodId: string }>({
			query: ({ goodId }) => ({
				method: "DELETE",
				url: `/good/${goodId}`,
			}),
			invalidatesTags: ["compare", "report"],
		}),
	}),
    reducerPath: 'compareApi',
	tagTypes: ["categories", "goods", "report", "compare"],
})

export const {
    useAddToCompareListMutation,
    useGetCategoriesQuery,
    useGetCompareQuery,
    useGetProductsQuery,
    useGetReportQuery,
    useRmFromCompareListMutation
} = compareApi
export default compareApi