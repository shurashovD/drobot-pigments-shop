import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createApi } from '@reduxjs/toolkit/query/react'
import { IClient } from '../../shared';

const accountApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/account" }),
	endpoints: (build) => ({
		accountAuth: build.query<IClient | undefined, undefined>({
			query: () => "/auth",
			providesTags: () => ["client"],
		}),
		checkNumber: build.mutation<undefined, { phone: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/auth/check-number",
			}),
		}),
		checkPin: build.mutation<undefined, { pin: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/auth/check-pin",
			}),
		}),
		register: build.mutation<undefined, { phone: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/register",
			}),
		}),
		registerCheckPin: build.mutation<undefined, { pin: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/register/check-pin",
			}),
		}),
		setClaimedStatus: build.mutation<undefined, { claimedStatus: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/change-status-request",
			}),
			invalidatesTags: ['client']
		}),
	}),
	reducerPath: "accountApi",
	tagTypes: ["client"],
})

export const {
    useAccountAuthQuery,
    useCheckNumberMutation,
    useCheckPinMutation,
    useRegisterMutation,
    useRegisterCheckPinMutation,
	useSetClaimedStatusMutation,
} = accountApi

export default accountApi