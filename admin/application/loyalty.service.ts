import { IDelegateDiscount, IAgentDiscount } from './../../shared/index.d';
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ICommonDiscount } from "../../shared"

const loyaltyApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/loyalty" }),
	endpoints: (build) => ({
		getAllCommonLoyalty: build.query<ICommonDiscount[], undefined>({
			query: () => "/common",
			providesTags: () => ["commonLoyalty"],
		}),
		createCommonLoyalty: build.mutation<undefined, { lowerTreshold: number; percentValue: number }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/common",
			}),
			invalidatesTags: ["commonLoyalty"],
		}),
		updateCommonLoyalty: build.mutation<undefined, { body: { lowerTreshold: number; percentValue: number }; id: string }>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/common/${id}`,
			}),
			invalidatesTags: ["commonLoyalty"],
		}),
		deleteCommonLoyalty: build.mutation<undefined, { id: string }>({
			query: ({ id }) => ({
				method: "DELETE",
				url: `/common/${id}`,
			}),
			invalidatesTags: ["commonLoyalty"],
		}),

		getAllDelegateLoyalty: build.query<IDelegateDiscount[], undefined>({
			query: () => "/delegate",
			providesTags: () => ["delegataLoyalty"],
		}),
		createDelegateLoyalty: build.mutation<undefined, { lowerTreshold: number; percentValue: number }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/delegate",
			}),
			invalidatesTags: ["delegataLoyalty"],
		}),
		updateDelegateLoyalty: build.mutation<undefined, { body: { lowerTreshold: number; percentValue: number }; id: string }>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/delegate/${id}`,
			}),
			invalidatesTags: ["delegataLoyalty"],
		}),
		deleteDelegateLoyalty: build.mutation<undefined, { id: string }>({
			query: ({ id }) => ({
				method: "DELETE",
				url: `/delegate/${id}`,
			}),
			invalidatesTags: ["delegataLoyalty"],
		}),

		getAllAgentLoyalty: build.query<IAgentDiscount, undefined>({
			query: () => "/agent",
			providesTags: () => ["agentLoyalty"],
		}),
		createAgentLoyalty: build.mutation<undefined, { percentValue: number }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/agent",
			}),
			invalidatesTags: ["agentLoyalty"],
		}),
		deleteAgentLoyalty: build.mutation({
			query: () => ({
				method: "DELETE",
				url: `/agent`,
			}),
			invalidatesTags: ["agentLoyalty"],
		}),
	}),
	reducerPath: "loyaltyApi",
	tagTypes: ["commonLoyalty", "delegataLoyalty", "agentLoyalty"],
})

export const {
    useGetAllCommonLoyaltyQuery,
    useCreateCommonLoyaltyMutation,
    useUpdateCommonLoyaltyMutation,
    useDeleteCommonLoyaltyMutation,
	useGetAllAgentLoyaltyQuery,
	useCreateAgentLoyaltyMutation,
	useDeleteAgentLoyaltyMutation,
	useGetAllDelegateLoyaltyQuery,
	useCreateDelegateLoyaltyMutation,
	useUpdateDelegateLoyaltyMutation,
	useDeleteDelegateLoyaltyMutation
} = loyaltyApi

export default loyaltyApi