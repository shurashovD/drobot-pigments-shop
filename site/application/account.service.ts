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
		logout: build.mutation<undefined, void>({
			query: () => ({
				method: "POST",
				url: "/logout",
			}),
			invalidatesTags: ["client"],
		}),
		checkNumber: build.mutation<undefined, { phone: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/auth/check-number",
			}),
		}),
		checkPass: build.mutation<undefined, { pass: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/auth/check-pass",
			}),
			invalidatesTags: ["client"],
		}),
		checkPin: build.mutation<undefined, { pin: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/auth/check-pin",
			}),
			invalidatesTags: ["client"],
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
			invalidatesTags: ["client"],
		}),
		registerInsertPass: build.mutation<undefined, { pass: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/register/insert-pass",
			}),
			invalidatesTags: ["client"],
		}),
		setClaimedStatus: build.mutation<undefined, { claimedStatus: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/change-status-request",
			}),
			invalidatesTags: ["client"],
		}),
		updatePass: build.mutation<undefined, { pass: string }>({
			query: (body) => ({
				body,
				method: "PUT",
				url: "/update-pass",
			}),
		}),
	}),
	reducerPath: "accountApi",
	tagTypes: ["client"],
})

export const {
    useAccountAuthQuery,
	useCheckPassMutation,
	useRegisterInsertPassMutation,
	useLogoutMutation,
    useCheckNumberMutation,
    useCheckPinMutation,
    useRegisterMutation,
    useRegisterCheckPinMutation,
	useSetClaimedStatusMutation,
	useUpdatePassMutation,
} = accountApi

export default accountApi