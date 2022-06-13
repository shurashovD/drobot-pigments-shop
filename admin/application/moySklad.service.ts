import { ICatalog, IMSHook, IProduct } from "./../../shared/index.d"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const moySkladApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/moy-sklad" }),
	endpoints: (build) => ({
		getMoySklad: build.query<
			{ catalogs: ICatalog[]; products: IProduct[]; catalog?: ICatalog },
			string | undefined
		>({
			query: (id) => `/folder/${id ? id : ""}`,
			providesTags: () => ["folder"],
		}),
		getFreeProducts: build.query<
			{ catalogs: ICatalog[]; products: IProduct[]; catalog?: ICatalog },
			string | undefined
		>({
			query: (id) => `/folder-free-products/${id ? id : ""}`,
		}),
		syncMoySklad: build.mutation({
			query: () => "/sync",
			invalidatesTags: ["folder"],
		}),
		getHooks: build.query<IMSHook[], undefined>({
			query: () => "/hooks",
			providesTags: () => ["hooks"],
		}),
		createHook: build.mutation<
			undefined,
			{ payload: IMSHook }
		>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/hooks",
			}),
			invalidatesTags: ["hooks"],
		}),
		disableHook: build.mutation<undefined, { id: string }>({
			query: ({ id }) => ({
				method: "PUT",
				url: `/hooks/disable/${id}`,
			}),
			invalidatesTags: ["hooks"],
		}),
		enableHook: build.mutation<undefined, { id: string }>({
			query: ({ id }) => ({
				method: "PUT",
				url: `/hooks/enable/${id}`,
			}),
			invalidatesTags: ["hooks"],
		}),
		deleteHook: build.mutation<undefined, { id: string }>({
			query: ({ id }) => ({
				method: "DELETE",
				url: `/hooks/${id}`,
			}),
			invalidatesTags: ["hooks"],
		}),
	}),
	reducerPath: "moySkladApi",
	tagTypes: ["folder", "hooks"],
})

export const {
	useGetFreeProductsQuery,
	useGetMoySkladQuery,
	useSyncMoySkladMutation,
	useGetHooksQuery,
	useCreateHookMutation,
	useEnableHookMutation,
	useDisableHookMutation,
	useDeleteHookMutation
} = moySkladApi

export default moySkladApi