import { ICatalog, IProduct } from "./../../shared/index.d"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const moySkladApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/moy-sklad" }),
	endpoints: (build) => ({
		getMoySklad: build.query<{catalogs: ICatalog[], products: IProduct[], catalog?: ICatalog}, string | undefined>({
			query: (id) => `/folder/${id ? id : ''}`,
			providesTags: () => ["folder"],
		}),
		getFreeProducts: build.query<{catalogs: ICatalog[], products: IProduct[], catalog?: ICatalog}, string | undefined>({
			query: (id) => `/folder-free-products/${id ? id : ''}`
		}),
		syncMoySklad: build.mutation({
			query: () => "/sync",
			invalidatesTags: ["folder"],
		}),
	}),
	reducerPath: "moySkladApi",
	tagTypes: ["folder"],
})

export const { useGetFreeProductsQuery, useGetMoySkladQuery, useSyncMoySkladMutation } = moySkladApi

export default moySkladApi