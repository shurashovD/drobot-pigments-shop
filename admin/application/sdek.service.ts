import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ISdekCreateWebhookPayload, ISdekWebhookInfo } from "../../shared"

const sdekApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/sdek" }),
	endpoints: (build) => ({
		syncPoints: build.mutation({
			query: () => ({
				method: "POST",
				url: "/update-pvz",
			}),
		}),
		getHooks: build.query<ISdekWebhookInfo[], void>({
			query: () => "/hooks",
			providesTags: () => ["hooks"],
		}),
		createHook: build.mutation<undefined, ISdekCreateWebhookPayload>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/hooks",
			}),
			invalidatesTags: ['hooks']
		}),
		deleteHook: build.mutation<undefined, { id: string }>({
			query: (id) => ({
				method: "DELETE",
				url: `/hooks/${id}`,
			}),
			invalidatesTags: ['hooks']
		}),
	}),
	reducerPath: "sdekApi",
	tagTypes: ["hooks"],
})

export const {
	useSyncPointsMutation,
	useGetHooksQuery,
	useCreateHookMutation,
	useDeleteHookMutation,
} = sdekApi

export default sdekApi