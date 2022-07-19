import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const amoApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/amo" }),
	endpoints: (build) => ({
		checkAuth: build.query<
			{ message: string; tokenIsActual: boolean },
			undefined
		>({
			query: () => "/check-auth",
			providesTags: () => ["actual"],
		}),
		auth: build.mutation<undefined, { code: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/auth",
			}),
			invalidatesTags: ["actual"],
		}),
	}),
	reducerPath: "amoApi",
	tagTypes: ["actual"],
})

export const { useCheckAuthQuery, useAuthMutation } = amoApi

export default amoApi